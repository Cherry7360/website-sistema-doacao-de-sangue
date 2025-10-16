import { createContext, useContext, useState } from "react";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;

  const [usuario, setUsuario] = useState(
    decoded ? { id: decoded.id, codigo: decoded.codigo, role: decoded.tipo } : null
  );

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUsuario({ id: decoded.id, codigo: decoded.codigo, role: decoded.tipo });
  };

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

export const useAuth = () => useContext(AuthContext);
