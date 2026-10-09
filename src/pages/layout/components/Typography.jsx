const helperTones = {
  muted: "text-gray-500",
  danger: "text-danger",
};

export const FormTitle = ({ children }) => {
  return <h1 className="text-2xl font-semibold">{children}</h1>;
};

export const SectionTitle = ({ className = "", ...props }) => {
  return (
    <h2
      className={`text-sm font-semibold tracking-wide ${className}`}
      {...props}
    />
  );
};

export const HelperText = ({ tone = "muted", className = "", ...props }) => {
  return (
    <p className={`text-xs ${helperTones[tone]} ${className}`} {...props} />
  );
};
