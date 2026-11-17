const MAX_FILE_SIZE = 12 * 1024 * 1024;
const MAX_DATA_URL_LENGTH = 2000; // API validates each photo with max:2048

function loadBitmap(file) {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(file);
  }

  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Не удалось прочитать изображение"));
    };
    image.src = url;
  });
}

function draw(bitmap, maxSide, quality) {
  const canvas = document.createElement("canvas");
  const ratio = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));

  canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
  canvas.height = Math.max(1, Math.round(bitmap.height * ratio));

  const context = canvas.getContext("2d");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  return canvas.toDataURL("image/jpeg", quality);
}

/**
 * Turns an uploaded file into a compact JPEG data-URL that fits the API
 * photo field. Larger files are downscaled/compressed progressively.
 */
export async function compressImageFile(file) {
  if (!file) throw new Error("Файл не выбран");
  if (!file.type.startsWith("image/")) throw new Error("Выберите файл изображения");
  if (file.size > MAX_FILE_SIZE) throw new Error("Файл больше 12 МБ");

  const bitmap = await loadBitmap(file);
  const sizes = [720, 560, 440, 340, 260, 200, 170, 140, 120, 100];
  const qualities = [0.72, 0.62, 0.52, 0.42, 0.34, 0.28];

  try {
    for (const size of sizes) {
      for (const quality of qualities) {
        const dataUrl = draw(bitmap, size, quality);

        if (dataUrl.length <= MAX_DATA_URL_LENGTH) return dataUrl;
      }
    }
  } finally {
    if (typeof bitmap.close === "function") bitmap.close();
  }

  throw new Error(
    "Изображение слишком подробное для загрузки. Попробуйте файл поменьше или вставьте ссылку.",
  );
}
