import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Textarea from "../../components/Textarea";
import AlertCard from "../../components/AlertCard";

import { HiOutlinePlus,HiSearch } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doacaoSchema } from "../../validations/doacaoSchema";

const BASE_URL = "http://localhost:5080/doacoes";

// Componente que gerencia as doações no perfil do funcionário, incluindo busca, criação e remoção

const DoacaoFuncionario = () => {
  const [search, setSearch] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [doacoes, setDoacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null); 

  const token = localStorage.getItem("token");

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(doacaoSchema),
  });


   // Função que busca todas as doações da API
  const fetchDoacoes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoacoes(res.data);
    } catch (err) {
      console.error("Erro ao carregar doações:", err.response || err.message);
    } finally {
      setLoading(false);
    }
  };
 // Hook que chama fetchDoacoes ao carregar o componente
  useEffect(() => {
    fetchDoacoes();
  }, []);

   // Função que filtra doações com base no termo de busca
  const doacoesFiltradas = doacoes.filter(d => {
    const termo = search.toLowerCase();
    return (
      d.Doador?.Usuario?.nome?.toLowerCase().includes(termo) ||
      String(d.id_doacao).includes(termo)
    );
  });

  // Função que formata datas para o padrão português
 const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr + "T00:00:00"); // força horário local
  return date.toLocaleDateString("pt-PT");
};
  // Função que cria uma nova doação via API
  const onSubmit = async (data) => {
    try {
      await axios.post(`${BASE_URL}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlert({ type: "success", message: "Doação adicionada com sucesso!" });
      fetchDoacoes();
      reset();
      setMostrar(false);
    } catch (err) {
      console.error("Erro ao criar doação:", err.response || err.message);
      setAlert({ type: "error", message: "Erro ao criar doação." });
    }
  };

    // Função que remove uma doação via API
  const handleDeletar = async (id) => {
     try {
      await axios.delete(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlert({ type: "success", message: "Doação removida com sucesso!" });
      fetchDoacoes();
    } catch (err) {
      console.error("Erro ao deletar doação:", err.response || err.message);
      setAlert({ type: "error", message: "Erro ao deletar doação." });
    }
  };


  // Função que fecha o modal de criação de doação
  const fecharModal = () => {
    setMostrar(false);
    reset();
  };

 
  return (
    <div className="p-6 flex flex-col h-full">

  <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
    <h2 className="text-xl font-bold">Lista de doações</h2>
    <Button
      onClick={() => setMostrar(true)}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
    >
      <HiOutlinePlus size={18} /> Adicionar
    </Button>
  </div>

  {/* Barra de pesquisa */}
  <div className="relative mb-4">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      <HiSearch/>
    </span>

    <Input
      type="text"
      placeholder="Pesquisar pelo id"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="pl-10 w-full border border-gray-300 rounded-lg"
    />
  </div>

  {/* Alert */}
  {alert && (
    <div className="fixed top-5 right-5 z-50">
      <AlertCard
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert(null)}
      />
    </div>
  )}

  {loading ? (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-3">
      <h4 className="text-4xl font-bold mb-4">Carregando ...</h4>
    </div>
  ) : doacoesFiltradas.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <h4 className="text-2xl font-bold">Nenhuma doação encontrada</h4>
    </div>
  ) : (
    // Container com scroll vertical, cabeçalho fixo
    <div className="relative overflow-x-auto shadow-md rounded-lg flex-1 max-h-[500px]">
      <table className="min-w-full text-sm text-left text-gray-700 border border-gray-300">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider sticky top-0 z-10">
          <tr>
            <th className="px-6 py-3 border-b">ID</th>
            <th className="px-6 py-3 border-b">Nome do Doador</th>
            <th className="px-6 py-3 border-b">Tipo Sangue</th>
            <th className="px-6 py-3 border-b">Data</th>
            <th className="px-6 py-3 border-b">Estado</th>
            <th className="px-6 py-3 border-b">Ações</th>
          </tr>
        </thead>

        <tbody>
          {doacoesFiltradas.map(doacao => (
            <tr key={doacao.id_doacao} className="bg-white border-b hover:bg-gray-50 transition">
              <td className="px-6 py-4 font-medium text-gray-900">{doacao.id_doacao}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{doacao.Doador?.Usuario?.nome}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{doacao.Doador?.tipo_sangue}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{formatDate(doacao.data_doacao)}</td>
              <td className="px-6 py-4 font-medium text-gray-900">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  doacao.estado === "Concluído" ? "bg-green-100 text-green-700" :
                  doacao.estado === "Cancelado" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
                }`}>
                  {doacao.estado}
                </span>
              </td>
              <td className="px-6 py-4 font-medium text-gray-900 flex gap-2 flex-wrap">
                <button
                  onClick={() => handleDeletar(doacao.id_doacao)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-400"
                >
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}

  {/* Modal de cadasto */}
  <Modal mostrar={mostrar} fechar={fecharModal} titulo="Nova Doação">
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 m-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <Input type="number" label="ID do doador" {...register("id_doador")} placeholder="123" />
          {errors.id_doador && <p className="text-red-600 text-sm mt-1">{errors.id_doador.message}</p>}
        </div>

        <div className="flex flex-col">
          <Input label="ID do agendamento" type="number" {...register("id_agendamento")} placeholder="321" />
          {errors.id_agendamento && <p className="text-red-600 text-sm mt-1">{errors.id_agendamento.message}</p>}
        </div>

        <div className="flex flex-col">
          <Input label="Data da doação" {...register("data_doacao")} type="date" placeholder="Data da doação" />
          {errors.data_doacao && <p className="text-red-600 text-sm mt-1">{errors.data_doacao.message}</p>}
        </div>

        <div className="flex flex-col">
          <Select label="Estado" {...register("estado")}>
            <option value="">Selecionar estado</option>
            <option value="Concluído">Concluído</option>
            <option value="Cancelado">Cancelado</option>
          </Select>
          {errors.estado && <p className="text-red-600 text-sm mt-1">{errors.estado.message}</p>}
        </div>

        <div className="flex flex-col col-span-2">
          <Textarea label="Descrição da doação" {...register("descricao")} placeholder="(opcional)" />
          {errors.descricao && <p className="text-red-600 text-sm mt-1">{errors.descricao.message}</p>}
        </div>
      </div>

      <Button
        type="submit"
        className="bg-green-600 mt-4 py-2 px-6 text-white font-semibold transition duration-150 rounded-md max-w-xs mx-auto block"
      >
        Salvar
      </Button>
    </form>
  </Modal>
</div>

  );
};

export default DoacaoFuncionario;
