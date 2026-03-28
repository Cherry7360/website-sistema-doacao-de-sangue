import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

// Componente provedor de autenticação, gerencia o estado do usuário e fornece funções de login e logout
export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;

  const [usuario, setUsuario] = useState(
    decoded ? { id: decoded.id, codigo: decoded.codigo, role: decoded.tipo } : null
  );

  // Função para autenticar o usuário e armazenar o token no localStorage
  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUsuario({ id: decoded.id, codigo: decoded.codigo, role: decoded.tipo });
  };

  // Função para deslogar o usuário e remover o token do localStorage
  const logout = () => {
    localStorage.removeItem("token");
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);
