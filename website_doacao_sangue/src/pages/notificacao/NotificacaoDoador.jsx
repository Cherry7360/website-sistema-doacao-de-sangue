import { useEffect, useState } from "react";
import axios from "axios";
import { HiBell, HiCheckCircle } from "react-icons/hi";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5080/notificacoes";

const NotificacoesDoador = () => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [erro, setErro] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotificacoes();
  }, []);

  const fetchNotificacoes = async () => {
    if (!token) return setErro("Token não encontrado");
    try {
      const res = await axios.get(`${BASE_URL}/doador`, {
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
      await axios.put(`${BASE_URL}/visualizada`, { id_notificacao }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setNotificacoes(prev =>
        prev.map(n =>
          n.id_notificacao === id_notificacao ? { ...n, visto: true } : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const abrirNotificacao = (notificacao) => {
    if (notificacao.tipo === "novo_agendamento") {
      navigate("/agendamentos/doador");
    }
  };

  if (erro) {
    return <div className="p-8 text-red-600">{erro}</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-20 mt-6">
      <div className="bg-white rounded-2xl p-8 space-y-8">

        {/* Título */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-800">Minhas Notificações</h1>
        </div>

        {/* Estado vazio */}
        {notificacoes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <HiBell className="text-5xl text-gray-300" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhuma notificação</h3>
            <p className="text-gray-600 max-w-sm">
              Quando receberes novas notificações sobre agendamentos ou doações, elas aparecerão aqui.
            </p>
          </div>
        ) : (
          /* Lista de notificações */
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {notificacoes.map((n) => (
              <div
                key={n.id_notificacao}
                onClick={() => abrirNotificacao(n)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer hover:shadow-md
                  ${n.visto 
                    ? "border-gray-200 bg-white" 
                    : "border-blue-100 bg-blue-50 hover:bg-blue-100"}`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className={`font-semibold ${n.visto ? "text-gray-700" : "text-gray-900"}`}>
                        {n.titulo}
                      </p>
                      {!n.visto && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-0.5 rounded-full font-medium">
                          Nova
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-3">
                      {n.mensagem}
                    </p>

                    <small className="text-gray-500">
                      {new Date(n.data_envio).toLocaleDateString("pt-PT")} às{" "}
                      {n.hora_envio || new Date(n.data_envio).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </small>
                  </div>

                  {/* Botão Marcar como lida */}
                  <div className="flex-shrink-0">
                    {n.visto ? (
                      <HiCheckCircle className="text-emerald-600 text-2xl" title="Notificação lida" />
                    ) : (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          marcarComoVisto(n.id_notificacao);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-sm font-medium rounded-xl whitespace-nowrap"
                      >
                        Marcar como lida
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificacoesDoador;