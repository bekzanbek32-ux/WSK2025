import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function Brand({ compact = false, to = "/" }) {
  return (
    <Link className="brand" to={to} aria-label="Geek Market — на главную">
      <span className="brand__mark" aria-hidden="true">
        <Icon name="tag" size={19} strokeWidth={2} />
      </span>
      {compact ? null : (
        <span className="brand__text">
          Geek<span className="brand__accent">Market</span>
        </span>
      )}
    </Link>
  );
}
