import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Select from"../../components/Select"
import Textarea from"../../components/Textarea";


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notificacaoSchema } from "../../validations/notificacaoSchema";


 const base= "http://localhost:5080/notificacoes"
 
const NotificacaoFuncionario = () => {
   const tiposNotificacao = {
    agendamento: { nome: "Agendamento",  cor: "bg-blue-100" },
    campanha: { nome: "Campanha",  cor: "bg-red-100" },
    urgente: { nome: "Urgente", cor: "bg-yellow-100" },
    resposta: { nome: "Resposta", cor: "bg-green-100" },
    geral: { nome: "Geral", cor: "bg-gray-100" },
  };

  const [search, setSearch] = useState("");
   const [mostrar, setMostrar] = useState(false);
    const [loading, setLoading] = useState(true);
      const [notificacoes, setNotificacoes] = useState([]);
  
       const { register, handleSubmit, formState: { errors }, reset } = useForm({
           resolver: zodResolver(notificacaoSchema),
         });
       

  const token = localStorage.getItem("token");
useEffect(()=>{
     fetchNotificacoes();
},[]);

  

  const fetchNotificacoes = async () => {
      try {
        const res = await axios.get(`${base}/gerir_notificacoes`, {
          headers: { Authorization:`Bearer ${token}` }
        });
         
        setNotificacoes(res.data);
      } catch (err) {
        console.error("Erro ao buscar notificações:", err);
      }
    };
  const onSubmit = async (data) => {
  
    try {
      await axios.post(`${base}/gerir_notificacoes`, data,{
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Notificação enviada!");
      console.log(data);
     reset();
    } catch (err) {
      console.error("Erro ao enviar notificação:", err);
    }
  };

  return (
    <div>
<div className="p-6 flex flex-col h-full">
  {/* Header */}
  <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
    <h2 className="text-xl font-bold">Notificações</h2>
    <Button
      onClick={() => setMostrar(true)}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
    >
      Enviar
    </Button>
  </div>

  {/* Pesquisa */}
  <div className="mb-4 flex gap-2 flex-wrap">
    <Input
      type="text"
      placeholder="Pesquisar"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border rounded-lg px-3 py-2 flex-1 min-w-[150px]"
    />
  </div>


  <div className="flex-1 overflow-y-auto mt-2">
    {notificacoes.length === 0 ? (
      <p className="text-center py-4">Sem notificações.</p>
    ) : (
      <ul className="flex flex-col gap-3">
        {notificacoes.map((n) => {
          const tipo = tiposNotificacao[n.tipo] || tiposNotificacao["geral"];
          return (
            <li
              key={n.id_notificacao}
              className={`p-4 rounded-xl shadow-md flex items-start gap-3 ${tipo.cor}`}
            >
          
              <div className="flex-1">
                <p className="font-semibold">{n.titulo}</p>
                <p className="text-gray-700">{n.mensagem}</p>
                <small className="text-gray-500">{new Date(n.data_envio).toLocaleString()}</small>
              </div>
            </li>
          );
        })}
      </ul>
    )}
  </div>
</div>


        <Modal mostrar={mostrar} fechar={() => setMostrar(false)} titulo="enviar para doador">
          <form onSubmit={handleSubmit(onSubmit)}className="space-y-4 w-full max-w-2xl mx-auto">
            <div className="border border-gray-100 rounded-lg p-5 space-y-4">
              
              <Input
            type="number"
            placeholder="ID do doador"
            {...register("id_doador")}
            error={errors.id_doador?.message}
          />

          <Input
            type="text"
            placeholder="Título"
            {...register("titulo")}
            error={errors.titulo?.message}
          />

          <Textarea
            placeholder="Mensagem"
            {...register("mensagem")}
            error={errors.mensagem?.message}
          />

          <Select {...register("tipo")}>
            <option value="">Selecionar</option>
            <option value="agendamento">Agendamento</option>
            <option value="campanha">Campanha</option>
            <option value="urgente">Urgente</option>
            <option value="resposta">Resposta</option>
            <option value="geral">Geral</option>
          </Select>
          {errors.tipo && <p className="text-red-600">{errors.tipo.message}</p>}
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full">Enviar</Button>
                    </div>
        </form>
       </Modal>
    </div>
   
  );
};

export default NotificacaoFuncionario;
