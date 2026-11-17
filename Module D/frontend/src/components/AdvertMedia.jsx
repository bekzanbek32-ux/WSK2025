import { useEffect, useState } from "react";
import { toAssetUrl } from "../api/client";
import { getCategoryIcon, getCategoryTone } from "../constants";
import Icon from "./Icon";
import "./AdvertMedia.css";

export default function AdvertMedia({
  src,
  alt = "",
  category,
  showLabel = false,
  className = "",
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const tone = getCategoryTone(category);
  const icon = getCategoryIcon(category?.name);

  if (src && !failed) {
    return (
      <img
        src={toAssetUrl(src)}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={className || undefined}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className={`media-placeholder media-placeholder--${tone} ${className}`.trim()}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
    >
      <Icon name={icon} size={42} strokeWidth={1.3} className="media-placeholder__icon" />
      {showLabel ? (
        <span className="media-placeholder__label">{category?.name || "Без категории"}</span>
      ) : null}
    </div>
  );
}
