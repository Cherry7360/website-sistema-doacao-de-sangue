
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../../components/Modal";

const base = "http://localhost:5080/doacoes"; 

const DoacaoFuncionario = ({ currentUser }) => {
  const [search, setSearch] = useState("");
  const [mostrar, setMostrar] = useState(false);
   const [mostraredit, setMostrarEdit] = useState(false);
  const [doacoes, setDoacoes] = useState([]);
  const [doadores, setDoadores] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  
  const [form, setForm] = useState({
    id_doador: "",
    descricao: "",
    data_doacao: "", 
    estado: "Pendente",
    id_funcionario: ""
  });

  const isAdmin = currentUser?.role === "admin";

    const doacoesFiltradas = doacoes.filter((d) => {
      const termo = search.toLowerCase();
      return (
        d.nome.toLowerCase().includes(termo) ||       // pesquisa pelo nome
        String(d.id_doacao).includes(termo)           // pesquisa pelo ID da doação
      );});

  const fetchDoacoes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${base}/gerir_doacoes`);
      setDoacoes(res.data);
    } catch (err) {
      console.error("Erro ao carregar doações:", err.response || err.message);
    } finally {
      setLoading(false);
    }
  };


  const fetchFuncionarios = async () => {
    if (!isAdmin) return;
    try {
      const res = await axios.get(`${base}/funcionarios`);
      setFuncionarios(res.data);
    } catch (err) {
      console.error("Erro ao carregar funcionários:", err);
    }
  };

  useEffect(() => {
    fetchDoacoes();
  
    fetchFuncionarios();
  }, []);

  
  const resetForm = () => {
    setForm({ id_doador: "", descricao: "", data_doacao: "", estado: "Pendente", id_funcionario: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.id_doador) {
      alert("Insere o ID do doador.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        id_doador: Number(form.id_doador),
        descricao: form.descricao || null,
        estado: form.estado || "Pendente",
      };

    
      if (!isAdmin && currentUser?.id_funcionario) {
        payload.id_funcionario = currentUser.id_funcionario;
      } else if (isAdmin && form.id_funcionario) {
        payload.id_funcionario = Number(form.id_funcionario);
      }

      await axios.post(`${base}/gerir_doacoes`, payload);

   
      await fetchDoacoes();
      setMostrar(false);
      resetForm();
    } catch (err) {
      console.error("Erro ao criar doação:", err.response || err.message);
      alert("Erro ao criar doação.");
    } finally {
      setSubmitting(false);
    }
  };

const abrirEditar = (doacao) => {
    setEditingId(doacao.id_doacao);
    setForm({ descricao: doacao.descricao || "", estado: doacao.estado || "Pendente" });
    setMostrarEditar(true);
  };

  const handleEditar = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        descricao: form.descricao || null,
        estado: form.estado || "Pendente",
      };
      await axios.put(`${base}/gerir_doacoes/${editingId}`, payload);
      fetchDoacoes();
      setMostrarEditar(false);
      resetForm();
      setEditingId(null);
    } catch (err) {
      console.error("Erro ao atualizar doação:", err.response || err.message);
      alert("Erro ao atualizar doação.");
    } finally {
      setSubmitting(false);
    }
  };


  // Deletar
  const handleDeletar = async (id) => {
    if (!confirm("Tem certeza que deseja deletar esta doação?")) return;
    try {
      await axios.delete(`${base}/gerir_doacoes/${id}`);
      fetchDoacoes();
    } catch (err) {
      console.error("Erro ao deletar doação:", err.response || err.message);
      alert("Erro ao deletar doação.");
    }
  };


  return ( 
    <div className="items-center justify-center p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Lista de doações</h2>
        <button onClick={() => setMostrar(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Adicionar</button>
      </div>

      <div className="mb-4 flex gap-2">
        <input type="text" placeholder="Pesquisar " value={search} onChange={(e) => setSearch(e.target.value)} className="border rounded-lg px-3 py-2 w-full" />
      </div>

      {loading ? <p>Carregando...</p> : doacoesFiltradas.length === 0 ? <p>Nenhuma doação encontrada.</p> : (
         <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Nome do Doador</th>
              <th className="px-4 py-2 border">Tipo Sangue</th>
            <th className="px-4 py-2 border">Data</th>
            <th className="px-4 py-2 border">Estado</th>
            <th className="px-4 py-2 border">Ações</th>
          </tr>
        </thead>
        <tbody>
          {doacoesFiltradas.map((doacao) => (
            <tr key={doacao.id_doacao} className="text-center">
              <td className="px-4 py-2 border">{doacao.id_doacao}</td>
              <td className="px-4 py-2 border">{doacao.nome}</td>
              <td className="px-4 py-2 border">{doacao.tipo_sangue}</td>
              <td className="px-4 py-2 border">
                {new Date(doacao.data_doacao).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border">{doacao.estado}</td>
              <td>
                <div className="flex gap-2">
                <button
                  onClick={() =>  abrirEditar(doacao.id_doacao)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeletar(doacao.id_doacao)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Excluir
                </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    

      <Modal mostrar={mostrar} fechar={() => setMostrar(false)} titulo="Nova Doação">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        
        {/* Inserir ID do doador */}
        <input
          type="number"
          name="id_doador"
          value={form.id_doador}
          onChange={handleChange}
          placeholder="ID do doador"
          className="border rounded p-2"
          required
        />

        {/* Estado da doação */}
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="border rounded  p-2"
          required
        >
          <option value="Pendente">Pendente</option>
          <option value="Concluída">Concluída</option>
          <option value="Cancelada">Cancelada</option>
        </select>

        {/* Descrição opcional */}
        <textarea
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          placeholder="Descrição (opcional)"
          className="border rounded p-2"
        />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">
          Salvar
        </button>
      </form>
    </Modal>

      <Modal mostrar={mostraredit} fechar={() => setMostrarEdit(false)} titulo="Editar Doação">
        <form onSubmit={handleEditar} className="flex flex-col gap-3">
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          >
            <option value="Pendente">Pendente</option>
            <option value="Concluída">Concluída</option>
            <option value="Cancelada">Cancelada</option>
          </select>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            placeholder="Descrição (opcional)"
            className="border rounded px-3 py-2"
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg" disabled={submitting}>
            Salvar Alterações
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default DoacaoFuncionario;
