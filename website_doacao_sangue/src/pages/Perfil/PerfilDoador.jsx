import { useEffect, useState } from "react";
import axios from "axios";
import { HiPencil,HiBriefcase, HiMail, HiPhone, HiLocationMarker, HiLockClosed } from "react-icons/hi";
import Modal from "../../components/Modal";
import Card from "../../components/Cards";
import Button from "../../components/Button"

const base= "http://localhost:5080"

 const  PerfilDoador= () =>  {
    const [atualizarsenha, setAtualizarSenha] = useState(false);
    const [atualizarDados, setAtualizarDados] = useState(false);
  const [historico, setHistorico] = useState([]);
   const [erro, setErro] = useState("");

    
  const [perfil, setPerfil] = useState(null);

  const token = localStorage.getItem("token"); 

const fetchHistorico = async () => {
    try {
      const res = await axios.get(`${base}/doadores/historico_doacoes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    const historicoConcluido = res.data.filter(d => d.estado === "Concluída");

    setHistorico(historicoConcluido);
  } catch (err) {
      console.error(err);
      setErro("Não foi possível carregar o histórico.");
    }
  };

  
  useEffect(() => {
    axios.get(`${base}/doadores/perfil`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPerfil(res.data))
    .catch(err => console.error(err));
    fetchHistorico()
  }, []);

  if (!perfil) return <p>Carregando...</p>;

  


  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
 
      <Card className="bg-white p-6 rounded-2xl shadow flex flex-col">
        <div className="flex items-center gap-4 w-full">

          <img
            src={`http://localhost:5080${perfil?.Usuario?.foto}`}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
          />

          <div>
            <h2 className="text-xl font-semibold">{perfil.Usuario.nome}</h2>
            <p className="text-gray-600">
              Tipo Sanguíneo: <span className="font-medium">{perfil.tipo_sangue}</span>
            </p>
          </div>

          <Button
            onClick={() => setAtualizarDados(true)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-auto"
          >
              <HiPencil size={18} />
          </Button>
        </div>

                
        
      </Card>

<Card className="bg-white p-6 rounded-2xl shadow">
    
  
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-gray-800">Informações Pessoais</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="flex items-center gap-2">
        <HiBriefcase className="w-5 h-5 text-gray-400" />
        <div>
          <p className="text-sm text-gray-500">Profissão</p>
          <p className="font-medium">{perfil.profissao}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <HiMail className="w-5 h-5 text-gray-400" />
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{perfil.Usuario.email}</p>
        </div>
      </div>
 <div className="flex items-center gap-2">
        <HiPhone className="w-5 h-5 text-gray-400" />
        <div>
          <p className="text-sm text-gray-500">Telefone</p>
          <p className="font-medium">{perfil.Usuario.telefone}</p>
        </div>
      </div>
<div className="flex items-center gap-2">
        <HiLocationMarker className="w-5 h-5 text-gray-400" />
        <div>
          <p className="text-sm text-gray-500">Morada</p>
          <p className="font-medium">{perfil.Usuario.morada}</p>
        </div>
      </div>
 <div className="flex items-center gap-2">
        <HiLockClosed className="w-5 h-5 text-gray-400" />
        <div>
          <p className="text-sm text-gray-500">Senha</p>
          <button 
            onClick={() => setAtualizarSenha(true)} 
            className="text-blue-600 hover:underline text-sm"
          >
            Alterar senha
          </button>
        </div>
      </div>

    </div>
</Card>
 

<Card className="bg-white p-6 rounded shadow col-span-2">
  <h2 className="text-xl font-bold mb-4 text-gray-800">Histórico de Doações</h2>

  {historico.length === 0 ? (
    <p className="text-gray-500 text-center">Nenhuma doação.</p>
  ) : (
    historico.map(d => (
      <div
        key={d.id_doacao}
        className="p-4 rounded-lg shadow-sm mb-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex justify-between items-center mb-1">
          <p className="text-gray-700">
            <strong>Data:</strong> {new Date(d.data_doacao).toLocaleDateString("pt-PT")}
          </p>
          <span
            className={`px-2 py-1 rounded text-sm font-semibold ${
              d.estado === "Concluída"
                ? "bg-green-200 text-green-800"
                : d.estado === "Pendente"
                ? "bg-yellow-200 text-yellow-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {d.estado}
          </span>
        </div>
      </div>
    ))
  )}
</Card>

     
     
   
      <Modal mostrar={atualizarDados} fechar={() => setAtualizarDados(false)} title="Editar Perfil">
        <form className="space-y-4">
          <input type="text" placeholder="Nome" className="w-full border rounded p-2" />
          <input type="email" placeholder="Email" className="w-full border rounded p-2" />
          <input type="text" placeholder="Telefone" className="w-full border rounded p-2" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Salvar
          </button>
        </form>
      </Modal>


      <Modal mostrar={atualizarsenha} fechar={() => setAtualizarSenha(false)} title="Alterar Senha">
        <form className="space-y-4">
          <input type="password" placeholder="Senha atual" className="w-full border rounded p-2" />
          <input type="password" placeholder="Nova senha" className="w-full border rounded p-2" />
          <input type="password" placeholder="Confirmar nova senha" className="w-full border rounded p-2" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Alterar
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default PerfilDoador;

/*
     
      <Button
        onClick={() => setAtualizarDados(true)}
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Editar
      </Button>*/
