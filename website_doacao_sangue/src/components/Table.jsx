

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Product name
                </th>
                <th scope="col" class="px-6 py-3">
                    Color
                </th>
                <th scope="col" class="px-6 py-3">
                    Category
                </th>
                <th scope="col" class="px-6 py-3">
                    Price
                </th>
                <th scope="col" class="px-6 py-3">
                    Action
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    Apple MacBook Pro 17"
                </th>
                <td class="px-6 py-4">
                    Silver
                </td>
                <td class="px-6 py-4">
                    Laptop
                </td>
                <td class="px-6 py-4">
                    $2999
                </td>
                <td class="px-6 py-4">
                    <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                </td>
            </tr>
      
           
        </tbody>
    </table>
</div>

/**
 * 
 *   {loading ? <p>Carregando...</p> : campanhas.length === 0 ? <p>Nenhuma campanha encontrada.</p> : (
    <table className="min-w-full border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
            <th className="px-4  border p-2">id</th>
          <th className="px-4  border p-2">Descrição</th>
          <th className="px-4  border p-2">Local</th>
          <th className="px-4  border p-2">Data</th>
          <th className="px-4  border p-2">Horário</th>
          <th className="px-4 border p-2">Ações</th>
        </tr>
      </thead>
      <tbody>
    {campanhasFiltradas.map(c => (
      <tr key={c.id_campanha} className="border-b">
       <td className="px-4  border p-2">{c.id_campanha}</td>
        <td className="px-4  border p-2">{c.descricao}</td>
        <td className="px-4  border p-2">{c.local}</td>
        <td className="px-4  border p-2">{c.data_campanha}</td>
        <td className="bpx-4  order p-2">{c.horario}</td>

        <td className="border p-2 flex gap-2">
  {!c.estado ? (
    <>
     
      <button
        onClick={() => atualizarEstado(c.id_campanha, true)}
        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-gray-600"
      >
        Ativar
      </button>
      <button
        onClick={() => removerCampanha(c.id_campanha)}
        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
      >
        Remover
      </button>
    </>
  ) : (
    <>
   
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
        remover
      </button>
    </>
  )}
</td>
      </tr>
        ))}
        </tbody>
    </table>
 */