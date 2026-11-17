import { useEffect, useRef, useState } from "react";
import AdvertMedia from "./AdvertMedia";
import Icon from "./Icon";
import "./Carousel.css";

export default function Carousel({ photos = [], alt = "", category }) {
  const safePhotos = photos.filter(Boolean);
  const signature = safePhotos.join("|");
  const count = safePhotos.length;
  const [index, setIndex] = useState(0);
  const touch = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    setIndex(0);
  }, [signature]);

  const goTo = (nextIndex) => {
    if (count < 2) return;

    setIndex(((nextIndex % count) + count) % count);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    }
  };

  const handleTouchStart = (event) => {
    const point = event.touches[0];

    touch.current = { x: point.clientX, y: point.clientY, active: true };
  };

  const handleTouchEnd = (event) => {
    if (!touch.current.active) return;

    const point = event.changedTouches[0];
    const dx = point.clientX - touch.current.x;
    const dy = point.clientY - touch.current.y;

    touch.current.active = false;

    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;

    goTo(dx > 0 ? index - 1 : index + 1);
  };

  const current = safePhotos[index] || "";

  return (
    <section
      className="carousel"
      aria-roledescription="карусель"
      aria-label={`Фотографии объявления${count ? `: ${count}` : ""}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="carousel__stage">
        <AdvertMedia
          key={current || "placeholder"}
          src={current}
          alt={count ? `${alt} — фото ${index + 1} из ${count}` : alt}
          category={category}
          showLabel
          className="carousel__image"
        />

        {count > 1 ? (
          <>
            <button
              type="button"
              className="carousel__arrow carousel__arrow--prev"
              onClick={() => goTo(index - 1)}
              aria-label="Предыдущее фото"
            >
              <Icon name="chevron-left" size={22} />
            </button>

            <button
              type="button"
              className="carousel__arrow carousel__arrow--next"
              onClick={() => goTo(index + 1)}
              aria-label="Следующее фото"
            >
              <Icon name="chevron-right" size={22} />
            </button>

            <span className="carousel__counter" aria-live="polite">
              {index + 1} / {count}
            </span>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="carousel__thumbs" aria-label="Миниатюры фотографий">
          {safePhotos.map((photo, photoIndex) => (
            <button
              key={`${photo.slice(-24)}-${photoIndex}`}
              type="button"
              className={`carousel__thumb${photoIndex === index ? " is-active" : ""}`}
              onClick={() => goTo(photoIndex)}
              aria-label={`Показать фото ${photoIndex + 1}`}
              aria-current={photoIndex === index}
            >
              <AdvertMedia
                src={photo}
                alt=""
                category={category}
                className="carousel__thumb-image"
              />
            </button>
          ))}
        </div>
      ) : null}

      {count > 1 ? (
        <p className="carousel__hint">
          <Icon name="image" size={13} />
          Листайте стрелками, свайпом или выберите миниатюру
        </p>
      ) : null}
    </section>
  );
}
