import { useState } from "react";

const Doadores = () => {
  const [search, setSearch] = useState("");
  const [doadores, setDoadores] = useState([
    { id: 1, nome: "Maria Silva", bi: "123456789", telefone: "900 111 222" },
    { id: 2, nome: "João Santos", bi: "987654321", telefone: "911 222 333" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [novoDoador, setNovoDoador] = useState({ nome: "", bi: "", telefone: "" });

  const handleAdd = () => {
    setDoadores([...doadores, { id: Date.now(), ...novoDoador }]);
    setNovoDoador({ nome: "", bi: "", telefone: "" });
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setDoadores(doadores.filter((d) => d.id !== id));
  };

  return (
    <div className="items-center justify-center p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Lista de Doadores</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Adicionar
        </button>
      </div>

      {/* Pesquisa */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Pesquisar por nome ou BI"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full"
        />
      </div>

      {/* Tabela */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nome</th>
            <th className="border p-2">BI</th>
            <th className="border p-2">Telefone</th>
            <th className="border p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {doadores
            .filter(
              (d) =>
                d.nome.toLowerCase().includes(search.toLowerCase()) ||
                d.bi.includes(search)
            )
            .map((d) => (
              <tr key={d.id}>
                <td className="border p-2">{d.id}</td>
                <td className="border p-2">{d.nome}</td>
                <td className="border p-2">{d.bi}</td>
                <td className="border p-2">{d.telefone}</td>
                <td className="border p-2 flex gap-2">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded">
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Adicionar Doador</h3>
            <input
              type="text"
              placeholder="Nome"
              value={novoDoador.nome}
              onChange={(e) => setNovoDoador({ ...novoDoador, nome: e.target.value })}
              className="border rounded-lg px-3 py-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="BI"
              value={novoDoador.bi}
              onChange={(e) => setNovoDoador({ ...novoDoador, bi: e.target.value })}
              className="border rounded-lg px-3 py-2 w-full mb-2"
            />
            <input
              type="text"
              placeholder="Telefone"
              value={novoDoador.telefone}
              onChange={(e) =>
                setNovoDoador({ ...novoDoador, telefone: e.target.value })
              }
              className="border rounded-lg px-3 py-2 w-full mb-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 rounded bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleAdd}
                className="px-3 py-1 rounded bg-green-600 text-white"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doadores;
