
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }


  const token = req.headers.authorization?.split(' ')[1]; // "Bearer token..."


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Usa a tua chave secreta real
    req.user = decoded;// os controllers têm acesso ID, CODIGO, ROLE
    next();
  } catch (err) {
    return res.status(403).json({ erro: "Token inválido" });
  }
};

module.exports = verificarToken;
