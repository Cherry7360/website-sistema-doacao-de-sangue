import { useEffect, useState } from "react";
import axios from "axios";
import Grafico from "../../components/Grafico";

const BASE_URL = "http://localhost:5080/doacoes";

const CardInfo = ({
  accentColor,
  title,
  value,
  subtitle,
  highlight = false,
}) => (
  <div
    className={`relative rounded-2xl shadow-sm p-6 flex gap-5 bg-white border border-gray-100 transition hover:shadow-md
      ${highlight ? "ring-1 ring-blue-100" : ""}`}
  >
    <span className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${accentColor}`} />
    
    <div className="flex flex-col justify-center flex-1">
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-3xl font-semibold text-gray-800 mt-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-600 mt-2">{subtitle}</p>}
    </div>
  </div>
);

const DoacaoDoador = () => {
  const [historico, setHistorico] = useState([]);
  const [infoDoador, setInfoDoador] = useState(null);
  const [doacoesAnuais, setDoacoesAnuais] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchHistorico();
    fetchInfoDoador();
  }, [token]);

  const fetchHistorico = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/doador/historico-doador`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistorico(res.data);
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
    }
  };

  useEffect(() => {
    if (historico.length > 0) {
      const resultado = {};
      historico.forEach((item) => {
        const ano = new Date(item.data_doacao).getFullYear();
        resultado[ano] = (resultado[ano] || 0) + 1;
      });

      const formatado = Object.entries(resultado).map(([ano, total]) => ({
        ano: Number(ano),
        total,
      }));

      setDoacoesAnuais(formatado.sort((a, b) => a.ano - b.ano));
    }
  }, [historico]);

  const fetchInfoDoador = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/doador/informacao-doador`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInfoDoador(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const [year, month, day] = dateStr.split("-");
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("pt-PT", { 
      day: "2-digit", 
      month: "2-digit", 
      year: "numeric" 
    });
  };

  // Estado de carregamento
  if (!infoDoador) {
    return <div className="flex justify-center items-center h-96">Carregando...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen px-4 md:px-12 py-12 space-y-12">
      
      {/* Título */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-gray-800">Minhas Doações</h1>
      </div>

      {/* Cards informativos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <CardInfo
          accentColor="bg-red-500"
          title="Tipo sanguíneo"
          value={infoDoador.tipo_sangue || "—"}
        />

        <CardInfo
          accentColor="bg-emerald-500"
          title="Sugestão de próxima doação"
          value={infoDoador.proxima_doacao ? formatDate(infoDoador.proxima_doacao) : "Em análise"}
          subtitle={infoDoador.status_doacao || ""}
          highlight={!!infoDoador.proxima_doacao}
        />
      </div>

      {/* Conteúdo principal */}
      {historico.length === 0 ? (
        /* ==================== ESTADO PARA DOADOR NOVO ==================== */
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🩸</span>
          </div>
          <h3 className="text-2xl font-medium text-gray-700 mb-3">
            Ainda não realizaste nenhuma doação
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Assim que fizeres a tua primeira doação, ela aparecerá aqui juntamente 
            com o teu progresso anual e histórico.
          </p>
          <button
            onClick={() => {/* navegar para agendamento */}}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-3.5 rounded-xl font-medium transition"
          >
            Agendar Primeira Doação
          </button>
        </div>
      ) : (
        /* ==================== DOADOR COM HISTÓRICO ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Gráfico */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Progresso anual de doações
              </h2>
            </div>
            <Grafico
              dados={doacoesAnuais}
              titulo=""
              barraUnica={{
                chave: "total",
                cor: "rgba(16, 185, 129, 0.85)",   // verde esmeralda mais suave
                dataField: "ano"
              }}
            />
          </div>

          {/* Histórico recente */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Histórico recente
            </h2>
            <ul className="space-y-5 max-h-[420px] overflow-y-auto">
              {historico.slice(0, 5).map((item, index) => (
                <li 
                  key={index} 
                  className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-gray-800">{formatDate(item.data_doacao)}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {item.local_doacao || "Local não informado"}
                    </p>
                  </div>
                  <div className="text-emerald-600">
                    ✓
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoacaoDoador;