// src/auth/RotaProtegida.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RotaProtegida = ({ children,role }) => {
  const { usuario,carregando } = useAuth();
 
  if (carregando) {
    return <div>Carregando...</div>; 
  }

  if (!usuario) {
    return <Navigate to="/login" replace/>;
  }

    if (role && usuario.role !== role) {
      return <Navigate to="/nao-autorizado" replace />;
  }


  return children;
};
export default RotaProtegida;

/*
  if (role && usuario.role !== role) {
    return <Navigate to="/nao-autorizado" />;
  }*/
