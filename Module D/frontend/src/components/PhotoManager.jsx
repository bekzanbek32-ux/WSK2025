import { useRef, useState } from "react";
import { toAssetUrl } from "../api/client";
import { compressImageFile } from "../utils/images";
import Icon from "./Icon";
import "./PhotoManager.css";

const MAX_PHOTOS = 5;

export default function PhotoManager({ photos = [], onChange, error }) {
  const inputRef = useRef(null);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [dragging, setDragging] = useState(false);

  const addPhotos = async (fileList) => {
    const files = Array.from(fileList || []).filter((file) =>
      file.type.startsWith("image/"),
    );

    setLocalError("");

    if (!files.length) {
      setLocalError("Выберите файлы изображений (JPG, PNG, WebP).");
      return;
    }

    if (photos.length >= MAX_PHOTOS) {
      setLocalError(`Можно добавить не более ${MAX_PHOTOS} фотографий.`);
      return;
    }

    setUploading(true);

    const next = [...photos];

    for (const file of files) {
      if (next.length >= MAX_PHOTOS) break;

      try {
        const dataUrl = await compressImageFile(file);

        if (!next.includes(dataUrl)) next.push(dataUrl);
      } catch (uploadError) {
        setLocalError(uploadError.message);
      }
    }

    onChange(next);
    setUploading(false);

    if (inputRef.current) inputRef.current.value = "";
  };

  const addUrl = () => {
    const value = url.trim();

    setLocalError("");

    if (!value) return;

    if (!/^(https?:\/\/|data:image\/)/i.test(value) && !value.startsWith("/")) {
      setLocalError("Вставьте ссылку, начинающуюся с http:// или https://.");
      return;
    }

    if (value.length > 2048) {
      setLocalError("Слишком длинная ссылка: максимум 2048 символов.");
      return;
    }

    if (photos.includes(value)) {
      setLocalError("Такая фотография уже добавлена.");
      return;
    }

    if (photos.length >= MAX_PHOTOS) {
      setLocalError(`Можно добавить не более ${MAX_PHOTOS} фотографий.`);
      return;
    }

    onChange([...photos, value]);
    setUrl("");
  };

  const removePhoto = (index) => {
    setLocalError("");
    onChange(photos.filter((_, photoIndex) => photoIndex !== index));
  };

  const makeCover = (index) => {
    if (index === 0) return;

    const next = [...photos];
    const [photo] = next.splice(index, 1);

    onChange([photo, ...next]);
  };

  const move = (index, direction) => {
    const target = index + direction;

    if (target < 0 || target >= photos.length) return;

    const next = [...photos];
    const [photo] = next.splice(index, 1);

    next.splice(target, 0, photo);
    onChange(next);
  };

  return (
    <div className="photo-manager">
      <div
        className={`photo-drop${dragging ? " is-dragging" : ""}${uploading ? " is-uploading" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addPhotos(event.dataTransfer.files);
        }}
      >
        <span className="photo-drop__icon" aria-hidden="true">
          {uploading ? <span className="spinner spinner--lg" /> : <Icon name="upload" size={24} />}
        </span>

        <div className="photo-drop__text">
          <strong>
            {uploading ? "Сжимаем фотографии..." : "Перетащите фото сюда"}
          </strong>
          <span>JPG, PNG или WebP · до 12 МБ · не более {MAX_PHOTOS} штук</span>
        </div>

        <button
          type="button"
          className="btn btn--outline btn--sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || photos.length >= MAX_PHOTOS}
        >
          <Icon name="image" size={15} />
          Выбрать файлы
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(event) => addPhotos(event.target.files)}
        />
      </div>

      <div className="photo-url">
        <span className="input-group">
          <span className="input-group__icon" aria-hidden="true">
            <Icon name="link" size={16} />
          </span>
          <input
            type="url"
            className="input"
            placeholder="Или вставьте ссылку на изображение"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addUrl();
              }
            }}
          />
        </span>

        <button
          type="button"
          className="btn btn--outline"
          onClick={addUrl}
          disabled={!url.trim() || photos.length >= MAX_PHOTOS}
        >
          <Icon name="plus" size={15} />
          Добавить
        </button>
      </div>

      {localError || error ? (
        <span className="field__error" role="alert">
          <Icon name="alert-circle" size={13} />
          {localError || error}
        </span>
      ) : null}

      {photos.length ? (
        <ul className="photo-grid">
          {photos.map((photo, index) => (
            <li className="photo-tile" key={`${photo.slice(-32)}-${index}`}>
              <img src={toAssetUrl(photo)} alt={`Фотография ${index + 1}`} loading="lazy" />

              {index === 0 ? <span className="photo-tile__cover">Главное</span> : null}

              <div className="photo-tile__actions">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Переместить левее"
                >
                  <Icon name="chevron-left" size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === photos.length - 1}
                  aria-label="Переместить правее"
                >
                  <Icon name="chevron-right" size={15} />
                </button>
              </div>

              <div className="photo-tile__bar">
                {index !== 0 ? (
                  <button type="button" onClick={() => makeCover(index)}>
                    Сделать главной
                  </button>
                ) : (
                  <span>Обложка объявления</span>
                )}

                <button
                  type="button"
                  className="photo-tile__remove"
                  onClick={() => removePhoto(index)}
                  aria-label={`Удалить фотографию ${index + 1}`}
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="photo-manager__empty">
          Добавьте хотя бы одну фотографию — объявления с фото получают больше
          откликов.
        </p>
      )}
    </div>
  );
}
