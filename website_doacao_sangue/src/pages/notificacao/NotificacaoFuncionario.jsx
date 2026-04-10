import { useState, useEffect } from "react";
import axios from "axios";
import { HiSearch } from "react-icons/hi";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from "../../components/Select";
import Textarea from "../../components/Textarea";
import AlertCard from "../../components/AlertCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notificacaoSchema } from "../../validations/notificacaoSchema";

const BASE_URL = "http://localhost:5080/notificacoes";

const NotificacaoFuncionario = () => {
  const [search, setSearch] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todas");
  const [alert, setAlert] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(notificacaoSchema),
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchNotificacoes();
  }, []);

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

  const onSubmit = async (data) => {
    try {
      await axios.post(`${BASE_URL}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setAlert({ type: "success", message: "Notificação enviada com sucesso!" });
      reset();
      setMostrar(false);
      fetchNotificacoes();
    } catch (err) {
      console.error("Erro ao enviar notificação:", err);
      setAlert({ type: "error", message: "Erro ao enviar notificação." });
    }
  };

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
    <div className="px-4 sm:px-6 lg:px-20 mt-6">
      <div className="bg-white rounded-2xl p-8 space-y-8">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-800">Notificações</h1>
          </div>
          <Button
            onClick={() => setMostrar(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium"
          >
            Nova Notificação
          </Button>
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <HiSearch className="text-xl" />
          </span>
          <Input
            type="text"
            placeholder="Pesquisar notificações..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 py-3 border border-gray-300 rounded-2xl w-full"
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-3">
          <Button
            onClick={() => setFiltro("todas")}
            className={`px-5 py-2 text-sm font-medium rounded-2xl transition ${
              filtro === "todas" 
                ? "bg-gray-800 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todas
          </Button>
          <Button
            onClick={() => setFiltro("funcionario")}
            className={`px-5 py-2 text-sm font-medium rounded-2xl transition ${
              filtro === "funcionario" 
                ? "bg-gray-800 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Enviadas por Mim
          </Button>
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

        {/* Lista de Notificações */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-center py-12 text-gray-600">Carregando notificações...</p>
          ) : notificacoesFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
            
              <h3 className="text-xl font-medium text-gray-700">Nenhuma notificação encontrada</h3>
              <p className="text-gray-600 mt-2">Tente alterar os filtros ou a pesquisa.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notificacoesFiltradas.map((n) => (
                <div
                  key={n.id_notificacao}
                  className="p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{n.titulo}</p>
                      <p className="text-gray-700 mt-2 leading-relaxed">{n.mensagem}</p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    {n.data_envio} às {n.hora_envio}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal para Enviar Nova Notificação */}
      <Modal mostrar={mostrar} fechar={() => setMostrar(false)} titulo="Enviar Nova Notificação">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <p className="text-sm text-gray-600 text-center">
            Envie uma notificação diretamente para um doador específico.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              type="number"
              label="ID do Doador"
              placeholder="Ex: 123"
              {...register("id_doador")}
              error={errors.id_doador?.message}
            />
            <Input
              type="text"
              label="Título"
              placeholder="Nova campanha de doação"
              {...register("titulo")}
              error={errors.titulo?.message}
            />
            <Select label="Tipo de Notificação" {...register("tipo")}>
              <option value="">Selecione o tipo</option>
              <option value="agendamento">Agendamento</option>
              <option value="campanha">Campanha</option>
              <option value="urgente">Urgente</option>
              <option value="resposta">Resposta</option>
              <option value="geral">Geral</option>
            </Select>
          </div>

          <Textarea
            label="Mensagem"
            placeholder="Escreva a mensagem da notificação..."
            {...register("mensagem")}
            error={errors.mensagem?.message}
          />

          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-xl font-medium"
            >
              Enviar Notificação
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NotificacaoFuncionario;