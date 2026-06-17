type CampoProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
};

// Campo de formulario reutilizable (input o textarea) con etiqueta.
export function Campo({
  label,
  value,
  onChange,
  textarea = false,
  placeholder,
}: CampoProps) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}
