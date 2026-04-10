import { useState, useEffect } from "react";
import axios from "axios";

import { HiOutlinePlus, HiSearch } from "react-icons/hi";
import Button from "../../components/Button"; 
import AlertCard from "../../components/AlertCard";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Textarea from "../../components/Textarea";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { estoqueSchema } from "../../validations/estoqueSchema";


const BASE_URL = "http://localhost:5080/estoque";

const EstoqueFuncionario = () => {
    const [mostrar, setMostrar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [estoque, setEstoque] = useState([]);
  const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");
  const [alert, setAlert] = useState(null); 

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
     resolver: zodResolver(estoqueSchema),
   });


  const fetchEstoque = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEstoque(res.data);
    } catch (err) {
      console.error("Erro ao carregar doações:", err.response || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstoque();
  }, []);

// Função que remove  via API
  const handleDeletar = async (id) => {
     try {
      await axios.delete(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
        setAlert({ type: "success", message: "Item do estoque removido com sucesso!" });
     
      fetchEstoque();
    } catch (err) {
      console.error("Erro ao deletar doação:", err.response || err.message);
        setAlert({ type: "error", message: "Erro ao deletar item do estoque." });
    
    }
  };

// Função que cria uma nova doação via API
  const onSubmit = async (data) => {
    try {
      await axios.post(`${BASE_URL}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlert({ type: "success", message: "Item adicionado no estoque com sucesso!" });
      fetchEstoque();
      reset();
      setMostrar(false);
    } catch (err) {
      console.error("Erro ao criar estoque:", err.response || err.message);
      setAlert({ type: "error", message: "Erro ao criar item no estoque." });
    }
  };

  // Filtrar estoque pelo id ou outro campo que desejar
  const estoqueFiltrado = estoque.filter((item) =>
    item.id_estoque.toString().includes(search)
  );

  // Função que fecha o modal de criação de doação
  const fecharModal = () => {
    setMostrar(false);
    reset();
  };


 return (
  <div className="px-4 sm:px-6 lg:px-20 py-8">
    <div className="bg-white rounded-2xl shadow-sm p-8 min-h-[calc(100vh-100px)] flex flex-col">

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Lista de Estoques</h2>
        
        <Button
          onClick={() => setMostrar(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium"
        >
          <HiOutlinePlus size={20} />
          Novo Movimento
        </Button>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative mb-8">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <HiSearch className="text-xl" />
        </span>
        <Input
          type="text"
          placeholder="Pesquisar pelo ID ou tipo sanguíneo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-12 py-3.5 w-full border border-gray-300 rounded-2xl"
        />
      </div>

      {/* Alert */}
      {alert && (
        <div className="fixed top-6 right-6 z-50">
          <AlertCard
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Conteúdo Principal */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center py-12">
          <p className="text-lg text-gray-600">Carregando estoques...</p>
        </div>
      ) : estoqueFiltrado.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <h3 className="text-2xl font-medium text-gray-700 mb-3">Nenhum movimento encontrado</h3>
            <p className="text-gray-500">Não foram encontrados registros de estoque.</p>
          </div>
        </div>
      ) : (
        /* Tabela com bom espaçamento */
        <div className="flex-1 overflow-hidden border border-gray-200 rounded-2xl shadow-sm">
          <div className="overflow-x-auto max-h-[calc(100vh-280px)]">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 sticky top-0 z-20 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-600">ID</th>
                  <th className="px-6 py-4 font-medium text-gray-600">Tipo Sanguíneo</th>
                  <th className="px-6 py-4 font-medium text-gray-600">Quantidade (ml)</th>
                  <th className="px-6 py-4 font-medium text-gray-600">Utilidade</th>
                  <th className="px-6 py-4 font-medium text-gray-600">Data de Utilização</th>
                  <th className="px-6 py-4 font-medium text-gray-600">Movimento</th>
                  <th className="px-6 py-4 font-medium text-gray-600">Observação</th>
                  <th className="px-6 py-4 text-center font-medium text-gray-600">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {estoqueFiltrado.map((item) => (
                  <tr key={item.id_estoque} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-5 font-medium text-gray-900">{item.id_estoque}</td>
                    <td className="px-6 py-5 font-medium text-gray-900">{item.tipo_sangue}</td>
                    <td className="px-6 py-5 font-medium text-gray-900">{item.quantidade_ml} ml</td>
                    <td className="px-6 py-5 text-gray-700">{item.utilidade}</td>
                    <td className="px-6 py-5">{item.data_utilizacao}</td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                          item.movimento === "entrada"
                            ? "bg-green-100 text-green-700"
                            : item.movimento === "saida"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.movimento?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-600">{item.observacao || "—"}</td>
                    <td className="px-6 py-5 text-center">
                      <Button
                        onClick={() => handleDeletar(item.id_estoque)}
                        className="bg-red-600 hover:bg-red-700 text-white text-sm px-2 py-1 rounded"
                      >
                        Remover
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal - Novo Movimento de Estoque */}
      <Modal mostrar={mostrar} fechar={fecharModal} titulo="Novo Movimento de Estoque">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="number"
              label="ID do Funcionário"
              {...register("id_funcionario")}
              placeholder="123"
            />
            <Input
              type="number"
              label="ID da Doação"
              {...register("id_doacao")}
              placeholder="123"
            />

            <Input
              type="date"
              label="Data da Utilização"
              {...register("data_utilizacao")}
            />

            <Select label="Quantidade (ml)" {...register("quantidade_ml")}>
              <option value="">Selecione a quantidade</option>
              <option value="400">400 ml</option>
              <option value="450">450 ml</option>
            </Select>

            <Select label="Utilidade" {...register("utilidade")}>
              <option value="">Selecione a utilidade</option>
               <option value="doacao">Doação</option>
              <option value="transfusao">Transfusão</option>
              <option value="cirurgia">Cirurgia</option>
              <option value="emergencia">Emergência</option>
              <option value="tratamento">Tratamento médico</option>
              <option value="outro">Outro</option>
            </Select>

            <Select label="Movimento" {...register("movimento")}>
              <option value="">Selecione o movimento</option>
              <option value="entrada">Entrada</option>
              <option value="saida">Saída</option>
            </Select>

            <div className="md:col-span-2">
              <Textarea
                label="Observação (opcional)"
                {...register("observacao")}
                placeholder="Informações adicionais..."
              />
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-xl font-medium"
            >
              Salvar Movimento
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  </div>
);
};

export default EstoqueFuncionario;