const Card = ({ as: Tag = "div", className = "", ...props }) => {
  return (
    <Tag
      className={`rounded-[10px] border border-line bg-white shadow-sm ${className}`}
      {...props}
    />
  );
};

export default Card;
