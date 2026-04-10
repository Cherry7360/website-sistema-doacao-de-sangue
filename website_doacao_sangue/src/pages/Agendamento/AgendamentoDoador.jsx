
 import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agendamentoDoadorSchema } from "../../validations/agendamentoSchema.js";
import axios from "axios";

import AlertCard from "../../components/AlertCard.jsx";
import Card from "../../components/Cards.jsx";
import Input from "../../components/Input.jsx";
import Select from "../../components/Select.jsx";
import Textarea from "../../components/Textarea.jsx";
import Button from "../../components/Button.jsx";
import Modal from "../../components/Modal";

import { HiCalendar,HiClipboardList, HiClock,HiOutlineHeart, HiInformationCircle, HiCheck, HiX, HiOutlineCalendar  } from "react-icons/hi";
import { FaTint } from "react-icons/fa";
const BASE_URL = "http://localhost:5080/agendamentos";
const ITEMS_PER_PAGE = 5;

// Componente que gerencia os agendamentos do doador, incluindo histórico, próximo agendamento e envio de novos agendamentos
const AgendamentoDoador = () => {
  const token = localStorage.getItem("token");
  const [history, setHistory] = useState([]);
  const [proximoAgendamento, setproximoAgendamento] = useState(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [mostrarModal, setMostrarModal] = useState(false);
   const [alert, setAlert] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(agendamentoDoadorSchema),
  });

