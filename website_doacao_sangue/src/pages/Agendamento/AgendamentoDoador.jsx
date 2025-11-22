import { useState, useEffect } from "react";
import axios from "axios";
import Card from "../../components/Cards";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Textarea from "../../components/Textarea";
import Button from "../../components/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agendamentoDoadorSchema } from "../../validations/agendamentoSchema.js";
import { HiOutlineUser, HiOutlineClipboardList, HiOutlineCalendar, HiOutlineClock } from "react-icons/hi";


const AgendamentoDoador = () => {
  const base = "http://localhost:5080/agendamentos";
  const token = localStorage.getItem("token");

  const [infoDoador, setInfoDoador] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [proximoAgendamento, setProximoAgendamento] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(agendamentoDoadorSchema),
  });

  useEffect(() => {
    fetchInfoDoador();
    fetchHistorico();
  }, []);

  const fetchInfoDoador = async () => {
    try {
      const res = await axios.get(`${base}/info_doador`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInfoDoador(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHistorico = async () => {
    try {
      const res = await axios.get(`${base}/historico`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistorico(res.data);

      const proximo = res.data
        .filter(a => a.estado === "pendente" || a.estado === "confirmado")
        .sort((a, b) => new Date(a.data_agendamento + " " + a.horario) - new Date(b.data_agendamento + " " + b.horario));
      setProximoAgendamento(proximo[0] || null);
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios.post(`${base}/agendar_doador`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Agendamento enviado! Aguarde confirmação.");
      reset();
      fetchHistorico();
      fetchInfoDoador();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.mensagem || "Erro ao agendar. Tente novamente.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
   {infoDoador && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
        <div className="flex items-center p-6 rounded-xl shadow-lg bg-red-600 text-white transition-transform hover:scale-105">
          <div className="p-4 rounded-full bg-white/20 mr-4">
            <HiOutlineUser className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{infoDoador.tipo_sangue || "—"}</p>
            <p className="text-sm opacity-80">Tipo Sanguíneo</p>
          </div>
        </div>

      
        <div className="flex items-center p-6 rounded-xl shadow-lg bg-blue-600 text-white transition-transform hover:scale-105">
          <div className="p-4 rounded-full bg-white/20 mr-4">
            <HiOutlineClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{infoDoador.total_doacoes || 0}</p>
            <p className="text-sm opacity-80">Doações</p>
          </div>
        </div>
        <div className="flex items-center p-6 rounded-xl shadow-lg bg-green-600 text-white transition-transform hover:scale-105">
          <div className="p-4 rounded-full bg-white/20 mr-4">
            <HiOutlineCalendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-lg font-medium">
              {infoDoador.ultima_doacao?.data_doacao
                ? new Date(infoDoador.ultima_doacao.data_doacao).toLocaleDateString("pt-PT")
                : "Nenhuma"}
            </p>
            <p className="text-sm opacity-80">Última Doação</p>
          </div>
        </div>

        {proximoAgendamento && (
          <div className="flex items-center p-6 rounded-xl shadow-lg bg-yellow-500 text-white transition-transform hover:scale-105">
            <div className="p-4 rounded-full bg-white/20 mr-4">
              <HiOutlineClock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold">Próximo Agendamento</p>
              <p>Data: {new Date(proximoAgendamento.data_agendamento).toLocaleDateString("pt-PT")}</p>
              <p>Hora: {proximoAgendamento.horario}</p>
            </div>
          </div>
        )}
      </div>
)}


      <Card className="bg-white p-6 rounded shadow col-span-2">
        <h2 className="text-xl font-bold mb-4 text-center">Agendar Doação</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 max-w-md mx-auto">
          <Input type="date" {...register("data_agendamento")} />
          {errors.data_agendamento && <p className="text-red-600">{errors.data_agendamento.message}</p>}

          <Input type="time" {...register("horario")} />
          {errors.horario && <p className="text-red-600">{errors.horario.message}</p>}

          <Select {...register("local_doacao")}>
            <option value="">Selecione o local</option>
            <option value="Hospital Dr. Agostinho Neto">Hospital Dr. Agostinho Neto</option>
            <option value="Hospital Regional Santiago Norte">Hospital Regional Santiago Norte</option>
          </Select>
          {errors.local_doacao && <p className="text-red-600">{errors.local_doacao.message}</p>}

          <Textarea {...register("obs")} placeholder="Observações (opcional)" />
          {errors.obs && <p className="text-red-600">{errors.obs.message}</p>}

          <Button type="submit" className="bg-blue-700 hover:bg-green-600">
            Agendar
          </Button>
        </form>
      </Card>

  <Card className="bg-white p-6 rounded shadow col-span-2">
  <h2 className="text-2xl font-bold mb-6 text-gray-800">Histórico de Agendamentos</h2>

  {historico.length === 0 ? (
    <p className="text-gray-500 text-center">Nenhuma doação realizada.</p>
  ) : (
    historico.map(a => (
      <div
        key={a.id_agendamento}
        className="p-4 rounded-lg shadow-sm mb-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-700">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"
                />
              </svg>
              <span>{a.data_agendamento}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-700">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{a.horario}</span>
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded text-sm font-semibold ${
              a.estado === "Concluída"
                ? "bg-green-200 text-green-800"
                : a.estado === "Pendente"
                ? "bg-yellow-200 text-yellow-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {a.estado}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-gray-700 mb-1">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 12l4.243-4.243M6.343 7.343L10.586 12l-4.243 4.243"
            />
          </svg>
          <span>{a.local_doacao}</span>
        </div>

        {a.obs && (
          <p className="text-sm text-gray-600 mt-2 italic border-l-2 border-gray-300 pl-2">
            {a.obs}
          </p>
        )}
      </div>
    ))
  )}
</Card>


    </div>
  );
};

export default AgendamentoDoador;
/*<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`flex items-center p-6 rounded-xl shadow-lg ${card.bg} text-white transition-transform hover:scale-105`}
          >
            <div className="p-4 rounded-full bg-white/20 mr-4">
              {card.icon}
            </div>
            <div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-sm opacity-80">{card.title}</p>
            </div>
          </div>
        ))}
      </div>*/
