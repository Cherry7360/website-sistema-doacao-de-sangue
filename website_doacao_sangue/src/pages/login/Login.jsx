import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";

import axios from "axios";
import Card from "../../components/Cards";
import Button from "../../components/Button";
import Input from "../../components/Input";
import AlertCard from "../../components/AlertCard";

import { HiEye, HiEyeOff } from "react-icons/hi";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validations/loginSchema";

const BASE_URL = "http://localhost:5080/login/"; 

// Componente que gerencia a tela de login, incluindo envio de credenciais e autenticação do usuário

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({show: false, message: "",type: "success"});

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(loginSchema)
  });

  // Função que envia os dados do formulário para autenticar o usuário  
  const onSubmit = async (data) => {
    setLoading(true);
   
    try {
      const res = await axios.post(BASE_URL, {
        codigo_usuario: data.codigo,
        palavra_passe: data.password
      });

      login(res.data.token);
      reset();
      if(res.data.tipo === "doador"){
        navigate("/agendamentos/doador");
      } else if(res.data.tipo === "funcionario"){
        navigate("/doadores");
      } else {
        navigate("/dashboard");
      }


    }  catch (erro) {
      console.error("Erro no login:", erro);

      setAlert({
        show: true,
        message:
          erro.response?.data?.mensagem ||
          "Erro ao conectar ao servidor.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {alert.show && (
        <div className="fixed top-14 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <AlertCard
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ ...alert, show: false })}
          />
        </div>
      )}
      <Card className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        

        
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Código"
            placeholder="1234567"
            {...register("codigo")}
            error={errors.codigo?.message}
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              label="Palavra-passe"
              placeholder="Digite sua palavra-passe"
              {...register("password")}
              error={errors.password?.message}
            />

             <span
              className="absolute right-3 top-[38px] flex items-center cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </span>
          </div>

          <Link
            to="/registar"
            className="text-blue-600 hover:underline text-center text-sm mt-2"
          >
            Não tem uma conta? Registar aqui
          </Link>

          <Button
            type="submit"
            disabled={loading}
            className={`mt-4 py-2 px-6 text-white transition duration-150 rounded-md max-w-xs mx-auto font-bold
               ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {loading ? "A entrar..." : "Entrar"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
