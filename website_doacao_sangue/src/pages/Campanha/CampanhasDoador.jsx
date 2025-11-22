import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CampanhasDoador = () => {
  const [campanhas, setCampanhas] = useState([]);
  const [loading, setLoading] = useState(true);

const fetchCampanhas = async () => {
      try {
        const res = await axios.get("http://localhost:5080/campanhas/doador");
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

    if (loading) {
      return <p className="p-4 text-center">Carregando campanhas...</p>;
    }

    if (campanhas.length === 0) {
      return <p className="p-4 text-center">Nenhuma campanha disponível no momento.</p>;
    }

  return (
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
    
      {campanhas.map((campanha) => (
        <Link
          to={`/campanhas/${campanha.id_campanha}`} 
          key={campanha.id_campanha}
          className="bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-lg transition-shadow"
        >
  {campanha.foto && (
    <img
      src={`http://localhost:5080/${campanha.foto}`}
      alt="Campanha"
      className="w-full h-48 object-cover rounded mb-2"
    />
  )}
  <h3 className="font-bold text-lg mb-1">{campanha.local}</h3>
  <p className="text-sm mb-2">{campanha.descricao}</p>
  <p className="text-xs text-gray-500">
    {new Date(campanha.data_campanha).toLocaleDateString()} - {campanha.horario}
  </p>
</Link>
      ))}
    </div>
  );
};

export default CampanhasDoador;
