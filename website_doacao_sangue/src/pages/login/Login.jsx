import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Card from "../../components/Cards";
import Button from "../../components/Button";
import Input from "../../components/Input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validations/loginSchema";

const base = "http://localhost:5080/loginUsuario/"; 

const Login = () => {
  const navigate = useNavigate();
  const { login, usuario } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },reset
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(base, {
        codigo_usuario: data.codigo,
        palavra_passe: data.password
      });

      reset({codigo:"",password:""})
  
      login(res.data.token);

  
      navigate("/paginaprincipal");

    } catch (erro) {
      console.error("Erro no login:", erro);
      alert(erro.response?.data?.mensagem || "Erro ao conectar ao servidor.");
    }
  };

  const redirectToCadastro = () => navigate('/registar');

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid ">
          <Input
            label="Código"
            placeholder="Ex: 1234567"
            {...register("codigo")}
            error={errors.codigo?.message}
          />

          <Input
            type="password"
            label="Palavra-passe"
            placeholder="Digite sua palavra-passe"
            {...register("password")}
            error={errors.password?.message}
          />
    <Button
            type="button"
            onClick={redirectToCadastro}
            className="text-gray-400 hover:underline text-center mt-2"
          >
            Não tem uma conta? Cadastre-se
          </Button>
        

          
       </div>
   
           <Button type="submit" className="bg-azul hover:bg-blue-700">
            Entrar
          </Button>
        </form>
      </Card>
    
    </div>
  );
};

export default Login;
