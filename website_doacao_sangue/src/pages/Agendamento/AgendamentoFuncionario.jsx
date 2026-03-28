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
<div className="p-6 flex flex-col h-full">

  <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
    <h2 className="text-xl font-bold">Lista de agendamentos</h2>
    <Button
      onClick={() => setMostrar(true)}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
    >
      <HiOutlinePlus size={18} /> Adicionar
    </Button>
  </div>

  {/* Barra de pesquisa fixa */}
  <div className="relative mb-4">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      <HiSearch/>
    </span>

    <Input
      type="text"
      placeholder="Pesquisar"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="pl-10 w-full border border-gray-300 rounded-lg"
    />
  </div>

  {alert && (
    <div className="fixed top-5 right-5 z-50">
      <AlertCard
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert(null)}
      />
    </div>
  )}


  {/* Corpo da tabela rolável */}
  {loading ? (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-3">
      <h4 className="text-4xl font-bold mb-4">Carregando ...</h4>
    </div>
  ) : agendamentosFiltradas.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <h4 className="text-2xl font-bold">Nenhum Agendamento encontrada</h4>
    </div>
  ) : (

  <div className="relative w-full overflow-y-auto max-h-[500px] shadow-xl rounded-xl border border-gray-200">
    <table className="w-full text-sm text-left text-gray-700">
      <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider sticky top-0 z-20">
        <tr>
          <th className="px-4 py-3 border-b text-left">Doador</th>
          <th className="px-4 py-3 border-b text-center">Data</th>
          <th className="px-4 py-3 border-b text-center">Horário</th>
          <th className="px-4 py-3 border-b text-left">Local</th>
          <th className="px-4 py-3 border-b text-left">Obs</th>
          <th className="px-4 py-3 border-b text-center">Estado</th>
          <th className="px-4 py-3 border-b text-center">Ações</th>
        </tr>
      </thead>

      <tbody>
      {agendamentosFiltradas.map(ag=> (
             <tr
              key={ag.id_agendamento}
              className={`
                border-b transition duration-150
                ${isHoje(ag.data_agendamento)
                  ? "bg-green-50 hover:bg-green-100"
                  : "bg-white hover:bg-red-50/50"}
              `}
            >
              <td className="px-4 py-4 font-medium text-gray-900 text-left">{ag.Doador?.Usuario?.nome}</td>
              <td className="px-4 py-4 text-center">{ag.data_agendamento}</td>
              <td className="px-4 py-4 text-center">{ag.horario}</td>
              <td className="px-4 py-4 text-left">{ag.local_doacao}</td>
              <td className="px-4 py-4 text-left">{ag.obs || "-"}</td>
              <td className="px-4 py-4 text-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
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
              <td className="px-4 py-4 flex flex-wrap gap-2 justify-center">
                {ag.estado === "pendente" && (
                  <>
                    <Button
                      className="bg-green-700 text-white px-2 py-1 rounded"
                      onClick={() => handleEstado(ag.id_agendamento, "Confirmado")}
                    >
                      Confirmar
                    </Button>
                    <Button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleEstado(ag.id_agendamento, "Recusado")}
                    >
                      Recusar
                    </Button>
                  </>
                )}
                {ag.estado === "aguardando_resposta" && (
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleRemover(ag.id_agendamento)}
                  >
                    Remover
                  </Button>
                )}
                {ag.estado !== "Pendente" && ag.estado !== "Aguardando_resposta" && (
                  <Button
                    className="bg-red-500 hover:bg-red-400 text-white px-2 py-1 rounded"
                    onClick={() => handleRemover(ag.id_agendamento)}
                  >
                    Remover
                  </Button>
                )}
              </td>
            </tr>
      ))}
      </tbody>
    </table>
  </div>
)}
{mostrar && ( 
  <Modal mostrar={mostrar} fechar={() => setMostrar(false)} titulo="Novo Agendamento"> 
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-5 m-12"> <div className="grid grid-cols-2 gap-4"> 
    <div> 
      <Input {...register("id_doador")} label="ID do Doador" placeholder="123"/> {errors.id_doador && <p className="text-red-600 text-sm mt-1">{errors.id_doador.message}</p>}
       </div> 
       <div>
         <Input {...register("data_agendamento")} label="Data" type="date" placeholder="11/01/2026"/> 
         {errors.data_agendamento && <p className="text-red-600 text-sm mt-1">{errors.data_agendamento.message}</p>} 
         </div> 
         <div> <Input {...register("horario")} type="time" label="Hora" placeholder="09:00" /> {errors.horario && <p className="text-red-600 text-sm mt-1">{errors.horario.message}</p>} </div>
          <div> <Select {...register("local_doacao")} label="Local"> <option value="">Selecionar local</option> <option value="Hospital Regional Santiago Norte">Hospital Regional Santiago Norte</option> 
          <option value="Hospital HBS">Hospital HBS</option> 
          </Select> {errors.local_doacao && <p className="text-red-600 text-sm mt-1">{errors.local_doacao.message}</p>} 
          </div>
           </div> 
           
           <div> <Textarea {...register("obs")} label="Observações" /> </div> 
           <Button type="submit" className=" bg-green-600 mt-4 py-2 px-6 text-white font-semibold transition duration-150 rounded-md max-w-xs mx-auto block" > Confirmar </Button> 
           </form>
            </Modal>)}
</div>

  );
};

export default AgendamentoFuncionario;
