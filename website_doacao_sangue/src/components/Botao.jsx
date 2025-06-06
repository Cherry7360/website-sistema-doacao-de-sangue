
const  Botao =({ children, onClick, type = "button", className = "", ...props })=> {
  return (
    <button
      type={type}
      onClick={onClick}
      className={'w-full bg-vermelhosg text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 ${className}'}
      {...props}
    >
      {children}
    </button>
  );
}
export default Botao