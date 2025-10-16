import { useEffect, useState } from "react";
import axios from "axios";

const base = "http://localhost:5080/agendamentos";

const AgendamentoDoador = () => {
  const [formData, setFormData] = useState({ data_agendamento: "", horario: "", obs: "" });
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [infoDoador, setInfoDoador] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [proximoAgendamento, setProximoAgendamento] = useState(null);
  const [ultimaDoacao, setUltimaDoacao] = useState(null); 

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchInfoDoador();
    fetchHistorico();
  }, []);

  const fetchInfoDoador = async () => {
    try {
      const res = await axios.get(`${base}/info_doador`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInfoDoador(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistorico = async () => {
    try {
      const res = await axios.get(`${base}/historico`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistorico(res.data);

      const proximoagendamento = res.data
        .filter(a => a.estado === "pendente" || a.estado === "confirmado")
        .sort((a, b) => new Date(a.data_agendamento + " " + a.horario) - new Date(b.data_agendamento + " " + b.horario));
      setProximoAgendamento(proximoagendamento[0] || null);
    } catch (err) {
      console.error(err);
      setErro("Não foi possível carregar o histórico.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErro("");
    setMensagem("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [ano, mes, dia] = formData.data_agendamento.split("-");
    const dataSelecionada = new Date(ano, mes - 1, dia);
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
      await axios.post(`${base}/agendar_doador`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMensagem("Agendamento enviado! Aguarde confirmação.");
      setFormData({ data_agendamento: "", horario: "", obs: "" });
      fetchHistorico();
      fetchInfoDoador();
    } catch (err) {
      console.error(err);
      setErro(err.response?.data?.mensagem || "Erro ao agendar. Tente novamente.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Formulário */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-center">Agendar Doação</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input type="date" name="data_agendamento" value={formData.data_agendamento} onChange={handleChange} className="border p-2 rounded" required />
          <input type="time" name="horario" value={formData.horario} onChange={handleChange} className="border p-2 rounded" required />
          <textarea name="obs" value={formData.obs} onChange={handleChange} placeholder="Observações (opcional)" className="border p-2 rounded" />
          <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Agendar</button>
        </form>
        {erro && <p className="text-red-600 mt-2">{erro}</p>}
        {mensagem && <p className="text-green-700 mt-2">{mensagem}</p>}
      </div>

      {/* Card do doador */}
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
              <h2 className="text-lg font-medium">{infoDoador.ultima_doacao?.data_agendamento || "Nenhuma"}</h2>
            </div>
          </div>

          {proximoAgendamento && (
        <div className="mt-4 bg-yellow-100 p-3 rounded shadow text-center">
          <p className="font-semibold">Próximo Agendamento</p>
          <p>Data: {proximoAgendamento.data_agendamento}</p>
          <p>Hora: {proximoAgendamento.horario}</p>
        </div>
      )}

      {/* Última Doação */}
      {ultimaDoacao && (
        <div className="mt-4 bg-green-100 p-3 rounded shadow text-center">
          <p className="font-semibold">Última Doação</p>
          <p>Data: {ultimaDoacao.data_agendamento}</p>
          <p>Hora: {ultimaDoacao.horario}</p>
        </div>
      )}

        </div>
      )}

      {/* Histórico */}
      <div className="bg-white p-6 rounded shadow col-span-2">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Histórico de Agendamentos</h2>
        {historico.length === 0 ? (
          <p className="text-gray-500 text-center">Nenhuma doação realizada.</p>
        ) : (
          historico.map(a => (
            <div key={a.id_agendamento} className="p-3 rounded shadow mb-2 bg-gray-100">
              <p><strong>Data:</strong> {a.data_agendamento} <strong>Hora:</strong> {a.horario}</p>
              <p><strong>Estado:</strong> {a.estado}</p>
              {a.obs && <p className="text-sm text-gray-600">{a.obs}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AgendamentoDoador;
