import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../components/Modal";

const base = "http://localhost:5080/agendamentos"; 

const AgendamentoFuncionario = () => {
  const [search, setSearch] = useState("");
  const [agendamentos, setAgendamentos] = useState([]);
  const [mostrar, setMostrar] = useState(false);
  const [formData, setFormData] = useState({
    id_doador: "",
    data_agendamento: "",
    horario: "",
    obs: "",
  });
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const fetchAgendamentos = async () => {
    try {
      const res = await axios.get(base,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
       console.log("Dados recebidos:", res.data); 
      setAgendamentos(res.data);
    } catch (err) {
      console.error("Erro ao carregar agendamentos:", err);
    }
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(base, formData);
      fetchAgendamentos();
      setMostrar(false);
      setFormData({ id_doador: "", data_agendamento: "", horario: "", obs: "" });
    } catch (err) {
      console.error("Erro ao criar agendamento:", err);
    }
  };

  const handleEstado = async (id, estado) => {
    try {
      await axios.put(`${base}/${id}`, { estado });
      fetchAgendamentos();
    } catch (err) {
      console.error("Erro ao atualizar estado:", err);
    }
  };

  const handleRemover = async (id) => {
    try {
      await axios.delete(`${base}/${id}`);
      fetchAgendamentos();
    } catch (err) {
      console.error("Erro ao remover agendamento:", err);
    }
  };

  return (
  <div className="items-center justify-center p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Lista de agendamento</h2>
        <button onClick={() => setMostrar(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Adicionar</button>
      </div>

   <  div className="mb-4 flex gap-2">
        <input type="text" placeholder="Pesquisar " value={search} onChange={(e) => setSearch(e.target.value)} className="border rounded-lg px-3 py-2 w-full" />
      </div>

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 border p-2">Doador</th>
            <th className="px-4 border p-2">Data</th>
            <th className="px-4 border p-2">Horário</th>
            <th className="px-4 border p-2">Obs</th>
            <th className="px-4 border p-2">Estado</th>
            <th className="px-4 border p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {agendamentos.map((ag) => (
            <tr key={ag.id_agendamento}>
              <td className="border p-2">{ag.Doador?.Usuario?.nome}</td>
              <td className="border p-2">{new Date(ag.data).toLocaleDateString()}</td>
              <td className="border p-2">{ag.horario}</td>
              <td className="border p-2">{ag.obs || "-"}</td>
              <td className="border p-2">
                <span
                  className={`px-2 py-1 rounded ${
                    ag.estado === "pendente"
                      ? "bg-yellow-200 text-yellow-800"
                      : ag.estado === "aceite"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {ag.estado}
                </span>
              </td>
            <td className="border p-2 flex gap-2">
            {ag.estado === "pendente" && (
              <>
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded"
                  onClick={() => handleEstado(ag.id_agendamento, "aceite")}
                >
                  Aceitar
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleEstado(ag.id_agendamento, "rejeitado")}
                >
                  Rejeitar
                </button>
              </>
            )}
          <button
            className="bg-gray-600 text-white px-2 py-1 rounded"
            onClick={() => handleRemover(ag.id_agendamento)}
          >
            Remover
          </button>
          </td>
        </tr>
        ))}
      </tbody>
        </table>

      {mostrar && (
        <Modal fechar={() => setMostrar(false)} titulo="Novo Agendamento">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <input
              type="number"
              name="id_doador"
              placeholder="ID do Doador"
              value={formData.id_doador}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="date"
              name="data_agendamento"
              value={formData.data_agendamento}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="time"
              name="horario"
              value={formData.horario}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <textarea
              name="obs"
              placeholder="Observações"
              value={formData.obs}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Salvar
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AgendamentoFuncionario;
