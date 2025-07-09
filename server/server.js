const express = require('express');
const client_bd = require('./db');

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
  res.send('Bem-vindo ao sistema de doações de sangue!para 2025');
});

// Rota para buscar os usuários do banco de dados

// todos usuarios
app.get('/user', async (req, res) => {
  try {
    const resultado = await client_bd.query('SELECT * FROM usuarios');
    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar usuarios' });
  }
});
// um usuario
app.get('/user/:id', async (req, res) => {
  try {
    const {id}= req.params;
    const resultado = await client_bd.query('SELECT * FROM usuarios where id = $1',[
      id
    ]);
    res.json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao mostrar usuario' });
  }
});


///deletar usuario
app.delete('/user/:id', async (req, res) => {
  try {
    const {id}= req.params;
    const resultado = await client_bd.query('DELETE from usuarios where id = $1',[
      id
    ]);
    res.json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao remover usuario' });
  }
});


// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});


