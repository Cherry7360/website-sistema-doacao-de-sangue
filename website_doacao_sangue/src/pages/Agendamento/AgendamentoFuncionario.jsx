import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../components/Modal";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Textarea from "../../components/Textarea";
import Button from "../../components/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agendamentoFuncionarioSchema } from "../../validations/agendamentoSchema.js";
import {  HiOutlinePlus  } from "react-icons/hi";

const base = "http://localhost:5080/agendamentos"; 


const AgendamentoFuncionario = () => {
  const [search, setSearch] = useState("");
  const [agendamentos, setAgendamentos] = useState([]);
  const [mostrar, setMostrar] = useState(false);

  const token = localStorage.getItem("token");

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(agendamentoFuncionarioSchema),
  });

  useEffect(() => {
    fetchAgendamentos();
  }, []);

  const fetchAgendamentos = async () => {
    try {
      const res = await axios.get(`${base}/gerir_agendamentos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgendamentos(res.data);
    } catch (err) {
      console.error("Erro ao carregar agendamentos:", err);
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios.post(`${base}/gerir_agendamentos`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAgendamentos();
      setMostrar(false);
      reset();
    } catch (err) {
      console.error("Erro ao criar agendamento:", err);
    }
  };

  const handleEstado = async (id_agendamento, estado) => {
    try {
      await axios.put(`${base}/gerir_agendamentos`, { id_agendamento, estado }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAgendamentos();
    } catch (err) {
      console.error("Erro ao atualizar estado:", err);
    }
  };

  const handleRemover = async (id) => {
    try {
      await axios.delete(`${base}/gerir_agendamentos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAgendamentos();
    } catch (err) {
      console.error("Erro ao remover agendamento:", err);
    }
  };

  const agendamentosFiltradas = agendamentos.filter((d) => {
    const termo = search.toLowerCase();
    const nomeDoador = d.Doador?.Usuario?.nome?.toLowerCase() || "";
    const idDoador = d.id_doador?.toString() || "";
    return nomeDoador.includes(termo) || idDoador.includes(termo);
  });

  return (
 <div>
    <div className="p-6 w-full mx-auto">
      
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3"> {/* Aumentei mb-4 para mb-6 para mais espaço */}
        <h2 className="text-2xl font-semibold text-gray-800">Lista de agendamentos</h2> {/* Aumentei o tamanho do texto para 2xl */}

        <Button
          onClick={() => setMostrar(true)}
         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition duration-150"
        >
          < HiOutlinePlus  size={18} />
          Adicionar
        </Button>
      </div>

   
      <Input
        type="text"
        placeholder="Pesquisar pelo doador..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full border border-gray-300 p-2 rounded-lg" 
      />

      <div className="relative w-full overflow-x-auto shadow-xl rounded-xl border border-gray-200"> 
        <table className="w-full text-sm text-left text-gray-700"> 
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
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
            {agendamentosFiltradas.map((ag) => (
              <tr
                key={ag.id_agendamento}
              
                className="bg-white border-b hover:bg-red-50/50 transition duration-150"
              >
               
                <td className="px-4 py-4 font-medium text-gray-900 text-left">
                  {ag.Doador?.Usuario?.nome}
                </td>
                
                <td className="px-4 py-4 text-center">
                  {ag.data_agendamento}
                </td>
                <td className="px-4 py-4 text-center">{ag.horario}</td>
                
                <td className="px-4 py-4 text-left">{ag.local_doacao}</td>
                
                <td className="px-4 py-4 text-left">{ag.obs || "-"}</td>

                <td className="px-4 py-4 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      ag.estado === "pendente"
                        ? "bg-yellow-100 text-yellow-700"
                        : ag.estado === "aceite"
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
                    bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                      <Button
                        className="bg-green-700 text-white  px-2 py-1 rounded"
                        onClick={() => handleEstado(ag.id_agendamento, "aceite")}
                      >
                        Aceitar
                      </Button>

                      <Button
                        className=" bg-red-700 text-white  px-2 py-1 rounded"
                        onClick={() => handleEstado(ag.id_agendamento, "rejeitado")}
                      >
                        Rejeitar
                      </Button>
                    </>
                  )}

                  <Button
                    className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleRemover(ag.id_agendamento)}
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




      {mostrar && (
        <Modal mostrar={mostrar} fechar={() => setMostrar(false)} titulo="Novo Agendamento">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-2xl mx-auto"
>
             <div className="border border-gray-100 rounded-lg p-5 space-y-4">
            <Input {...register("id_doador")} placeholder="ID do Doador" />
            {errors.id_doador && <p className="text-red-600">{errors.id_doador.message}</p>}

            <Input {...register("data_agendamento")} type="date" />
            {errors.data_agendamento && <p className="text-red-600">{errors.data_agendamento.message}</p>}

            <Input {...register("horario")} type="time" />
            {errors.horario && <p className="text-red-600">{errors.horario.message}</p>}

            <Select {...register("local_doacao")}>
              <option value="">Selecionar local</option>
              <option value="Hospital Regional Santiago Norte">Hospital Regional Santiago Norte</option>
              <option value="Hospital HBS">Hospital HBS</option>
            </Select>
            {errors.local_doacao && <p className="text-red-600">{errors.local_doacao.message}</p>}

            <Textarea {...register("obs")} placeholder="Observações" />
            </div>
            <Button type="submit" className="bg-green-600">
              Salvar
            </Button>

          </form>
        </Modal>
      )}
    </div>
  );
};

export default AgendamentoFuncionario;
