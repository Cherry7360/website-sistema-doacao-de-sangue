import { Navigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';

// Componente que protege rotas, permitindo acesso apenas a usuários autenticados e, opcionalmente, com uma role específica
const RotaProtegida = ({ children, role }) => {
  const { usuario, carregando } = useAuth();

  if (carregando) return <div>Carregando...</div>;

  return !usuario 
    ? <Navigate to="/login" replace /> 
    : role && usuario.role !== role 
      ? <Navigate to="/nao-autorizado" replace /> 
      : children;
};

export default RotaProtegida;