// Função que busca o histórico de agendamentos do doador e define o próximo agendamento pendente
  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/meu-historico`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data.historico || [];
      setHistory(data);

      const pending = data
        .filter((a) => a.estado === "Aguardando_resposta")
        .sort((a, b) => new Date(`${a.data_agendamento} ${a.horario}`) - new Date(`${b.data_agendamento} ${b.horario}`));

      setproximoAgendamento(pending[0] || null);
    } catch (err) {
      console.error(err);
    }
  };

  // Hook que chama fetchHistory ao carregar o componente
  useEffect(() => { 
    fetchHistory();
   }, []);
  // Função que envia um novo agendamento do doador
  const handleSubmitAgendamento = async (data) => {
     
    try {
      await axios.post(`${BASE_URL}/doador`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      reset();
       setAlert({ type: "success", message: "Agendamento criado com sucesso." });
 
      setMostrarModal(false);
      fetchHistory();
    } catch (err) {
        setAlert({
      type: "error",
      message: err.response?.data?.message || "Erro ao criar agendamento."
    });
    }
  };

 // Função que envia a resposta de um agendamento (confirmado ou recusar)
  const handleAgendamentoResponse = async (id, estado) => {
    try {
      await axios.put(
        `${BASE_URL}/resposta`,
        { id_agendamento: id, estado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
       setAlert({
      type: "success",
      message: `Agendamento ${estado === "Confirmado" ? "aceite" : "recusado"} com sucesso`
    });

      
      fetchHistory();
    } catch (err) {
      alert("Erro ao responder agendamento.");
    }
  };

  const formatarHora = (hora) => {
  if (!hora) return "";
  const [h, m] = hora.split(":");
  const hh = h.padStart(2, "0");
  const mm = m.padStart(2, "0");
  return `${hh}:${mm}`;
};

  return (
    <div className="px-2 sm:px-4 lg:px-20 mt-6">
      <div className="bg-white rounded-2xl p-8 space-y-10 mt-8">
       
       <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Meus Agendamentos
        </h1>
      </div>

  <div className="pt-8 pb-10 px-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-6">
        
        {/* Subtítulo */}
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-800">
            Pedido de Agendamento
          </h2>
        </div>
  {!proximoAgendamento && (
          <div className="text-center p-8 space-y-6">
            <p className="text-gray-600 text-lg">
              Você ainda não tem agendamentos pendentes.
            </p>
            <Button
              onClick={() => setMostrarModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 font-medium rounded-lg"
            >
              Novo Agendamento
            </Button>
          </div>
        )}
    
          {proximoAgendamento && (
          <div className="border border-gray-200 rounded-xl p-6 space-y-6">
            
            {/* Status - mais neutro, sem cor forte */}
         <div className="flex justify-end">
                <div className="flex items-center gap-3">
                  <div className="px-4 py-1.5 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                    Aguardando Confirmação
                  </div>
                </div>
              </div>
            {/* Informação do agendamento */}
            <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-gray-700 leading-relaxed">
                A sua doação está agendada para o dia{" "}
                <span className="font-semibold">{proximoAgendamento.data_agendamento}</span> às{" "}
                <span className="font-semibold">{formatarHora(proximoAgendamento.horario)}</span>{" "}
                no <span className="font-semibold">{proximoAgendamento.local_doacao}</span>.
              </p>
            </div>

            {/* Observação (mantém se for útil, mas mais discreta) */}
            {proximoAgendamento.obs && (
              <div className="p-5 bg-blue-50 border-l-4 border-blue-300 text-blue-800 rounded-lg">
                <strong>Observação:</strong> {proximoAgendamento.obs}
              </div>
            )}

            {/* Botões - cores mais suaves e sem ícones */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white py-3 px-10 font-medium rounded-lg"
                onClick={() => handleAgendamentoResponse(proximoAgendamento.id_agendamento, "Confirmado")}
              >
                Aceitar Agendamento
              </Button>
              
              <Button
                variant="outline"
                className="border-red-600 text-red-600 bg-red-50 hover:bg-red-200 py-3 px-10 font-medium rounded-lg"
                onClick={() => handleAgendamentoResponse(proximoAgendamento.id_agendamento, "Recusado")}
              >
                Recusar
              </Button>
            </div>
          </div>
        )}
        </div>

        

   
        {mostrarModal && (
          <Modal mostrar={mostrarModal} fechar={() => setMostrarModal(false)} titulo="Agendar nova doação">
             
              <p className="text-sm text-gray-500 text-center ">Escolha uma data, hora e local disponíveis.</p>

                 {alert && (
                    <div className="fixed top-5 right-5 z-50">
                      <AlertCard
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                      />
                    </div>
                  )}

              <form onSubmit={handleSubmit(handleSubmitAgendamento)} className="space-y-4 p-4 m-6">
               <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="data_agendamento" className="text-gray-600 font-medium mb-1">Data do agendamento</label>
                  <Input
                    id="data_agendamento"
                    type="date"
                    {...register("data_agendamento")}
                    error={errors.data_agendamento?.message}
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="horario" className="text-gray-600 font-medium mb-1">Horário</label>
                  <Input
                    id="horario"
                    type="time"
                    {...register("horario")}
                    error={errors.horario?.message}
                  />
                </div>
                <div className="flex flex-col mt-4">
                <label htmlFor="local_doacao" className="text-gray-600 font-medium mb-1">Local da doação</label>
                <Select
                  id="local_doacao"
                  {...register("local_doacao")}
                  error={errors.local_doacao?.message}
                >
                  <option value="">Selecione o local</option>
                  <option value="Hospital Dr. Agostinho Neto">Hospital Dr. Agostinho Neto</option>
                  <option value="Hospital Batista de Sousa">Hospital Batista de Sousa</option>
                </Select>
              </div>
              </div>

              

              <div className="flex flex-col mt-4">
                <label htmlFor="obs" className="text-gray-600 font-medium mb-1">Observação</label>
                <Textarea
                  id="obs"
                  {...register("obs")}
                  placeholder="Observações (opcional)"
                  error={errors.obs?.message}
                />
              </div>

                <Button className="bg-green-600 mt-4 py-2 px-6 text-white font-semibold transition duration-150 rounded-md max-w-xs mx-auto block">
                  Solicitar Agendamento
                </Button>
              </form>

           
          </Modal>
        )}

      </div>
    </div>
    
  );
};


export default AgendamentoDoador;

/**
<Card className="p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-6">Histórico de Agendamentos</h2>

        {history.slice(0, visibleCount).map((a) => (
          <div key={a.id_agendamento} className="p-4 mb-4 rounded-lg bg-gray-50 border hover:bg-gray-100">
            <div className="flex justify-between items-center mb-2">
              <div className="flex gap-4 text-gray-700">
                <span className="flex items-center gap-1"><HiCalendar /> {a.data_agendamento}</span>
                <span className="flex items-center gap-1"><HiClock /> {a.horario}</span>
              </div>
              <StatusBadge estado={a.estado} />
            </div>

            <p className="flex items-center gap-1 text-gray-700"><HiLocationMarker /> {a.local_doacao}</p>
            {a.obs && <p className="text-sm italic text-gray-600 mt-2 border-l-2 pl-2">{a.obs}</p>}
          </div>
        ))}

        {visibleCount < history.length && (
          <div className="text-center mt-4">
            <Button className="bg-gray-200 hover:bg-gray-300 px-6" onClick={() => setVisibleCount(v => v + ITEMS_PER_PAGE)}>Mostrar mais</Button>
          </div>
        )}
      </Card>
    </div>
    

 
const InfoItem = ({ icon, label, value }) => (
  <div className="p-4 bg-gray-50 rounded-lg border">
    <span className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1">{icon} {label}</span>
    <p className="font-semibold">{value}</p>
  </div>
);


const StatusBadge = ({ estado }) => {
  const styles = {
    confirmado: "bg-green-200 text-green-800",
    aguardando_resposta: "bg-amber-200 text-amber-800",
    recusado: "bg-red-200 text-red-800",
  };
  return <span className={`px-3 py-1 text-xs font-bold rounded-full ${styles[estado] || "bg-gray-200"}`}>{estado.replace("_", " ")}</span>;
};

    */