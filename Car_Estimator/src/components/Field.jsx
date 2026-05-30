export function TextField({ id, label, icon: Icon, value, onChange, options = [], placeholder, error }) {
  const listId = `${id}-options`;

  return (
    <label className="field" htmlFor={id}>
      <span className="field__label">
        {Icon ? <Icon aria-hidden="true" size={18} /> : null}
        {label}
      </span>
      <input
        id={id}
        list={options.length > 0 ? listId : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        aria-invalid={Boolean(error)}
      />
      {options.length > 0 ? (
        <datalist id={listId}>
          {options.map((option, index) => (
            <option key={`${option}-${index}`} value={option} />
          ))}
        </datalist>
      ) : null}
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  );
}

export function NumberField({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  min,
  max,
  error,
}) {
  return (
    <label className="field" htmlFor={id}>
      <span className="field__label">
        {Icon ? <Icon aria-hidden="true" size={18} /> : null}
        {label}
      </span>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        inputMode="numeric"
        aria-invalid={Boolean(error)}
      />
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  );
}

export function SelectField({ id, label, icon: Icon, value, onChange, options, placeholder, error }) {
  return (
    <label className="field" htmlFor={id}>
      <span className="field__label">
        {Icon ? <Icon aria-hidden="true" size={18} /> : null}
        {label}
      </span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  );
}
