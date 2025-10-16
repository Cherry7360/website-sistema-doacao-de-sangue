
import { useState,useEffect  } from "react";
import axios from "axios";
import Modal from "../../components/Modal";

const base = "http://localhost:5080/doacoes"; 

const CampanhaFuncionario = () => {
    const [search, setSearch] = useState("");
 const [campanhas, setCampanhas] = useState([]);
  const [mostrar, setMostrar] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [dataCampanha, setDataCampanha] = useState("");
  const [horario, setHorario] = useState("");
  const [foto, setFoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [idFuncionario, setIdFuncionario] = useState(""); 
    const [local, setLocal] = useState("");

  useEffect(() => {

    const fetchCampanhas = async () => {
      try {
        const res = await axios.get(`${base}/gerir_campanhas`);
        setCampanhas(res.data);
      } catch (error) {
        console.error("Erro ao buscar campanhas:", error);
      } finally {
      setLoading(false); // atualiza loading para false
    }
    };
    fetchCampanhas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const novaCampanha = {
      descricao,
      data_campanha: dataCampanha,
      horario,
      foto,
      local,
      id_funcionario: idFuncionario || 1,
      };

      await axios.post(`${base}/gerir_campanhas`, novaCampanha);
      alert("Campanha adicionada com sucesso!");
      
      const res = await axios.get(`${base}/gerir_campanhas`);
      setCampanhas(res.data);


      // limpa formulário
      setDescricao("");
      setDataCampanha("");
      setHorario("");
      setFoto("");
      setIdFuncionario("");
      setLocal("");
    } catch (error) {
      console.error("Erro ao adicionar campanha:", error);
      alert("Erro ao adicionar campanha.");
    }
  };
  const atualizarEstado = async (id, estado) => {
    await axios.put(`${base}/gerir_campanhas/${id}`, { estado });
  // Atualiza a lista
  const res = await axios.get(`${base}/gerir_campanhas`);
    setCampanhas(res.data);
    };
  const removerCampanha = async (id) => {
    await axios.delete(`${base}/gerir_campanhas/${id}`);
    // Atualiza a lista
    const res = await axios.get(`${base}/gerir_campanhas`);
    setCampanhas(res.data);
    };


  return (
    <div className="items-center justify-center p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Lista campanhas </h2>
        <button onClick={() => setMostrar(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Adicionar</button>
      </div>

       <div className="mb-4 flex gap-2">
        <input type="text" placeholder="Pesquisar " value={search} onChange={(e) => setSearch(e.target.value)} className="border rounded-lg px-3 py-2 w-full" />
      </div>
    {loading ? <p>Carregando...</p> : campanhas.length === 0 ? <p>Nenhuma campanha encontrada.</p> : (
    <table className="min-w-full border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4  border p-2">Descrição</th>
          <th className="px-4  border p-2">Local</th>
          <th className="px-4  border p-2">Data</th>
          <th className="px-4  border p-2">Horário</th>
          <th className="px-4 border p-2">Ações</th>
        </tr>
      </thead>
      <tbody>
    {campanhas.map(c => (
      <tr key={c.id_campanha} className="border-b">
        <td className="px-4  border p-2">{c.descricao}</td>
        <td className="px-4  border p-2">{c.local}</td>
        <td className="px-4  border p-2">{c.data_campanha}</td>
        <td className="bpx-4  order p-2">{c.horario}</td>

        <td className="px-4  border p-2 ">
          <div className="flex gap-2">
          <button
            onClick={() => atualizarEstado(c.id_campanha, false)}
            className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
          >
            Inativar
          </button>
          <button
            onClick={() => removerCampanha(c.id_campanha)}
            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
          >
            Remover
          </button>
          </div>
        </td>
      </tr>
        ))}
        </tbody>
    </table>)
}
    <Modal mostrar={mostrar} fechar={() => setMostrar(false)} titulo="Nova Campanha">
       <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        
        <textarea
          placeholder="Descrição da campanha"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          value={dataCampanha}
          onChange={(e) => setDataCampanha(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="time"
          value={horario}
          onChange={(e) => setHorario(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
            type="text"
            placeholder="Local da campanha"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            className="w-full border p-2 rounded"
            />


        <input
          type="text"
          placeholder="Link ou nome da foto"
          value={foto}
          onChange={(e) => setFoto(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          placeholder="ID Funcionário"
          value={idFuncionario}
          onChange={(e) => setIdFuncionario(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">
          Salvar
        </button>
       
      </form>
    </Modal>

    </div>
  );
};

export default CampanhaFuncionario;
