import { useState } from "react";

const Notificacoes = () => {
  const [tab, setTab] = useState("recebidas");

  return (
    <div className="items-center justify-center p-6 bg-slate-400">
      <h2 className="text-xl font-bold mb-4">Notificações</h2>

      {/* Tabs */}
      <div className="flex gap-4 border-b mb-4">
        <button
          className={`pb-2 ${tab === "recebidas" ? "border-b-2 border-red-600 font-semibold" : ""}`}
          onClick={() => setTab("recebidas")}
        >
          Recebidas
        </button>

        <button
          className={`pb-2 ${tab === "historico" ? "border-b-2 border-red-600 font-semibold" : ""}`}
          onClick={() => setTab("historico")}
        >
          Histórico
        </button>
      </div>
        

      {/* Conteúdo das Tabs */}
      {tab === "recebidas" && (
        <div>
            <div className="flex justify-between items-center mb-4">
       <button
          
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Enviar
        </button>
      </div>
          <ul className="space-y-2">
            <li className="p-3 bg-gray-100 rounded flex justify-between">
              <span>Campanha de doação amanhã</span>
              <div className="flex gap-2">
                <button className="text-blue-600">Marcar como lida</button>
                <button className="text-red-600">Eliminar</button>
              </div>
            </li>
          </ul>
        </div>
      )}

      

      {tab === "historico" && (
        <div>
          <h2 className="text-xl font-bold">Histórico de Notificações</h2>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Data</th>
                <th className="border p-2">Título</th>
                <th className="border p-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">20/09/2025</td>
                <td className="border p-2">Campanha Setembro</td>
                <td className="border p-2">Enviada</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Notificacoes;

/*{tab === "enviar" && (
        <div>
          <h3 className="font-bold mb-2">Enviar Notificação</h3>
          <form className="space-y-2">
            <input
              type="text"
              placeholder="Título"
              className="w-full border px-3 py-2 rounded"
            />
            <textarea
              placeholder="Mensagem"
              className="w-full border px-3 py-2 rounded"
            />
            <select className="w-full border px-3 py-2 rounded">
              <option>Todos os doadores</option>
              <option>Doadores específicos</option>
            </select>
            <button className="bg-red-600 text-white px-4 py-2 rounded">
              Enviar
            </button>
          </form>
        </div>
      )}*/
