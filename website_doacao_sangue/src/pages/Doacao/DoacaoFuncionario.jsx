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
  <div className="px-4 sm:px-6 lg:px-20 py-8">
    <div className="bg-white rounded-2xl shadow-sm p-8 min-h-[calc(100vh-100px)] flex flex-col">

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Lista de Doações</h2>
        
        <Button
          onClick={() => setMostrar(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium"
        >
          <HiOutlinePlus size={20} />
          Nova Doação
        </Button>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative mb-8">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <HiSearch className="text-xl" />
        </span>
        <Input
          type="text"
          placeholder="Pesquisar pelo ID do doador..."
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
          <p className="text-lg text-gray-600">Carregando doações...</p>
        </div>
      ) : doacoesFiltradas.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <h3 className="text-2xl font-medium text-gray-700 mb-3">Nenhuma doação encontrada</h3>
            <p className="text-gray-500">Não foram encontradas doações com os critérios de pesquisa.</p>
          </div>
        </div>
      ) : (
        /* Tabela com bom espaçamento */
        <div className="flex-1 overflow-hidden border border-gray-200 rounded-2xl shadow-sm">
          <div className="overflow-x-auto max-h-[calc(100vh-280px)]">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 sticky top-0 z-20 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium text-gray-600">ID doação</th>
                  <th className="px-6 py-4 font-medium text-gray-600">Nome do Doador</th>
                  <th className="px-6 py-4 font-medium text-gray-600">Tipo Sanguíneo</th>
                  <th className="px-6 py-4 font-medium text-gray-600">Data</th>
                  <th className="px-6 py-4 font-medium text-gray-600">Estado</th>
                  <th className="px-6 py-4 text-center font-medium text-gray-600">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {doacoesFiltradas.map((doacao) => (
                  <tr 
                    key={doacao.id_doacao} 
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-5 font-medium text-gray-900">{doacao.id_doacao}</td>
                    <td className="px-6 py-5 font-medium text-gray-900">
                      {doacao.Doador?.Usuario?.nome}
                    </td>
                    <td className="px-6 py-5 font-medium text-gray-900">
                      {doacao.Doador?.tipo_sangue}
                    </td>
                    <td className="px-6 py-5">{formatDate(doacao.data_doacao)}</td>
                    <td className="px-6 py-5">
                      <span 
                        className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                          doacao.estado === "Concluído" 
                            ? "bg-green-100 text-green-700" 
                            : doacao.estado === "Cancelado" 
                            ? "bg-red-100 text-red-700" 
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {doacao.estado}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <Button
                        onClick={() => handleDeletar(doacao.id_doacao)}
                        className="bg-red-600 hover:bg-red-700 text-white  px-2 py-1 rounded"
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

      {/* Modal de Nova Doação */}
      <Modal mostrar={mostrar} fechar={fecharModal} titulo="Nova Doação">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input 
                type="number" 
                label="ID do Doador" 
                {...register("id_doador")} 
                placeholder="123" 
              />
              {errors.id_doador && <p className="text-red-600 text-sm mt-1">{errors.id_doador.message}</p>}
            </div>

            <div>
              <Input 
                type="number" 
                label="ID do Agendamento" 
                {...register("id_agendamento")} 
                placeholder="321" 
              />
              {errors.id_agendamento && <p className="text-red-600 text-sm mt-1">{errors.id_agendamento.message}</p>}
            </div>

            <div>
              <Input 
                type="date" 
                label="Data da Doação" 
                {...register("data_doacao")} 
              />
              {errors.data_doacao && <p className="text-red-600 text-sm mt-1">{errors.data_doacao.message}</p>}
            </div>

            <div>
              <Select label="Estado" {...register("estado")}>
                <option value="">Selecionar estado</option>
                <option value="Concluído">Concluído</option>
                <option value="Cancelado">Cancelado</option>
              </Select>
              {errors.estado && <p className="text-red-600 text-sm mt-1">{errors.estado.message}</p>}
            </div>

            <div className="md:col-span-2">
              <Textarea 
                label="Descrição da Doação (opcional)" 
                {...register("descricao")} 
                placeholder="Observações sobre a doação..." 
              />
              {errors.descricao && <p className="text-red-600 text-sm mt-1">{errors.descricao.message}</p>}
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-xl font-medium"
            >
              Salvar Doação
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  </div>
);
 

};

export default DoacaoFuncionario;
