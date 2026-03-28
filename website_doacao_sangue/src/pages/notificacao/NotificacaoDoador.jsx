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

  return (
    <div className="px-2 sm:px-4 lg:px-20 mt-6">
      <div className="bg-white rounded-2xl p-8 space-y-8 mt-8">

        <div className="flex items-center gap-2 mb-6">
          <span className="text-xl flex items-center justify-center">
            <HiBell />
          </span>
          <h1 className="text-xl font-bold">Minhas notificações</h1>
        </div>

       
        {notificacoes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-screen text-center space-y-3">
            <h4 className="text-4xl font-bold mb-4">Sem notificações</h4>
          </div>
        ) : (
           <div className="relative overflow-x-auto shadow-md rounded-lg flex-1 max-h-[500px]">
          <ul className="flex flex-col gap-3">
            {notificacoes.map((n) => (
              <li
                key={n.id_notificacao}
                onClick={() => abrirNotificacao(n)}
                className="p-4 rounded-xl shadow-md flex gap-4 cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`text-sm ${n.visto ? "font-medium text-gray-700" : "font-bold text-gray-900"}`}>
                      {n.titulo}
                    </p>
                    {!n.visto && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                        Nova
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700">{n.mensagem}</p>
                  <small className="text-gray-500">
                    {new Date(n.data_envio).toLocaleDateString()}{" "}
                    <span>às</span>{" "}
                    {n.hora_envio || new Date(n.data_envio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </small>
                </div>

                <div className="flex items-center">
                  {n.visto ? (
                    <HiCheckCircle className="text-green-600 text-xl" title="Lida" />
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        marcarComoVisto(n.id_notificacao);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm"
                    >
                      Marcar como lida
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificacoesDoador;
