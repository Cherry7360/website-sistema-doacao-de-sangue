
const Agendamento=()=>{
   return(
        <table className="mt-5 text-center  border-black w-full border-collapse">
        <thead>
            <tr className="border-b border-gray-400">
            <th className="p-2">Nome</th>
            <th className="p-2">Idade</th>
            <th className="p-2">Cidade</th>
            </tr>
        </thead>
        <tbody>
            <tr className="border-b border-gray-300">
            <td className="p-2">Maria</td>
            <td className="p-2">25</td>
            <td className="p-2">Lisboa</td>
            </tr>
            <tr className="border-b border-gray-300">
            <td className="p-2">João</td>
            <td className="p-2">30</td>
            <td className="p-2">Porto</td>
            </tr>
            <tr>
            <td className="p-2">Ana</td>
            <td className="p-2">28</td>
            <td className="p-2">Coimbra</td>
            </tr>
        </tbody>
        </table>


   )
 }
 export default Agendamento;