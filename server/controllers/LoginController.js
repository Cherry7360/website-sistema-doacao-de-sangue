/*
 Realiza login de um usuário do sistema.
Valida dados do body com Zod, verifica existência do usuário e compara senha com bcrypt; 
 Gera um token JWT com id, tipo e código do usuário se as credenciais forem válidas.

*/
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { loginSchema } from '../Schemas/loginSchema.js';
import Usuario from '../models/Usuario.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const loginUsuario = async (req, res) => {

  const parseResult = loginSchema.safeParse(req.body);

  if (!parseResult.success) {
  
    const firstError = Object.values(parseResult.error.flatten().fieldErrors)[0][0];
    return res.status(400).json({ mensagem: firstError });
  }

  const { codigo_usuario, palavra_passe } = parseResult.data;

  try {
    const usuario = await Usuario.findOne({ where: { codigo_usuario } });
    if (!usuario) 
      return res.status(404).json({ mensagem: 'Código ou senha incorretos' });

    const senhaValida = await bcrypt.compare(palavra_passe, usuario.palavra_passe);
    if (!senhaValida) 
      return res.status(404).json({ mensagem: 'Código ou senha incorretos' });

    const token = jwt.sign(
      { id: usuario.id_usuario, tipo: usuario.tipo_usuario, codigo: usuario.codigo_usuario },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ mensagem: 'Login com sucesso', token, tipo: usuario.tipo_usuario });

  } catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao fazer login' });
  }
};
