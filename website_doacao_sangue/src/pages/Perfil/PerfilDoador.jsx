import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../../components/Modal";

const base= "http://localhost:5080"

export default function PerfilDoador() {
    const [atualizarsenha, setAtualizarSenha] = useState(false);
    const [atualizarDados, setAtualizarDados] = useState(false);

    
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); 

    axios.get(`${base}/doadores/perfil`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPerfil(res.data))
    .catch(err => console.error(err));
  }, []);

  if (!perfil) return <p>Carregando...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
 
      <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-between">
        <div className="flex items-center gap-4">
         <img
            src={`http://localhost:5080${perfil?.Usuario?.foto}` } 
            alt="Foto de Perfil"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">{perfil.Usuario.nome}</h2>
            <p className="text-gray-600">Tipo Sanguíneo: <span className="font-medium">{perfil.tipo_sangue}</span></p>
          </div>
        </div>
        <button onClick={() => setAtualizarDados(true)}
         className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Editar
        </button>
        
      </div>


      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
            <p className="text-sm text-gray-500">Profissão</p>
            <p className="font-medium"> {perfil.profissao}</p>
          </div>  
        <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{perfil.Usuario.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Telefone</p>
            <p className="font-medium">{perfil.Usuario.telefone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Morada</p>
            <p className="font-medium">{perfil.Usuario.morada}</p>
          </div>
           
          <div>
            <p className="text-sm text-gray-500">Senha</p>
            <button onClick={() => setAtualizarSenha(true)} className="text-blue-600 hover:underline text-sm">Alterar senha</button>
          </div>
        </div>
      </div>

 
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4">Histórico de Doações</h3>
        
      </div>
   
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

