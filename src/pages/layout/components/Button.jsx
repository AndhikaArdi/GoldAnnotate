const variants = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  danger: "text-danger hover:bg-red-50",
};

const sizes = {
  md: "px-5 py-2 text-sm",
  sm: "px-3 py-1.5 text-xs",
};

const Spinner = () => {
  return (
    <svg
      className="mr-2 h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
};

// loading = true: tombol menampilkan spinner dan tidak bisa diklik.
const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) => {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center rounded-md font-medium disabled:cursor-not-allowed ${
        loading ? "disabled:opacity-70" : "disabled:opacity-40"
      } ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
};

export default Button;

const closeTones = {
  neutral: "text-gray-500 hover:text-gray-800",
  danger: "text-gray-400 hover:text-red-600",
};

// Dipakai di Modal (neutral) dan kartu aspek di QuestionCard (danger).
export const CloseButton = ({
  tone = "neutral",
  label = "Tutup",
  ...props
}) => {
  return (
    <button
      type="button"
      aria-label={label}
      className={`transition-colors ${closeTones[tone]}`}
      {...props}
    >
      ✕
    </button>
  );
};
