import { useState } from "react";
import axios from "axios";

 const base= "http://localhost:5080/notificacoes"
 
const NotificacaoFuncionario = () => {
 
  const [formData, setFormData] = useState({ id_doador: "", mensagem: "" });
   const [search, setSearch] = useState("");
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${base}/gerir_notificacoes`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Notificação enviada!");
      setFormData({ id_doador: "", mensagem: "" });
    } catch (err) {
      console.error("Erro ao enviar notificação:", err);
    }
  };

  return (
    <div className="items-center justify-center p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Notificações </h2>
      </div>

      
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            name="id_doador"
            placeholder="ID do doador"
            value={formData.id_doador}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            name="mensagem"
            placeholder="Mensagem"
            value={formData.mensagem}
            onChange={handleChange}
            required
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
          >
            Enviar
            </button>
          </form>
      </div>

       
    </div>
   
  );
};

export default NotificacaoFuncionario;
