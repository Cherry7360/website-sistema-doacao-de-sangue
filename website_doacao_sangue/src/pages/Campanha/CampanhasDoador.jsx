import { useEffect, useState } from "react";
import axios from "axios";
import { HiArrowLeft,HiLocationMarker, HiCalendar, HiClock, HiHeart } from "react-icons/hi";
import Modal from "../../components/Modal";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5080/campanhas";

const CampanhasDoador = () => {
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [campanhaSelecionado, setCampanhaSelecionado] = useState(null);
  const navigate = useNavigate();

  const fetchCampanhas = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/doador`);
      setCampanhas(res.data);
    } catch (err) {
      console.error("Erro ao carregar campanhas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampanhas();
  }, []);

  const abrirModal = (campanha) => {
    setCampanhaSelecionado(campanha);
  };

  const fecharModal = () => {
    setCampanhaSelecionado(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center space-y-3">
        <h4 className="text-4xl font-bold mb-4">Carregando campanhas...</h4>
      </div>
    );
  }

  if (campanhas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center space-y-3">
        <h4 className="text-4xl font-bold mb-4">Nenhuma campanha disponível</h4>
      </div>
    );
  }

  return (
    <div className="p-4 mt-12">
         <button
        onClick={() => navigate(-1)}
        className="fixed  mt-16 top-6 left-6 flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-lg shadow-md text-red-600 font-semibold hover:bg-red-50 z-50"
      >
        <HiArrowLeft className="w-5 h-5" />
      
      </button>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-3">
          Campanhas de doação ativas
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Participe e ajude a salvar vidas!
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {campanhas.map((campanha) => {
          const dataFormatada = new Date(campanha.data_campanha).toLocaleDateString("pt-PT");
          const descricaoTruncada =
            campanha.descricao.length > 80 ? campanha.descricao.slice(0, 80) + "..." : campanha.descricao;

          return (
            <div
              key={campanha.id_campanha}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border"
            >
              <div className="relative">
                {campanha.foto ? (
                  <img
                    src={`http://localhost:5080/${campanha.foto}`}
                    className="w-full h-40 object-cover"
                    alt=""
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                    Sem imagem
                  </div>
                )}
              </div>

              <div className="p-4 space-y-2">
                <h3 className="text-gray-800 font-semibold">{campanha.titulo || "-"}</h3>

                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <HiLocationMarker className="text-green-600" />
                  {campanha.local || "-"}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <HiCalendar />
                    {dataFormatada}
                  </div>
                  <div className="flex items-center gap-1">
                    <HiClock />
                    {campanha.horario}
                  </div>
                </div>


                <button
                  onClick={() => abrirModal(campanha)}
                  className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold transition"
                >
                  Ver detalhes
                </button>
              </div>
            </div>
          );
        })}
      </div>
        {campanhaSelecionado && (
          <Modal mostrar={true} fechar={fecharModal} titulo={campanhaSelecionado.titulo || "-"}>
            <div className="space-y-4">
            
              {campanhaSelecionado.foto ? (
                <img
                  src={`http://localhost:5080/${campanhaSelecionado.foto}`}
                  alt="Foto da campanha"
                  className="w-full h-auto max-h-[500px] object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
                  Sem imagem
                </div>
              )}

         
              <div className="flex items-center gap-4 text-gray-600 text-sm">
                <div className="flex items-center gap-1">
                  <HiCalendar className="text-red-600" />
                  {new Date(campanhaSelecionado.data_campanha).toLocaleDateString("pt-PT")}
                </div>
                <div className="flex items-center gap-1">
                  <HiClock className="text-red-600" />
                  {campanhaSelecionado.horario}
                </div>
              </div>

              
              <div className="flex items-center gap-2 text-gray-800 font-medium">
                <HiLocationMarker className="text-red-600" />
                {campanhaSelecionado.local || "-"}
              </div>

              
              <p className="text-gray-700 mt-2">{campanhaSelecionado.descricao}</p>
            </div>
          </Modal>
        )}

    </div>
  );
};

export default CampanhasDoador;
