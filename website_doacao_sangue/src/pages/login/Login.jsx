import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useState } from 'react';
import { jwtDecode } from "jwt-decode";




const Login = () => {

  const navigate = useNavigate();
  const [codigoDoador, setCodigoDoador] = useState("");
  const [passwordDoador, setPasswordDoador] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");

  const auth = useAuth();

  const validarCampos = () => {
    if (!codigoDoador || !passwordDoador) {
      setMensagemErro("Preencha todos os campos.");
      return false;
    }

    if (!/^\d{7}$/.test(codigoDoador)) {
      setMensagemErro("O código deve conter exatamente 7 dígitos numéricos.");
      return false;
    }

    return true;
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setMensagemErro("");

    if (!validarCampos()) return;

    try {
      const resposta = await fetch("http://localhost:5080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          codigo_usuario: codigoDoador,
          palavra_passe: passwordDoador
        })
      });

      const dados = await resposta.json();

     if (resposta.ok) {

      const token = dados.token;
      const dadosUser = jwtDecode(token); // objeto com tipo user
      console.log('dados do User:',dadosUser);
      localStorage.setItem("token", dados.token);
      console.log('dados token;',dados.token);
     

    if (dadosUser.role === 'funcionario') {
      alert("Login de funcionário efetuado!");
    
    } 
    else if (dadosUser.role === 'doador') {
      alert("doador login efetuado!");
    }

 
  
  auth.login(token); // salva provider

  navigate("/paginaprincipal");

      } else {
        setMensagemErro(dados.mensagem || "Erro ao fazer login.");
      }
    } catch (erro) {
      console.error("Erro na requisição:", erro);
      setMensagemErro("Erro ao conectar ao servidor.");
    }
  };

  const redirectToCadastro = () => {
    navigate('/registar');
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">Código usuário</label>
               <input
                  className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  type='text'
                  placeholder='Código (ex: 70000001)'
                  value={codigoDoador}
                  onChange={(e) => setCodigoDoador(e.target.value)}
                />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-1">Senha</label>
             <input
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                type='password'
                placeholder='Palavra-passe'
                value={passwordDoador}
                onChange={(e) => setPasswordDoador(e.target.value)}
              />
          </div>

           {mensagemErro && (
          <p style={{ color: "red", marginTop: 5 }}>{mensagemErro}</p>
        )}

          <button
            type="submit"
            className="w-full bg-azul text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Entrar
          </button>
           <button type="button" onClick={redirectToCadastro}>
          Não tem uma conta? Cadastre-se
        </button>
        </form>
      </div>
    </div>
  );
};

export default Login;


