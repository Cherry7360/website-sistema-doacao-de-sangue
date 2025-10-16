import bgBemVindo from "../../assets/recolha_sangue.png";
import cruz_v from "../../assets/cruz_vermelha.png";

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

      <section className="bg-white py-12 rounded-2xl shadow-md">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-vermelho mb-6">Campanhas Ativas</h2>
          <p className="text-gray-700 mb-4">
           Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
          </p>
          <button className="mt-4 px-6 py-3 bg-vermelho text-white rounded-xl hover:bg-red-600 transition duration-300">
            Ver Campanhas
          </button>
        </div>
      </section>

       <section className="bg-gray-100 py-12 rounded-2xl shadow-md">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Nossos Patrocinadores</h2>
          <p className="text-gray-600 mb-4">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
            </p>
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className=" p-4 rounded-xl shadow w-[250px] h-[230px] flex items-center justify-center text-gray-700 font-medium bg-cover bg-center bg-no-repeat "
            style={{ backgroundImage: `url(${cruz_v})` }}>

              
            </div>
            
          </div>
        </div>
      </section>

    </div>
    
   )
}
export default PaginaPrincipal
//className="text-center py-16 bg-gradient-to-br from-blue-100 to-white rounded-2xl shadow-md"
//bg-cover bg-center bg-no-repeat → ajusta bem a imagem.
//min-h-screen w-full 