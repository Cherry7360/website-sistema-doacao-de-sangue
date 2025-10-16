


import { useEffect, useState } from "react";
import axios from "axios";

const DoacaoDoador = ({ id_doador }) => {
  const [formData, setFormData] = useState({ data_agendamento: "", horario: "", obs: "" });
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [infoDoador, setInfoDoador] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);

  const base = "http://localhost:5080/doacoes";

  // Carregar dados iniciais
  useEffect(() => {
    if (id_doador) {
      fetchInfoDoador();
      fetchAgendamentos();
      fetchNotificacoes();
    }
  }, [id_doador]);

  const fetchInfoDoador = async () => {
    try {
      const res = await axios.get(`${base}/doadores/${id_doador}`);
      setInfoDoador(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAgendamentos = async () => {
    try {
      const res = await axios.get(`${base}/agendamentos/meus/${id_doador}`);
      setAgendamentos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotificacoes = async () => {
    try {
      const res = await axios.get(`${base}/notificacoes/doador/${id_doador}`);
      setNotificacoes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErro("");
    setMensagem("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataSelecionada = new Date(formData.data_agendamento);
    const diaSemana = dataSelecionada.getDay();
    if (diaSemana === 0 || diaSemana === 6) {
      setErro("Não é possível agendar aos fins de semana.");
      return;
    }

    const [hora] = formData.horario.split(":").map(Number);
    if (hora < 8 || hora >= 15) {
      setErro("Horário deve ser entre 08:00 e 15:00.");
      return;
    }

    try {
      await axios.post(`${base}/agendamentos/agendar_doador`, { ...formData, id_doador });
      setMensagem("Agendamento enviado! Aguarde confirmação.");
      setFormData({ data_agendamento: "", horario: "", obs: "" });
      fetchAgendamentos();
    } catch (err) {
      console.error(err);
      setErro("Erro ao agendar. Tente novamente.");
    }
  };

  const marcarComoLida = async (id_notificacao) => {
    try {
      await axios.put(`${base}/notificacoes/marcar/${id_notificacao}`);
      fetchNotificacoes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Formulário de Agendamento */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-center">Agendar Doação</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="date"
            name="data_agendamento"
            value={formData.data_agendamento}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            type="time"
            name="horario"
            value={formData.horario}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <textarea
            name="obs"
            value={formData.obs}
            onChange={handleChange}
            placeholder="Observações (opcional)"
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Agendar
          </button>
        </form>
        {erro && <p className="text-red-600 mt-2">{erro}</p>}
        {mensagem && <p className="text-green-700 mt-2">{mensagem}</p>}
      </div>

      {/* Card informativo do doador */}
      {infoDoador && (
        <div className="bg-gray-50 p-6 rounded shadow flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-center">Informações do Doador</h2>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-red-100 text-red-800 p-2 rounded text-center">
              <p className="text-sm font-semibold">Tipo Sanguíneo</p>
              <h2 className="text-xl font-bold">{infoDoador.tipo_sangue || "—"}</h2>
            </div>
            <div className="bg-blue-100 text-blue-800 p-2 rounded text-center">
              <p className="text-sm font-semibold">Doações</p>
              <h2 className="text-xl font-bold">{infoDoador.total_doacoes || 0}</h2>
            </div>
            <div className="bg-green-100 text-green-800 p-2 rounded text-center">
              <p className="text-sm font-semibold">Última Doação</p>
              <h2 className="text-lg font-medium">
                {infoDoador.ultima_doacao?.data_doacao || "Nenhuma"}
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* Lista de notificações */}
      <div className="bg-white p-6 rounded shadow col-span-2">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Notificações</h2>
        {notificacoes.length === 0 ? (
          <p className="text-gray-500 text-center">Sem notificações.</p>
        ) : (
          notificacoes.map((n) => (
            <div
              key={n.id_notificacao}
              className={`p-3 rounded shadow flex justify-between items-center mb-2 ${
                n.visto ? "bg-gray-100" : "bg-yellow-100"
              }`}
            >
              <div>
                <p className="font-medium text-gray-800">{n.mensagem}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {new Date(n.data_envio).toLocaleString()}
                </p>
              </div>
              {!n.visto && (
                <button
                  onClick={() => marcarComoLida(n.id_notificacao)}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Marcar como lida
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Lista de agendamentos pendentes */}
      <div className="bg-white p-6 rounded shadow col-span-2">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Agendamentos</h2>
        {agendamentos.length === 0 ? (
          <p className="text-gray-500 text-center">Nenhum agendamento.</p>
        ) : (
          agendamentos.map((a) => (
            <div
              key={a.id_agendamento}
              className={`p-3 rounded shadow mb-2 ${
                a.estado === "pendente" ? "bg-yellow-100" : "bg-gray-100"
              }`}
            >
              <p>
                <strong>Data:</strong> {a.data_agendamento} <strong>Hora:</strong> {a.horario}
              </p>
              <p>
                <strong>Estado:</strong> {a.estado}
              </p>
              {a.obs && <p className="text-sm text-gray-600">{a.obs}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoacaoDoador;











