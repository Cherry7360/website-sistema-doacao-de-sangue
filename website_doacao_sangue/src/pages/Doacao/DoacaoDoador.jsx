import { useEffect, useState } from "react";
import { HiCheckCircle, HiClock, HiHeart, HiTrendingUp } from "react-icons/hi";
import axios from "axios";
import Grafico from "../../components/Grafico";

const BASE_URL = "http://localhost:5080/doacoes";

const CardInfo = ({
  accentColor,
  icon,
  iconBg = "bg-gray-100",
  iconColor = "text-gray-600",
  title,
  value,
  subtitle,
  highlight
}) => (
  <div
    className={`relative rounded-xl shadow-md p-6 flex gap-4 bg-white transition hover:shadow-lg
      ${highlight ? "ring-2 ring-red-100" : ""}`}
  >
    <span className={`absolute left-0 top-0 h-full w-1 rounded-l-xl ${accentColor}`} />
    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${iconBg}`}>
      <span className={`text-xl ${iconColor}`}>{icon}</span>
    </div>
    <div className="flex flex-col justify-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
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
      const res = await axios.get(`${BASE_URL}/doador/historico-doador`, { headers: { Authorization: `Bearer ${token}` } });
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
      const res = await axios.get(`${BASE_URL}/doador/informacao-doador`, { headers: { Authorization: `Bearer ${token}` } });
      setInfoDoador(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!infoDoador) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center space-y-3 bg-gray-50">
        <h4 className="text-4xl font-bold mb-4 text-gray-700">Sem dados</h4>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const [year, month, day] = dateStr.split("-");
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
  <div className="bg-gray-50 min-h-screen space-y-16 px-4 md:px-12 py-12">

    {/* Título */}
    <div className="flex items-center gap-3">
      <HiHeart className=" text-2xl" />
      <h1 className="text-xl font-bold">Minhas Doações</h1>
    </div>

  {/* Cards principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-fit ">
          <CardInfo
            accentColor="bg-red-500"
            icon={<HiHeart />}
            iconBg="bg-red-100"
            iconColor="text-red-600"
            title="Tipo sanguíneo"
            value={infoDoador.tipo_sangue || "—"}
          />

          <CardInfo
            accentColor="bg-green-500"
            icon={<HiClock />}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            title="Sugestão de próxima doação"
            value={infoDoador.proxima_doacao ? formatDate(infoDoador.proxima_doacao) : "Cálculo em análise"}
            subtitle={infoDoador.status_doacao}
            highlight
          />
        </div>
    {/* Condição: se não houver histórico */}
    {historico.length === 0 ? (
      <div className="lg:col-span-7 bg-white rounded-xl shadow-md p-6">
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-gray-500 text-lg">
        Nenhuma doação registada até agora.
      </p>
    </div>
  </div>
    ) : (
      <>
      

        {/* Gráfico + histórico */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Gráfico de progresso anual */}
          <div className="lg:col-span-7 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <HiTrendingUp className="text-gray-800 text-2xl" />
              <h1 className="text-lg font-bold ">Progresso anual de doações</h1>
            </div>
            <Grafico
              dados={doacoesAnuais}
              titulo=""
              barraUnica={{ chave: "total", cor: "rgba(185,28,28,0.8)", dataField: "ano" }}
            />
          </div>

          {/* Histórico recente */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <HiClock className="text-gray-800 text-2xl" />
              <h1 className="text-lg font-bold">Histórico recente</h1>
            </div>
            <ul className="space-y-4 max-h-[350px] overflow-y-auto">
              {historico.slice(0, 5).map((item, index) => (
                <li key={index} className="flex items-center justify-between border-b border-gray-200 pb-2 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{formatDate(item.data_doacao)}</p>
                    <p className="text-xs text-gray-500">{item.local_doacao || "Local não informado"}</p>
                  </div>
                  <HiCheckCircle className="text-green-600 text-xl" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    )}
  </div>
);
};

export default DoacaoDoador;