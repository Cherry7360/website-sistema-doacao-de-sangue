// src/pages/PerfilDoador.jsx
import { useState } from "react";
import Modal from "../../components/Modal";

const PerfilDoador = () => {
  const [doacoes] = useState([
    { id: 1, data: "12/08/2025", local: "Hospital Central", status: "Concluída" },
    { id: 2, data: "10/05/2025", local: "Hospital Regional", status: "Concluída" },
    { id: 3, data: "15/02/2025", local: "Centro de Saúde", status: "Agendada" },
  ]);

    const [atualizarsenha, setAtualizarSenha] = useState(false);
    const [atualizarDados, setAtualizarDados] = useState(false);
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="bg-white p-6 rounded-2xl shadow flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src="https://via.placeholder.com/80"
            alt="Foto de Perfil"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">João Silva</h2>
            <p className="text-gray-600">Tipo Sanguíneo: <span className="font-medium">O+</span></p>
          </div>
        </div>
        <button onClick={() => setAtualizarDados(true)}
         className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Editar
        </button>
        
      </div>

      {/* Informações Pessoais */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">joao.silva@email.com</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Telefone</p>
            <p className="font-medium">+238 900 0000</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Senha</p>
            <button onClick={() => setAtualizarSenha(true)} className="text-blue-600 hover:underline text-sm">Alterar senha</button>
          </div>
        </div>
      </div>

      {/* Histórico de Doações */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-lg font-semibold mb-4">Histórico de Doações</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-gray-600 text-sm">Data</th>
              <th className="p-2 text-gray-600 text-sm">Local</th>
              <th className="p-2 text-gray-600 text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {doacoes.map((d) => (
              <tr key={d.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{d.data}</td>
                <td className="p-2">{d.local}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      d.status === "Concluída"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal Editar Perfil */}
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

      {/* Modal Alterar Senha */}
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
