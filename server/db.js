require('dotenv').config();
const { Client } = require('pg');

const client_bd = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port:process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  client_bd.connect()
  .then(() => console.log(' Conectado ao PostgreSQL'))
  .catch(err => console.error(' Erro ao conectar ao PostgreSQL:', err.message));

 module.exports= client_bd;

 /*  try {
    await client.connect();
    const resultado = await client.query('SELECT * FROM usuarios');
    res.json(resultado.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  } finally {
    await client.end();
  }*/