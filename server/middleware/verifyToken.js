/* Verifica e valida o token JWT enviado no header Authorization.
Decodifica o token usando a chave JWT_SECRET, valida campos essenciais (id, codigo, tipo) 
 e adiciona req.usuario com os dados decodificados; retorna 401/403 em falhas de autenticação.
*/
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export  const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ mensagem: "Token não fornecido" });

  const token = authHeader.split(" ")[1]; 
  if (!token) return res.status(401).json({ mensagem: "Token inválido" });


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id || !decoded.codigo || !decoded.tipo) {
      return res.status(400).json({ mensagem: "Token incompleto" });
    }
    req.usuario = {
      id: decoded.id,
      codigo: decoded.codigo,
      tipo: decoded.tipo, 
    };
    next();
  } catch (err) {
    return res.status(403).json({ mensagem: "Token inválido ou expirado" });
  }
};
