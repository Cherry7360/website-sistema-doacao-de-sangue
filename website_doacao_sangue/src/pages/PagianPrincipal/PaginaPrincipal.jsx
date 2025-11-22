import bgBemVindo from "../../assets/recolha_sangue.png";
import cruz_v from "../../assets/cruz_vermelha.png";
import MS from "../../assets/MS.png";
import { Link } from "react-router-dom";
import SaberMais from "../SaberMais/SaberMais";
import Card from "../../components/Cards";

const PaginaPrincipal=()=>{
   return(
    <div className=' space-y-16 p-6' > 
     <section
        className="w-full min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${bgBemVindo})` }}
      >
        
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

       
        <div className="relative text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Bem-vindo ao Sistema de Doação de Sangue
          </h1>
          <p className="text-white text-lg md:text-xl max-w-2xl mx-auto">
            Salve vidas com um simples gesto. Junte-se a nós e faça a diferença hoje.
          </p>
        </div>
      </section>
        <Card className="bg-white py-12 rounded-2xl shadow-md">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-vermelho mb-6">Campanhas Ativas</h2>
            <p className="text-gray-700 mb-4">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nunc convallis ex nec risus ornare, ac posuere massa consectetur. Nulla 
            </p>
            <Link to="/campanhas/doador"
              className="mt-4 px-6 py-3 bg-vermelho text-white rounded-xl hover:bg-red-600 transition duration-300 inline-block text-center">
              Ver Campanhas
            </Link>
          </div>
       </Card>    

      <Card className="bg-white py-12 rounded-2xl shadow-md">
       <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-semibold text-vermelho mb-6">Quem deve doar? </h2>
            <p className="text-gray-700 mb-4">
            Nunc convallis ex nec risus ornare, ac posuere massa consectetur. Nulla v .Nunc convallis ex nec risus ornare, ac posuere massa consectetur. Nulla v Nunc convallis ex nec risus ornare, ac posuere massa consectetur. Nulla v 
            </p>
            <Link to="/sabermais/requisitos_doador"
              className="mt-4 px-6 py-3 bg-vermelho text-white rounded-xl hover:bg-red-600 transition duration-300 inline-block text-center">
              Saber Mais
            </Link>
          </div>

      </Card>
     

      <Card className="bg-white py-12 rounded-2xl shadow-md">
       <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Nossos Patrocinadores</h2>
        <p className="text-gray-600 mb-4">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit.
        </p>


  <div className="flex flex-wrap justify-center gap-8 mt-8">
    <div
      className="p-4 rounded-xl shadow w-64 h-56 flex items-center justify-center text-gray-700 font-medium bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${cruz_v})` }}
    >
    </div>

    <div
      className="p-4 rounded-xl shadow w-64 h-56 flex items-center justify-center text-gray-700 font-medium bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${MS})` }}
    >
    </div>
     </div>
    </div>

      </Card>
    </div>
    
   )
}
export default PaginaPrincipal
