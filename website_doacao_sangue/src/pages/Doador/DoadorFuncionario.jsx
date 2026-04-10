import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { 
  HiPlus,
  HiBriefcase,
  HiMail,
  HiPhone,
  HiHome,
  HiHeart,HiSearch
} from "react-icons/hi";

const BASE_URL = "http://localhost:5080/doadores";

// Componente que gerencia a lista de doadores para funcionários, incluindo busca e visualização em modal

const DoadorFuncionario = () => {
  const [doadores, setDoadores] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [doadorSelecionado, setDoadorSelecionado] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

   // Função que busca todos os doadores da API

  const fetchDoadores = async () => {
    try {
      setLoading(true);
      const res = await axios.get(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoadores(res.data);
    } catch (err) {
      console.error("Erro ao buscar doadores:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hook que chama fetchDoadores ao carregar o componente

  useEffect(() => {
    fetchDoadores();
  }, []);

  // Função que filtra doadores com base no termo de busca
  const doadoresFiltrados = doadores.filter(d =>
    d.Usuario?.nome?.toLowerCase().includes(search.toLowerCase()) ||
    d.profissao?.toLowerCase().includes(search.toLowerCase()) ||
    d.tipo_sangue?.toLowerCase().includes(search.toLowerCase())
  );

  // Função que abre o modal e define o doador selecionado
  const abrirModal = (doador) => {
    setDoadorSelecionado(doador);
    setMostrarModal(true);
  };

  // Função que fecha o modal e limpa o doador selecionado
  const fecharModal = () => {
    setDoadorSelecionado(null);
    setMostrarModal(false);
  };




  return (
  <div className="p-6">
  {/* Cabeçalho da tabela */}
  <div className="flex justify-between items-center mb-2 sticky top-0 bg-white z-10 p-2">
    <h2 className="text-xl font-bold">Lista de doadores</h2>
    
  </div>

  {/* Barra de pesquisa fixa */}
  <div className=" mb-4 sticky top-14 bg-white z-10 p-2">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      <HiSearch />
    </span>
    <Input
      type="text"
      placeholder="Pesquisar"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="pl-10 w-full border border-gray-300 rounded-lg"
    />
  </div>

  {/* Corpo rolável */}
  <div className="overflow-y-auto max-h-[500px]">
    {loading ? (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h4 className="text-2xl font-bold">Carregando doadores...</h4>
      </div>
    ) : doadoresFiltrados.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h4 className="text-2xl font-bold">Nenhum doador encontrado</h4>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {doadoresFiltrados.map((doador) => (
          <div
            key={doador.id_doador}
            onClick={() => abrirModal(doador)}
            className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition-all p-4 flex flex-col items-center min-h-[220px]"
          >
            {/* Imagem padronizada */}
            <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-gray-300 flex items-center justify-center bg-gray-100">
              {doador.Usuario?.foto ? (
                <img
                  src={`http://localhost:5080/${doador.Usuario?.foto}`}
                  className="w-full h-full object-cover"
                  alt="Foto do Doador"
                />
              ) : (
                <HiHeart className="text-red-400 text-3xl" />
              )}
            </div>

            {/* Nome do doador */}
            <h3 className="font-semibold text-center text-gray-800">{doador.Usuario?.nome || "-"}</h3>

            {/* Tipo sanguíneo destacado */}
            <span className="mt-2 px-3 py-1 rounded-full bg-red-600 text-white font-bold text-sm">
              {doador.tipo_sangue || "-"}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Modal do doador */}
  {mostrarModal && doadorSelecionado && (
    <Modal
      mostrar={mostrarModal}
      fechar={fecharModal}
      titulo={`Informações do doador`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <HiHeart className="text-red-600 text-3xl" />
          </div>
          <span className="px-3 py-0.5 rounded-full bg-red-600 text-white font-bold text-sm">
            {doadorSelecionado.tipo_sangue || "-"}
          </span>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="mt-2"> 
                <p className="text-sm text-gray-500">Nome</p>
                <p className="text-base font-semibold text-gray-800">
                  {doadorSelecionado.Usuario?.nome || "-"}
                </p>
              </div>
              <div className="mt-2">
              <p className="text-sm text-gray-500 flex items-center gap-1">
                 Código
              </p>
              <p className="font-medium">{doadorSelecionado.Usuario?.codigo_usuario || "-"}</p>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <HiBriefcase /> Profissão
              </p>
              <p className="font-medium">{doadorSelecionado.profissao || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <HiMail /> Email
              </p>
              <p className="font-medium break-all">
                {doadorSelecionado.Usuario?.email || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <HiPhone /> Telefone
              </p>
              <p className="font-medium">{doadorSelecionado.Usuario?.telefone || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <HiHome /> Morada
              </p>
              <p className="font-medium">{doadorSelecionado.Usuario?.morada || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )}
</div>

  );
};

export default DoadorFuncionario;
