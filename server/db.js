const { Client } = require('pg');

const client_bd = new Client({
    host: "localhost",
    user: "usuario_admin",
    port: 5432,
    password: "user2002",
    database: "banco_doacoes"
  });
  client_bd.connect()
  .then(() => console.log(' Conectado ao PostgreSQL'))
  .catch(err => console.error(' Erro ao conectar ao PostgreSQL:', err.message));

 module.exports= client_bd;


