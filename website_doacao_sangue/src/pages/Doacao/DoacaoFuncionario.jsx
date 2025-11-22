import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from"../../components/Select"
import Textarea from"../../components/Textarea";
import { HiOutlinePlus  } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doacaoSchema } from "../../validations/doacaoSchema";


const base = "http://localhost:5080/doacoes";

const DoacaoFuncionario = () => {
  const [search, setSearch] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [doacoes, setDoacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
     resolver: zodResolver(doacaoSchema),
   });
 

  const token = localStorage.getItem("token");

 

  const doacoesFiltradas = doacoes.filter((d) => {
    const termo = search.toLowerCase();
    return (
      d.nome?.toLowerCase().includes(termo) ||
      String(d.id_doacao).includes(termo)
    );
  });

  const fetchDoacoes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${base}/gerir_doacoes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoacoes(res.data);
    } catch (err) {
      console.error("Erro ao carregar doações:", err.response || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoacoes();
  }, []);


  const onSubmit = async (data) => {
  console.log("Dados enviados:", data);
 
    try {
      await axios.post(`${base}/gerir_doacoes`,data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchDoacoes();
      setMostrar(false);
      reset();
      
    } catch (err) {
      console.error("Erro ao criar doação:", err.response || err.message);
      alert("Erro ao criar doação.");
    }
  };

  const handleDeletar = async (id) => {
    if (!confirm("Tem certeza que deseja deletar esta doação?")) return;
    try {
      await axios.delete(`${base}/gerir_doacoes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDoacoes();
    } catch (err) {
      console.error("Erro ao deletar doação:", err.response || err.message);
      alert("Erro ao deletar doação.");
    }
  };

  return (
    <div>
   <div className="p-6 flex flex-col h-full">

  <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
    <h2 className="text-xl font-bold">Lista de doações</h2>
    <Button
      onClick={() => setMostrar(true)}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
    >
      < HiOutlinePlus  size={18} />
      Adicionar
    </Button>
  </div>


    <Input
        type="text"
        placeholder="Pesquisar por id,..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full border border-gray-300 p-2 rounded-lg" 
      />

  {loading ? (
  <p>Carregando...</p>
  ) : doacoesFiltradas.length === 0 ? (
    <p>Nenhuma doação encontrada.</p>
  ) : (
    <div className="relative overflow-x-auto shadow-md rounded-lg flex-1">
      <table className="min-w-full text-sm text-left text-gray-700 border border-gray-300">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
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
          {doacoesFiltradas.map((doacao) => (
            <tr key={doacao.id_doacao} className="bg-white border-b hover:bg-gray-50 transition">
              <td className="px-6 py-4 font-medium text-gray-900">{doacao.id_doacao}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{doacao.Doador?.Usuario?.nome}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{doacao.Doador?.tipo_sangue}</td>

              <td className="px-6 py-4 font-medium text-gray-900">{doacao.data_doacao}
              </td>
              <td className="px-6 py-4 font-medium text-gray-900">{doacao.estado}</td>
              <td className="px-6 py-4 font-medium text-gray-900 flex gap-2 flex-wrap">
                <button
                  onClick={() => handleDeletar(doacao.id_doacao)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
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
</div>


     <Modal mostrar={mostrar} fechar={() => setMostrar(false)} titulo="Nova Doação">
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-2xl mx-auto">
    <div className="border border-gray-100 rounded-lg p-5 space-y-4">
      
      <Input  type="number" {...register("id_doador")} placeholder="ID do doador"
      />
      {errors.id_doador && <p className="text-red-600">{errors.id_doador.message}</p>}

      <Input {...register("data_doacao")} type="date" placeholder="Data da doação" />
      {errors.data_doacao && (<p className="text-red-600">{errors.data_doacao.message}</p>)}

      <Select {...register("estado")}>
        <option value="">opção</option>
        <option value="Concluída">Concluída</option>
        <option value="Cancelada">Cancelada</option>
      </Select>
      {errors.estado && <p className="text-red-600">{errors.estado.message}</p>}

      <Textarea {...register("descricao")} placeholder="Descrição (opcional)" />
      {errors.descricao && <p className="text-red-600">{errors.descricao.message}</p>}

      <Button type="submit" className="bg-green-600">Salvar</Button>
    </div>
  </form>
</Modal>

    </div>
  );
};

export default DoacaoFuncionario;
