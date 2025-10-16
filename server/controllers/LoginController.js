
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Usuario from '../models/Usuario.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const loginUsuario = async (req, res) => {
  const { codigo_usuario, palavra_passe } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { codigo_usuario } });
    if (!usuario) return res.status(404).json({ mensagem: 'Código não encontrado' });

    const senhaValida = await bcrypt.compare(palavra_passe, usuario.palavra_passe);
    if (!senhaValida) return res.status(401).json({ mensagem: 'Senha incorreta' });

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
