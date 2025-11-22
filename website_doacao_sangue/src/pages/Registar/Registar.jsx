import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registoSchema } from "../../validations/registoSchema";
import Card from "../../components/Cards";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Textarea from"../../components/Textarea";
import { useState } from "react";
import axios from "axios";
import Stepper from "../../components/Stepper";

const Registar = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(registoSchema),
  });

  const [etapa, setEtapa] = useState(1);
  const [mensagemErro, setMensagemErro] = useState("");

 const proximo = () => setEtapa((prev) => prev + 1);
  const anterior = () => setEtapa((prev) => prev - 1);
 
  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5080/registo/doador", data);
      alert("Doador registrado com sucesso! Seu código será enviado por email.");
      reset();
    } catch (error) {
      console.error(error);
      setMensagemErro("Erro ao registrar doador!");
    }
  };

  return (
      <div className="flex items-center justify-center min-h-screen">
   <Card className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-500">
         Registo
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
           {etapa === 1 && (
  <div className="border border-gray-100 rounded-lg p-5 space-y-4">
   <div className="grid grid-cols-2 gap-4">
      <Input
        label="Nome completo"
        placeholder="Digite o nome completo"
        {...register("nome")}
        error={errors.nome?.message}
      />
      <Input
        label="CNI"
        placeholder="Número de identificação"
        {...register("cni")}
        error={errors.cni?.message}
      />
      <Input
        label="Telefone"
        placeholder="(+238) ..."
        {...register("telefone")}
        error={errors.telefone?.message}
      />
      <Input
        label="Email"
        type="email"
        placeholder="exemplo@email.com"
        {...register("email")}
        error={errors.email?.message}
        className="col-span-2"
      />
      <Input
        label="Morada"
        placeholder="Digite sua morada"
        {...register("morada")}
        error={errors.morada?.message}
        className="col-span-2"
      /> 
      <Input
      label="Profissão"
      placeholder="Ex: Professor, Engenheiro..."
      {...register("profissao")}
      error={errors.profissao?.message}
    />
    </div>

    <div className="flex justify-end mt-4">
      <Button
        type="button"
        onClick={proximo}
        className="bg-blue-500 hover:bg-blue-700">
       Continuar
      </Button>
    </div>
      <Stepper etapaAtual={etapa} totalEtapas={2} />
  </div>
)}

          {etapa === 2 && (
        <section className="border border-gray-300 rounded-lg p-5 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Dados de Saúde</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Peso (kg)"
              type="number"
              placeholder="Ex: 65"
              {...register("peso", { valueAsNumber: true })}
              error={errors.peso?.message}
            />
            <Input
              label="Altura (cm)"
              type="number"
              placeholder="Ex: 170"
              {...register("altura", { valueAsNumber: true })}
              error={errors.altura?.message}
            />
            <Input
              label="Tipo sanguíneo"
              placeholder="Ex: A+, O-"
              {...register("tipo_sangue")}
              error={errors.tipo_sangue?.message}
            />
            <Input
              label="Última doação"
              type="date"
              {...register("ultimaDoacao")}
              error={errors.ultimaDoacao?.message}
            />
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Doenças ou medicações
              </label>
              <Textarea
                {...register("doencas")}
                placeholder="Informe doenças ou medicamentos em uso"
              />
              {errors.doencas && <p className="text-red-600">{errors.doencas.message}</p>}
            </div>
          </div>

          {mensagemErro && <p className="text-red-600 text-center">{mensagemErro}</p>}

<div className="flex justify-between mt-4">
      <Button
        type="button"
        onClick={anterior}
        className="bg-gray-500 hover:bg-gray-700"
      >
        Anterior
      </Button>
          <Button type="submit" className="bg-azul hover:bg-blue-700" >Registrar Doador</Button>
          </div>
        </section>
          )}
        </form>
      </Card>
    </div>
  );
};

export default Registar;
 /**
  *   <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-300">Username</label>
              <input
                type="text"
                placeholder="username.example"
                className="bg-[#111827] border border-gray-600 rounded-lg p-2 focus:border-blue-500 outline-none"
              />
            </div>
  */