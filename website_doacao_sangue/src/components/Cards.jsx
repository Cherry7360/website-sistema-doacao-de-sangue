
const Card = ({children,className = "",}) => {
  return (
    <div className={`bg-white rounded shadow ${className}`}>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default Card;
