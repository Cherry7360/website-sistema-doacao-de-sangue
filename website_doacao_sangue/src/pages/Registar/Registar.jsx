import {  useNavigate} from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registoSchema } from "../../validations/registoSchema";
import Card from "../../components/Cards";
import Button from "../../components/Button";
import Input from "../../components/Input";

import Select from "../../components/Select.jsx";
import AlertCard from "../../components/AlertCard";

import { useState } from "react";
import axios from "axios";

const BASE_URL  = "http://localhost:5080/doadores";

// Componente que gerencia o registo de novos doadores

const Registar = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset,getValues, trigger } = useForm({
    resolver: zodResolver(registoSchema),
  });

const [tentouContinuar, setTentouContinuar] = useState(false);

  const [etapa, setEtapa] = useState(1);
  const [mensagemErro, setMensagemErro] = useState("");
  const [alert, setAlert] = useState(null); 
 
  const proximo = () => setEtapa((prev) => prev + 1);
  const anterior = () => setEtapa((prev) => prev - 1);

// Lista de campos da etapa 1
const camposEtapa1 = [
  "nome",
  "cni",
  "telefone",
  "email",
  "morada",
  "genero",
  "profissao"
];

// Verifica se algum campo da etapa 1 tem erro
const temErrosEtapa1 = camposEtapa1.some(campo => errors[campo]);

// Verifica se todos os campos estão preenchidos
const todosPreenchidosEtapa1 = camposEtapa1.every(campo => getValues(campo));

const etapa1Valida = todosPreenchidosEtapa1 && !temErrosEtapa1;

   // Função que envia os dados do formulário para registrar um novo doador
  const onSubmit = async (data) => {
  if (data.doencas && data.doencas !== "Nenhuma") {
    setAlert({
      type: "error",
      message: "Registo não efetuado. Dirija-se ao banco de sangue."
    });

    // espera segundos antes de navegar
    setTimeout(() => {
      navigate("/loginUsuario");
    }, 3000);

    return; 
  }

  try {
    await axios.post(BASE_URL, data);
    setAlert({
      type: "success",
      message: "Doador registrado com sucesso! Seu código será enviado por email."
    });

    reset();
    setEtapa(1);

    // espera 2 segundos antes de navegar
    setTimeout(() => {
      navigate("/paginaprincipal");
    }, 2000);

  } catch (error) {
    console.error(error);

   
    setAlert({
      type: "error",
      message: "Erro ao registrar doador! Dirija-se ao banco de sangue."
    });

    setTimeout(() => {
      navigate("/paginaprincipal");
    }, 2000);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl pb-4 font-bold mb-6 text-center text-gray-700">Torne-se um Doador</h2>
       
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                 {alert && (
                     <div className="fixed top-5 right-5 z-50">
                       <AlertCard
                         type={alert.type}
                         message={alert.message}
                         onClose={() => setAlert(null)}
                       />
                     </div>
                   )}
          
          {etapa === 1 && (
            <div className=" rounded-lg p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome completo"
                  required
                  {...register("nome")}
                  error={errors.nome?.message}
                />

                <Input
                  label="CNI"
                  required
                  {...register("cni")}
                  error={errors.cni?.message}
                />

                <Input
                  label="Telefone"
                  required
                  {...register("telefone")}
                  error={errors.telefone?.message}
                />

                <Input
                  label="Email"
                  type="email"
                  required
                  {...register("email")}
                  error={errors.email?.message}
                />

                <Input
                  label="Morada"
                  required
                  {...register("morada")}
                  error={errors.morada?.message}
                />

                <Select
                  label="Género"
                  required
                  {...register("genero")}
                  error={errors.genero?.message}
                >
                  <option value="">Selecione seu género</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </Select>

                <Input
                  label="Profissão"
                  required
                  {...register("profissao")}
                  error={errors.profissao?.message}
                />

              </div>
           {tentouContinuar && !etapa1Valida && (
            <p className="text-sm text-red-600 text-center mt-2">
            Preenche todos os campos
            </p>
          )}


              <div>
                <p className="text-sm text-gray-500 text-center mb-4">
                Campos marcados com <span className="text-red-500">*</span> são obrigatórios
                </p>
              </div>
              
             <div className="flex justify-center gap-4  pt-6">
              <Button
                type="button"
                onClick={() => navigate('/paginaprincipal')}
                className="bg-gray-500 hover:bg-gray-700 py-2 px-6 text-white font-semibold rounded-md"
              >
                Voltar
              </Button>

              <Button
                type="button"
                onClick={async () => {
                  setTentouContinuar(true);

                  // valida só os campos da etapa 1
                  const valido = await trigger(camposEtapa1);

                  if (valido) {
                    proximo();
                  }
                }}
                className={`px-6 py-2 font-semibold rounded-md text-white
                  ${etapa1Valida ? "bg-red-700 hover:bg-red-600" : "bg-red-400 cursor-not-allowed"}
                `}
              >
                Continuar
              </Button>







            </div>


            </div>
          )}

        
          {etapa === 2 && (
            <div className=" rounded-lg p-5 space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Dados de Saúde</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Peso (kg)" type="number" placeholder="Ex: 65" required {...register("peso", { valueAsNumber: true })} error={errors.peso?.message} />
                <Input label="Altura (cm)" type="number" placeholder="Ex: 170" required {...register("altura", { valueAsNumber: true })} error={errors.altura?.message} />
                <Input label="Tipo sanguíneo" 
                required
                placeholder="Ex: A+, O-" 
                {...register("tipo_sangue")} 
                error={errors.tipo_sangue?.message} />
              
                 <Select
                    label="Doenças ou medicações"
                    required
                    {...register("doencas")}
                    error={errors.doencas?.message}
                  >
                    <option value="">Selecione</option>
                    <option value="Nenhuma">Nenhuma</option>
                    <option value="Sim">Sim (não pode registar)</option>
                  </Select>
              </div>

              {mensagemErro && <p className="text-red-600 text-center">{mensagemErro}</p>}

              <div className="flex justify-center gap-4  pt-6">
                <Button type="button" onClick={anterior} className="bg-gray-500 hover:bg-gray-700 py-2 px-6 text-white font-semibold rounded-md">
                  Anterior
                </Button>
                <Button type="submit" className="hover:bg-red-600 bg-red-700 py-2 px-6 text-white font-semibold rounded-md">
                  Finalizar registo
                </Button>
              </div>
            </div>
          )}

        </form>
      </Card>
    </div>
  );
};

export default Registar;
