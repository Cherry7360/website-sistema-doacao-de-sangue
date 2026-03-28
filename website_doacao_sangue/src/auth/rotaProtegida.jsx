import { Navigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';

// Componente que protege rotas, permitindo acesso apenas a usuários autenticados e, opcionalmente, com uma role específica
const RotaProtegida = ({ children, role }) => {
  const { usuario, carregando } = useAuth();
 
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
