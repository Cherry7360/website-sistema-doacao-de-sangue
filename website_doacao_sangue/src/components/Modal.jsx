const Modal = ({ mostrar, fechar, titulo, children })=>{

    if (!mostrar) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">

        {titulo && <h2 className="text-xl font-bold mb-4 text-center">{titulo}</h2>}

        <div>{children}</div>

     
        <button
          onClick={fechar}
          className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
        >
          Fechar
        </button>
      </div>
    </div>);
}
export default Modal;