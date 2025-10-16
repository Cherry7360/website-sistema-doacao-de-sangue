import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export  const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ mensagem: "Token não fornecido" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
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

    next(); // segue para o controller
  } catch (err) {
    return res.status(403).json({ mensagem: "Token inválido ou expirado" });
  }
};
