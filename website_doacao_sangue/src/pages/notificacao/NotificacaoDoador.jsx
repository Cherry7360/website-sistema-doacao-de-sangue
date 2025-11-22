import { useEffect, useState } from "react";
import axios from "axios";
import { FaCalendarAlt, FaTint, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from "react-icons/fa";



const base = "http://localhost:5080/notificacoes";

const NotificacoesDoador = () => {

const tiposNotificacao = {
  agendamento: { nome: "Agendamento", icone: <FaCalendarAlt />, cor: "bg-blue-100" },
  campanha: { nome: "Campanha", icone: <FaTint />, cor: "bg-red-100" },
  urgente: { nome: "Urgente", icone: <FaExclamationTriangle />, cor: "bg-yellow-100" },
  resposta: { nome: "Resposta", icone: <FaCheckCircle />, cor: "bg-green-100" },
  geral: { nome: "Geral", icone: <FaInfoCircle />, cor: "bg-gray-100" },
};

  const [notificacoes, setNotificacoes] = useState([]);
  const [erro, setErro] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchNotificacoes();
  }, []);

  const fetchNotificacoes = async () => {
    if (!token) return setErro("Token não encontrado");
    try {
     const res = await axios.get(`${base}`, {
  headers: { Authorization: `Bearer ${token}` },
});
      setNotificacoes(res.data);
    } catch (err) {
      console.error(err);
      setErro("Erro ao carregar notificações");
    }
  };

  const marcarComoVisto = async (id_notificacao) => {
    try {
      await axios.put(`${base}/visto/${id_notificacao}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotificacoes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-bold mb-4">Notificações</h2>
      {erro && <p className="text-red-600">{erro}</p>}
      {notificacoes.length === 0 ? (
        <p>Nenhuma notificação.</p>
      ) : (
        <ul>
        {notificacoes.map(n => {
          const tipo = tiposNotificacao[n.tipo] || tiposNotificacao["geral"];
          return (
            <li key={n.id_notificacao} className={`p-3 mb-2 rounded flex items-center gap-3 ${tipo.cor}`}>
             <div className="flex-1">
                <p className="font-semibold">{tipo.nome}</p>
                <p>{n.mensagem}</p>
                <small>{new Date(n.data_envio).toLocaleString()}</small>
              </div>
              {!n.visto && (
                <button
                  onClick={() => marcarComoVisto(n.id_notificacao)}
                  className="ml-2 bg-green-600 text-white px-2 py-1 rounded"
                >
                  Marcar como lida
                </button>
              )}
            </li>
          );
        })}
      </ul>
      )}
    </div>
  );
};

export default NotificacoesDoador;
