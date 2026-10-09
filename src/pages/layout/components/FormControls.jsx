export const Label = ({ htmlFor, required = false, children }) => {
  return (
    <label htmlFor={htmlFor} className="font-medium">
      {children}
      {required && <span className="text-danger">*</span>}
    </label>
  );
};

export const TextInput = (props) => {
  return (
    <input
      className="mt-2 block w-full border-0 border-b border-gray-300 bg-transparent py-1 text-sm outline-none placeholder:text-gray-500 focus:border-b-2 focus:border-brand aria-invalid:border-danger"
      {...props}
    />
  );
};

export const Radio = ({ label, compact = false, ...props }) => {
  return (
    <label
      className={`flex items-center ${compact ? "gap-2" : "gap-3 py-1.5"}`}
    >
      <input type="radio" className="h-4 w-4 accent-brand" {...props} />
      {label}
    </label>
  );
};

export const Checkbox = ({ label, ...props }) => {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" className="h-4 w-4 accent-brand" {...props} />
      {label}
    </label>
  );
};

// Teks error kecil di bawah field. Pasang `key` yang berubah dari luar
// (lihat errorKey) supaya animasi highlight diputar ulang.
export const FieldError = ({ id, message }) => {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="-ml-1 mt-1 inline-block rounded px-1 text-xs text-danger animate-flash-error motion-reduce:animate-none"
    >
      {message}
    </p>
  );
};

export const FormField = ({
  id,
  label,
  required,
  error,
  errorKey,
  ...inputProps
}) => {
  return (
    <div className="border-t border-line px-5 py-4">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <TextInput
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...inputProps}
      />
      <FieldError key={errorKey} id={`${id}-error`} message={error} />
    </div>
  );
};
