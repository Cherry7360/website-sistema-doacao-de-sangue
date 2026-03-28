import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Textarea from "../../components/Textarea";
import AlertCard from "../../components/AlertCard";
import {  HiBell,HiCheckCircle,HiSearch   } from "react-icons/hi"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notificacaoSchema } from "../../validations/notificacaoSchema";

const BASE_URL = "http://localhost:5080/notificacoes";

// Componente que gerencia e exibe as notificações para funcionários

const NotificacaoFuncionario = () => {
  const tiposNotificacao = {
    agendamento: { nome: "Agendamento", cor: "bg-blue-100" },
    campanha: { nome: "Campanha", cor: "bg-red-100" },
    urgente: { nome: "Urgente", cor: "bg-yellow-100" },
    resposta: { nome: "Resposta", cor: "bg-green-100" },
    geral: { nome: "Geral", cor: "bg-gray-100" },
  };

  const [search, setSearch] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
const [filtro, setFiltro] = useState("todas"); // 'todas', 'funcionario', 'sistema'
  const [alert, setAlert] = useState(null); 

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(notificacaoSchema),
  });

  const token = localStorage.getItem("token");

  // Hook que chama a função de busca de notificações ao carregar o componente
  useEffect(() => {
    fetchNotificacoes();
  }, []);

  // Função que busca todas as notificações do funcionário
  const fetchNotificacoes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/funcionario`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotificacoes(res.data);
    } catch (err) {
      console.error("Erro ao buscar notificações:", err);
    } finally {
      setLoading(false);
    }
  };

  // Função que envia uma nova notificação
  const onSubmit = async (data) => {
    try {
      await axios.post(`${BASE_URL}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    setAlert({ type: "success", message: `Notificação enviada com sucesso!` });

      reset();
      setMostrar(false);
      fetchNotificacoes(); 
    } catch (err) {
      console.error("Erro ao enviar notificação:", err);
      alert("Erro ao enviar notificação.");
    }
  };

  // Função que filtra notificações com base no termo de busca
const notificacoesFiltradas = notificacoes
  .filter((n) =>
    n.titulo.toLowerCase().includes(search.toLowerCase()) ||
    n.mensagem.toLowerCase().includes(search.toLowerCase())
  )
  .filter((n) => {
    if (filtro === "todas") return true;
    if (filtro === "funcionario") return n.id_funcionario !== null;
    return true;
  })
  .sort((a, b) => new Date(b.data_envio + " " + b.hora_envio) - new Date(a.data_envio + " " + a.hora_envio));


  
  return (
   <div className="px-2 sm:px-4 lg:px-20 mt-6 flex flex-col h-full">

  {/* Cabeçalho */}
  <div className="bg-white rounded-2xl p-4 space-y-8 mt-8">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <span className="text-xl flex items-center justify-center">
          <HiBell />
        </span>
        <h1 className="text-xl font-bold">Notificações</h1>
      </div>

      <Button
        onClick={() => setMostrar(true)}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
      >
        Nova notificação
      </Button>
    </div>
  </div>

  {/* Barra de pesquisa */}
  <div className="relative mb-4">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
      <HiSearch/>
    </span>
    <Input
      type="text"
      placeholder="Pesquisar notificações"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="pl-10 w-full border border-gray-300 rounded-lg"
    />
  </div>

  {/* Filtros */}
  <div className="flex gap-2 mb-6">
    <button
      onClick={() => setFiltro("todas")}
      className={`px-3 py-1 text-sm rounded-full ${
        filtro === "todas" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700"
      }`}
    >
      Todas
    </button>

    <button
      onClick={() => setFiltro("funcionario")}
      className={`px-3 py-1 text-sm rounded-full ${
        filtro === "funcionario" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"
      }`}
    >
      Enviadas
    </button>
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

  {/* Lista de notificações com scroll interno */}
  <div className="flex-1 overflow-y-auto mt-2">
    {loading ? (
      <p className="text-center text-gray-600">Carregando notificações...</p>
    ) : notificacoesFiltradas.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
        <h4 className="text-2xl font-bold mb-4">Sem notificações</h4>
      </div>
    ) : (
       <div className="relative overflow-x-auto shadow-md rounded-lg flex-1 max-h-[500px]">
      <ul className="flex flex-col gap-3">
        {notificacoesFiltradas.map((n) => (
          <li key={n.id_notificacao} className="p-4 rounded-xl shadow-md flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{n.titulo}</p>
            </div>
            <p className="text-gray-700">{n.mensagem}</p>
            <div className="text-gray-700 text-sm flex gap-2">
              <span>{n.data_envio}</span>
              <span>às {n.hora_envio}</span>
            </div>
          </li>
        ))}
      </ul>
      </div>
    )}
  </div>

  {/* Modal de envio */}
  <Modal mostrar={mostrar} fechar={() => setMostrar(false)} titulo="Enviar para doador">
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-2xl mx-auto">
      <p className="text-sm text-gray-500 text-center">
        Enviar uma notificação diretamente para um doador específico.
      </p>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div>
          <Input
            type="number"
            label="ID do doador"
            placeholder="123"
            {...register("id_doador")}
            error={errors.id_doador?.message}
          />
        </div>
        <div>
          <Input
            type="text"
            label="Titulo"
            placeholder="Nova campanha"
            {...register("titulo")}
            error={errors.titulo?.message}
          />
        </div>
        <div>
          <Select label="Tipo" {...register("tipo")}>
            <option value="">Selecionar</option>
            <option value="agendamento">Agendamento</option>
            <option value="campanha">Campanha</option>
            <option value="urgente">Urgente</option>
            <option value="resposta">Resposta</option>
            <option value="geral">Geral</option>
          </Select> 
        </div>
      </div>

      <Textarea
        label="Mensagem"
        {...register("mensagem")}
        error={errors.mensagem?.message}
      />
      {errors.tipo && <p className="text-red-600">{errors.tipo.message}</p>}

      <Button type="submit" className="bg-green-600 mt-4 py-2 px-6 text-white font-semibold transition duration-150 rounded-md max-w-xs mx-auto block">
        Enviar
      </Button>
    </form>
  </Modal>
</div>

  );
};

export default NotificacaoFuncionario;
