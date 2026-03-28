
const  Button =({ children, onClick, type = "submit", className = "", ...props })=> {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`   
     ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
export default Button


