import { useNavigate } from 'react-router-dom';


const NaoAutorizado = () => {

  const navigate = useNavigate();

   function voltarParaHome(){
        navigate('/paginaprincipal');
    }
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
      <p className="text-lg">Você não tem permissão para acessar esta página.</p>
      <div>    
        <button className="bg-red-600 rounded-lg text-white hover:bg-red-700" onClick={voltarParaHome}>
          Voltar para Home</button></div>
    </div>
  );
};

export default NaoAutorizado;
