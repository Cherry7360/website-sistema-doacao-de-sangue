const Modal = ({ mostrar, fechar, titulo, children }) => {
  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl md:max-w-5xl p-6 md:p-8 relative flex flex-col">

    
        <button
          onClick={fechar}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
        {titulo && <h2 className="text-2xl font-bold mb-6 text-center">{titulo}</h2>}
        <div className="flex flex-col w-full gap-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
