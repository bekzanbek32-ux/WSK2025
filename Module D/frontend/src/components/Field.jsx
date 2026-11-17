import Icon from "./Icon";

export default function Field({
  label,
  htmlFor,
  hint,
  error,
  required: isRequired,
  counter,
  children,
  className = "",
}) {
  return (
    <div className={`field ${className}`.trim()}>
      {label ? (
        <label className="field__label" htmlFor={htmlFor}>
          <span>
            {label}
            {isRequired ? (
              <span className="field__required" aria-hidden="true">
                {" "}
                *
              </span>
            ) : null}
          </span>
          {counter ? <span className="field__counter">{counter}</span> : null}
        </label>
      ) : null}

      {children}

      {error ? (
        <span className="field__error" role="alert">
          <Icon name="alert-circle" size={13} />
          {error}
        </span>
      ) : hint ? (
        <span className="field__hint">{hint}</span>
      ) : null}
    </div>
  );
}
