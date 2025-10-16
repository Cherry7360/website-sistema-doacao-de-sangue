import { useState } from "react";
import Modal from "../../components/Modal";

const Doacao=()=>{
    const [search, setSearch] = useState("");
      const [mostrar, setMostrar] = useState(false);

       const handleSubmit = (e) => {
        e.preventDefault();

        setMostrar(false); // fecha após enviar
    };

   return(
    <div className='items-center justify-center p-6 bg-slate-400' > 
    
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Lista de doações</h2>
        <button
          onClick={() => setMostrar(true)} 
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
            <th className="border p-2">código</th>
            <th className="border p-2">doador</th>
            <th className="border p-2">data/ hora</th>
            <th className="border p-2">estado</th>
            <th className="border p-2">Ações</th>
          </tr>
        </thead>
       
      </table>


      <Modal mostrar={mostrar} fechar={() => setMostrar(false)} titulo="Registar doador">
             <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                
             <input
             type="text"
              placeholder="Telefone"/>
             </form>
         </Modal>
    </div>
    
   )
}
export default Doacao;
