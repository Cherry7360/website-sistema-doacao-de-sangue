import { useNavigate } from 'react-router-dom';
import Button from "../../components/Button";

// Componente que exibe a página de acesso não autorizado (403)
const NotAuthorized = () => {
  const navigate = useNavigate();

  // Função que redireciona o usuário para a página principal
  function voltarParaHome() {
    navigate('/paginaprincipal');
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen text-center space-y-3">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
        <p className="text-2xl font-semibold">Acesso não autorizado</p>

        <div>    
          <Button 
            className="w-150 bg-white text-red-600 border border-red-600 py-3 px-6 rounded-lg hover:bg-red-600 hover:text-white"  
            onClick={voltarParaHome}
          >
            Voltar
          </Button>
        </div>
      </div>   
    </div>
  );
};

export default NotAuthorized;
