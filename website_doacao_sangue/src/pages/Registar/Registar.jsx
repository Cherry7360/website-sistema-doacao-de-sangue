
const Registar=()=>{
   return(
 
   <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Faça seu registro </h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Nome completo</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Ana Maria Dias "
            />
            <label className="block text-sm font-medium text-gray-600 mb-1">Nome completo</label>
            <input
              type="text" name="cni" placeholder="Ex: 19900908F008c "
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              
            />
             <label className="block text-sm font-medium text-gray-600 mb-1">Morada</label>
            <input
              type="text" name="morada" placeholder="Ex: Bela Vista"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              
            />
             <label className="block text-sm font-medium text-gray-600 mb-1">Telefone</label>
            <input
              input type="text" name="telefone" placeholder="9780765"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              
            />
             <button
            type="submit"
            className="w-full bg-azul text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            enviar
          </button>
          </div>
        </form>
      </div>
    </div>

   )
}
export default Registar
/*
  <input type="text" name="nome" placeholder="Nome" className="w-full p-2 border rounded mb-2"
            value={form.nome} onChange={handleChange} />

            <input type="text" name="cni" placeholder="cni" className="w-full p-2 border rounded mb-2"
            value={form.cni} onChange={handleChange} />

            <input type="text" name="morada" placeholder="Morada" className="w-full p-2 border rounded mb-2"
            value={form.morada} onChange={handleChange} />

            <input type="text" name="telefone" placeholder="Telefone" className="w-full p-2 border rounded mb-2"
            value={form.telefone} onChange={handleChange} />

            <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded mb-2"
            value={form.email} onChange={handleChange} />
            */
