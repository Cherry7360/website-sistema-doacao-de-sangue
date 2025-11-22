import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Input from "../../components/Input";
import {  HiOutlinePlus ,
  HiOutlineBriefcase,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineHome,
  HiOutlineHeart
} from "react-icons/hi";

const base = "http://localhost:5080/doadores/gerir_doadores"; // Ajusta para tua rota

const DoadorFuncionario = () => {
  const [doadores, setDoadores] = useState([]);
    const [mostrar, setMostrar] = useState(false);
  const [doadorSelecionado, setDoadorSelecionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // Se estiver a usar auth

  const fetchDoadores = async () => {
    try {
      setLoading(true);
      const res = await axios.get(base, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoadores(res.data);
    } catch (err) {
      console.error("Erro ao buscar doadores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoadores();
  }, []);

  const doadoresFiltrados = doadores.filter((d) => {
    const termo = search.toLowerCase();
    return (
      d.Usuario?.nome?.toLowerCase().includes(termo) ||
      d.profissao?.toLowerCase().includes(termo) ||
      d.tipo_sangue?.toLowerCase().includes(termo)
    );
  });

  return (
  <div className="items-center justify-center p-6">
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Lista de doadores </h2>
      <Button onClick={() => setMostrar(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
      < HiOutlinePlus  size={18} />
      Adicionar
        </Button> </div>
          <Input
        type="text"
        placeholder="Pesquisar pelo nome..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full border border-gray-300 p-2 rounded-lg" 
      />
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {loading ? (
        <p>Carregando...</p>
      ) : doadoresFiltrados.length === 0 ? (
        <p>Nenhum doador encontrado.</p>
      ) : (
        doadoresFiltrados.map((doador) => (
          <div
            key={doador.id_doador}
            onClick={() => {
              setDoadorSelecionado(doador);
              setMostrarModal(true);
            }}
            className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition-all p-4 flex flex-col items-center"
          >
            <img
              src={`http://localhost:5080${doador.Usuario?.foto || "/default.png"}`}
            
          className="w-20 h-20 rounded-full object-cover mb-2 border-2 border-gray-300" />
            <h3 className="font-semibold text-center">
              {doador.Usuario?.nome || "-"}
            </h3>
          </div>
        ))
      )}

      {mostrarModal && doadorSelecionado && (
      
<Modal
  mostrar={mostrarModal}
  fechar={() => setMostrarModal(false)}
  titulo={`Informações de ${doadorSelecionado.Usuario?.nome || "-"}`}
>
  <div className="flex flex-col items-center space-y-4 text-gray-700">

   
    <p className="flex items-center gap-2">
      <HiOutlineHeart className="text-red-600" size={20} />
      <span className="font-medium">Tipo de Sangue:</span> {doadorSelecionado.tipo_sangue || "-"}
    </p>


    <p className="flex items-center gap-2">
      <HiOutlineBriefcase size={20} />
      <span className="font-medium">Profissão:</span> {doadorSelecionado.profissao || "-"}
    </p>

  
    <p className="flex items-center gap-2">
      <HiOutlineMail size={20} />
      <span className="font-medium">Email:</span> {doadorSelecionado.Usuario?.email || "-"}
    </p>

  
    <p className="flex items-center gap-2">
      <HiOutlinePhone size={20} />
      <span className="font-medium">Telefone:</span> {doadorSelecionado.Usuario?.telefone || "-"}
    </p>

  
    <p className="flex items-center gap-2">
      <HiOutlineHome size={20} />
      <span className="font-medium">Morada:</span> {doadorSelecionado.Usuario?.morada || "-"}
    </p>

    <hr className="my-2" />

  
  </div>
</Modal>
      )}
    </div>
  </div>
  );
};

export default DoadorFuncionario;

