require('dotenv').config();
const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const client_bd  = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;


router.post('/', async (req, res) => {
  const { codigo_usuario, palavra_passe } = req.body;

  try {
    const result = await client_bd .query(
      'SELECT * FROM usuarios WHERE codigo_usuario = $1', 
      [codigo_usuario]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Código não encontrado' });
    }

    const usuario = result.rows[0];
    const senhaValida = await bcrypt.compare(palavra_passe, usuario.palavra_passe);

    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    // Gerar o token com os dados
    
    const token = jwt.sign(
      { id: usuario.id_usuario, 
        role: usuario.tipo_usuario, 
        codigo: usuario.codigo_usuario}
      ,
       JWT_SECRET,
      { expiresIn: '1h' }  );
      res.status(200).json({ mensagem: 'Login com sucesso', 
        token: token, role: usuario.tipo_usuario });

  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ mensagem: 'Erro ao fazer login' });
  }
});

module.exports = router;
