import React from 'react';
import { Link } from "react-router-dom";

import heroImagem from "../../assets/recolha_sangue.png";
import cruz_v from "../../assets/cruz_vermelha.png";
import MS from "../../assets/MS.png";
import oms from "../../assets/oms.png";
import fraseImagem from "../../assets/bgfrase.jpg"; 
import bancosangue from "../../assets/bancosangue.jpg"

import camp1 from "../../assets/camp1.png"
import camp2 from "../../assets/camp2.png"
import camp3 from "../../assets/camp3.png"
const PaginaPrincipal = () => {
  const token = localStorage.getItem("token"); 
const campanhas = [
  {
    id: 1,
    imagem: camp1,
    descricao: "Seu gesto pode fazer a diferença."
  },
  {
    id: 2,
    imagem: camp3,
    descricao: "A solidariedade corre nas suas veias."
  },
  {
    id: 3,
    imagem: camp2,
    descricao: "A esperança começa com a sua doação."
  }
];

  return (
    <div className="w-ful">
      <section
        className="min-h-screen flex items-center justify-start bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${heroImagem})` }}
      >
        <div className="absolute inset-0 bg-black/40">
        </div>
        <div className="relative z-10 max-w-2xl ml-16 md:ml-32 px-12 py-20 text-left"> <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
          Bem-vindo ao Doe+Sangue
          </h1>

          <p className="text-lg md:text-2xl mb-8 text-white">
            Um simples gesto pode salvar vidas. Doe+Sangue hoje e ajude a garantir esperança para quem mais precisa.
          </p>

          <Link to="/registar"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded shadow-lg">
            Doar Agora
          </Link>
        </div>
      </section>

    
     <section className="w-full py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row items-center gap-8">

            {/* Imagem */}
            <div className="md:w-1/2 flex justify-center">
              <img
                src={bancosangue}
                alt="Frase Banco de Sangue"
                className="w-full max-w-sm h-64 md:h-80 rounded-lg shadow-md object-cover"
              />
            </div>

            {/* Texto */}
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-red-700">
                Doe sangue, salve vidas
              </h2>

              <p className="text-lg mb-4 text-gray-700">
                O banco de sangue Hospital Batista de Sousa trabalha diariamente
                para garantir sangue seguro e disponível para quem precisa.
                Cada doação transforma vidas e fortalece a nossa comunidade.
              </p>
            </div>

          </div>

        </div>
      </section>

      <section
         className="w-full py-24 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-8">
                
          {/* Texto à esquerda */}
          <div className="md:w-1/2 text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-red-700">
              Quem pode doar?
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Veja rapidamente quem pode doar sangue e ajudar a salvar vidas em São Vicente. 
              Para mais detalhes sobre requisitos completos, acesse a página dedicada.
            </p>

            <Link 
              to="/sabermais/requisitos_doador"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded shadow-lg"
            >
              Saber Mais
            </Link>
          </div>

          {/* Imagem opcional à direita */}
          <div className="md:w-1/2 flex justify-center">
            <img 
            src={heroImagem} // substituir pela imagem/ilustração desejada
              alt="Doação de sangue"
          className="w-full max-w-sm h-64 md:h-80 rounded-lg shadow-md object-cover" 
        
            />
          </div>

        </div>
      </section>

     <section className="w-full py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

         
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-red-700 mb-4">
              Campanhas Ativas
            </h2>
            <p className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto">
              Participe nas campanhas de doação de sangue e ajude a salvar vidas na nossa comunidade.
            </p>
          </div>

       
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
        {campanhas.map((campanha) => (
          <div key={campanha.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:scale-105">
            <img
              src={campanha.imagem}
              alt={`Campanha ${campanha.id}`}
               className="w-full h-48 object-cover "
            />

            <div className="p-4 flex-1 flex flex-col justify-between">
              <p className="text-gray-700 mb-4">
                {campanha.descricao}
              </p>
            </div>
          </div>
        ))}
      </div>

       
          <div className="text-center">
            <Link 
              to="/campanhas/doador"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded shadow-lg"
            >
              Ver Todas as Campanhas
            </Link>
          </div>

        </div>
      </section>

  

      <section className="w-full py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">

          {/* Título + frase */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Nossos Colaboradores
            </h2>
            
          </div>

          {/* Logos */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-8">
            {[cruz_v, MS, oms].map((logo, index) => (
              <div
                key={index}
                className="w-32 h-24 flex items-center justify-center rounded-xl shadow-lg bg-gray-50 border border-gray-100 p-4"
              >
                <img src={logo} alt={`Colaborador ${index + 1}`} className="w-full h-full object-contain" />
              </div>
            ))}
          </div>

        </div>
      </section>


    <footer className="bg-red-700 text-white py-6 text-center">
        <p>© 2026 Banco de Sangue. Todos os direitos reservados.</p>
      </footer>
      </div>

  
  );
};

export default PaginaPrincipal;

