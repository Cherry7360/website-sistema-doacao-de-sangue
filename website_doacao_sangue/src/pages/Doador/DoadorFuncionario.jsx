import { useState } from "react";

const DoadorFuncionario=()=> {
  const [tabAtiva, setTabAtiva] = useState("lista");

  return (
    <div className="p-6">
      {/* Cabeçalho das tabs */}
      <div className="flex border-b mb-4">
        <button
          onClick={() => setTabAtiva("lista")}
          className={`px-4 py-2 ${
            tabAtiva === "lista"
              ? "border-b-2 border-blue-600 text-blue-600 font-medium"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Lista
        </button>
        <button
          onClick={() => setTabAtiva("form")}
          className={`px-4 py-2 ${
            tabAtiva === "form"
              ? "border-b-2 border-blue-600 text-blue-600 font-medium"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Formulário
        </button>
      </div>

      {/* Conteúdo das tabs */}
      {tabAtiva === "lista" && (
        <div>
          {/* Coloca aqui tua tabela ou listagem */}
          <p className="text-gray-600">Conteúdo da lista vai aqui...</p>
        </div>
      )}

      {tabAtiva === "form" && (
        <div>
          {/* Coloca aqui teu formulário */}
          <p className="text-gray-600">Formulário vai aqui...</p>
        </div>
      )}
    </div>
  );
}
export default  DoadorFuncionario;
