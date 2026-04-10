import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Textarea from "../../components/Textarea";
import Button from "../../components/Button";
import AlertCard from "../../components/AlertCard";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agendamentoFuncionarioSchema } from "../../validations/agendamentoSchema.js";
import { HiOutlinePlus,HiSearch } from "react-icons/hi";

const BASE_URL = "http://localhost:5080/agendamentos";


const AgendamentoFuncionario = () => {
  const [search, setSearch] = useState(""); 
  const [agendamentos, setAgendamentos] = useState([]); 
  const [mostrar, setMostrar] = useState(false); 
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(agendamentoFuncionarioSchema),
  });


  useEffect(() => {
    fetchAgendamentos();
  }, []);

  // Função para buscar todos os agendamentos
  const fetchAgendamentos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgendamentos(res.data);
    } catch (err) {
      console.error("Erro ao carregar agendamentos:", err);
    } finally {
    setLoading(false); 
  }
  };

  // Criação de novo agendamento
const onSubmit = async (data) => {
  try {
    await axios.post(`${BASE_URL}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAgendamentos();
    setMostrar(false);
    reset();
    setAlert({ type: "success", message: "Agendamento criado com sucesso!" });
  } catch (err) {
    console.error("Erro ao criar agendamento:", err);
    setAlert({ type: "error", message: "Erro ao criar agendamento." });
  }
};

  // Alterar estado do agendamento (confirmado/recusado)
 const handleEstado = async (id_agendamento, estado) => {
  try {
    await axios.put(`${BASE_URL}`, { id_agendamento, estado }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAgendamentos();
    setAlert({ type: "success", message: `Agendamento ${estado} com sucesso!` });
  } catch (err) {
    console.error("Erro ao atualizar estado:", err);
    setAlert({ type: "error", message: "Erro ao registar usuário." });
  }
};

  // Remover agendamento
  const handleRemover = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAgendamentos();
      setAlert({ type: "success", message: "Agendamento removido com sucesso!" });
    } catch (err) {
      console.error("Erro ao remover agendamento:", err);
      setAlert({ type: "error", message: "Não é possível remover este agendamento, pois existem doações associadas a ele." });
    }
  };


  // Filtrar agendamentos pela busca
  const agendamentosFiltradas = agendamentos.filter((d) => {
    const termo = search.toLowerCase();
    const nomeDoador = d.Doador?.Usuario?.nome?.toLowerCase() || "";
    const idDoador = d.id_doador?.toString() || "";
    return nomeDoador.includes(termo) || idDoador.includes(termo);
  });

    const isHoje = (data) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const d = new Date(data);
    d.setHours(0, 0, 0, 0);

    return d.getTime() === hoje.getTime();
  };


  return (
 <div className="px-4 sm:px-6 lg:px-20 py-8">
  <div className="bg-white rounded-2xl shadow-sm p-8 min-h-[calc(100vh-100px)] flex flex-col">

    {/* Cabeçalho */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <h2 className="text-2xl font-semibold text-gray-800">Lista de Agendamentos</h2>
      
      <Button
        onClick={() => setMostrar(true)}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium whitespace-nowrap"
      >
        <HiOutlinePlus size={20} />
        Novo Agendamento
      </Button>
    </div>

    {/* Barra de Pesquisa */}
    <div className="relative mb-8">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        <HiSearch className="text-xl" />
      </span>
      <Input
        type="text"
        placeholder="Pesquisar agendamentos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-12 py-3.5 w-full border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500"
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
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Carregando agendamentos...</p>
        </div>
      </div>
    ) : agendamentosFiltradas.length === 0 ? (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-center">
          <h3 className="text-2xl font-medium text-gray-700 mb-3">Nenhum agendamento encontrado</h3>
          <p className="text-gray-500">Não existem agendamentos que correspondam à sua pesquisa.</p>
        </div>
      </div>
    ) : (
      /* Tabela com melhor espaçamento */
      <div className="flex-1 overflow-hidden border border-gray-200 rounded-2xl shadow-sm">
        <div className="overflow-x-auto max-h-[calc(100vh-280px)]">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 sticky top-0 z-20 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-gray-600">ID doador</th>
                <th className="px-6 py-4 text-left font-medium text-gray-600">Doador</th>
                <th className="px-6 py-4 text-center font-medium text-gray-600">Data</th>
                <th className="px-6 py-4 text-center font-medium text-gray-600">Horário</th>
                <th className="px-6 py-4 text-left font-medium text-gray-600">Local</th>
                <th className="px-6 py-4 text-left font-medium text-gray-600">Observação</th>
                <th className="px-6 py-4 text-center font-medium text-gray-600">Estado</th>
                <th className="px-6 py-4 text-center font-medium text-gray-600">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {agendamentosFiltradas.map((ag) => (
                <tr
                  key={ag.id_agendamento}
                  className={`transition hover:bg-gray-50 ${
                    isHoje(ag.data_agendamento) ? "bg-green-50" : "bg-white"
                  }`}
                >
                  <td className="px-6 py-5 text-center font-mono text-gray-500">{ag.Doador?.id_doador}</td>
                  <td className="px-6 py-5 font-medium text-gray-900">{ag.Doador?.Usuario?.nome}</td>
                  <td className="px-6 py-5 text-center">{ag.data_agendamento}</td>
                  <td className="px-6 py-5 text-center">{ag.horario}</td>
                  <td className="px-6 py-5">{ag.local_doacao}</td>
                  <td className="px-6 py-5 text-gray-600">{ag.obs || "—"}</td>
                  <td className="px-6 py-5 text-center">
                    <span
                      className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                        ag.estado === "Pendente"
                          ? "bg-yellow-100 text-yellow-700"
                          : ag.estado === "Aguardando_resposta"
                          ? "bg-orange-100 text-orange-700"
                          : ag.estado === "Confirmado"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {ag.estado.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2 justify-center">
                      
                       {ag.estado === "pendente" && (
                  <>
                    <Button
                      className="bg-green-700 text-white px-2 py-1 rounded"
                      onClick={() => handleEstado(ag.id_agendamento, "Confirmado")}
                    >
                      Confirmar
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                      onClick={() => handleEstado(ag.id_agendamento, "Recusado")}
                    >
                      Recusar
                    </Button>
                  </>
                )}
                   {ag.estado === "aguardando_resposta" && (
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                    onClick={() => handleRemover(ag.id_agendamento)}
                  >
                    Remover
                  </Button>
                )}
                {ag.estado !== "Pendente" && ag.estado !== "Aguardando_resposta" && (
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                    onClick={() => handleRemover(ag.id_agendamento)}
                  >
                    Remover
                  </Button>
                )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* Modal */}
    {mostrar && (
      <Modal mostrar={mostrar} fechar={() => setMostrar(false)} titulo="Novo Agendamento">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input {...register("id_doador")} label="ID do Doador" placeholder="123" />
            <Input {...register("data_agendamento")} label="Data" type="date" />
            <Input {...register("horario")} label="Horário" type="time" />
            <Select {...register("local_doacao")} label="Local">
              <option value="">Selecione o local</option>
              <option value="Hospital Regional Santiago Norte">Hospital Regional Santiago Norte</option>
              <option value="Hospital HBS">Hospital HBS</option>
            </Select>
          </div>

          <Textarea {...register("obs")} label="Observações (opcional)" />

          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-xl font-medium"
            >
              Confirmar Agendamento
            </Button>
          </div>
        </form>
      </Modal>
    )}
  </div>
</div>
  );
};

export default AgendamentoFuncionario;
