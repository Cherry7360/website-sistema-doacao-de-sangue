import { useNavigate } from 'react-router-dom';

const PaginaErro = () => {
    const navigate = useNavigate();

    function voltarParaHome(){
        navigate('/paginaprincipal');
    }
    return (
        <div>
            <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
            <p className="text-lg">Página não encontrada. </p>
     
            <button className="w-150 bg-red-600 text-white py-2 rounded-lg  hover:bg-red-700"
                onClick={voltarParaHome}
            >Voltar para Home</button>
        </div>
        </div>
    );
};

export default PaginaErro;