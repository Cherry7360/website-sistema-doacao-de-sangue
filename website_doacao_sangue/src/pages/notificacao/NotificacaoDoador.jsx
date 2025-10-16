import { useEffect, useState } from "react";
import axios from "axios";


const base = "http://localhost:5080/notificacoes";

const NotificacoesDoador = () => {
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
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Notificações</h2>
      {erro && <p className="text-red-600">{erro}</p>}
      {notificacoes.length === 0 ? (
        <p>Nenhuma notificação.</p>
      ) : (
        notificacoes.map((n) => (
          <div
            key={n.id_notificacao}
            className={`p-3 mb-2 rounded shadow ${n.visto ? "bg-gray-100" : "bg-yellow-100"}`}
          >
            <p>{n.mensagem}</p>
            <small>{new Date(n.data_envio).toLocaleString()}</small>
            {!n.visto && (
              <button
                onClick={() => marcarComoVisto(n.id_notificacao)}
                className="ml-2 text-blue-600 underline"
              >
                Marcar como visto
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default NotificacoesDoador;
