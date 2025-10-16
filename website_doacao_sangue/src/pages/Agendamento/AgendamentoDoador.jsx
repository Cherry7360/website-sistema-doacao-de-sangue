import { useState } from "react";
import Modal from "../../components/Modal";

const AgendamentoDoador=()=>{
      const [mostrar, setMostrar] = useState(false);

  const handleSubmit = (e) => {
        e.preventDefault();

        setMostrar(false); // fecha após enviar
    };

   return(
    <div className='items-center justify-center bg-slate-500' > 
       <div>
        <h1 className="text-5xl font-bold text-gray-700">faça seu agendamento. Não é obrigatorio</h1>
        <button onClick={() => setMostrar(true)} >
              Agendar </button>
        </div>
         <Modal mostrar={mostrar} fechar={() => setMostrar(false)} titulo="Agendar doação">
             <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <button type="submit" >Abriu</button>
             </form>
         </Modal>


    </div>
    
   )
}
export default AgendamentoDoador;
