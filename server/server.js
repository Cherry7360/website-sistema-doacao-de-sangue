const express = require('express');
const cors = require('cors'); 


const app = express();

/*
const campanhasRoute= require('./routes/CampanhasRoute');
const DoacaoRoute= require('./routes/DoacaoRoute');
const agendamentoRoute= require('./routes/AgendamentoRoute');
const notificacaoRoute= require('./routes/NotificacaoRoute');
const doadoresRoute= require('./routes/DoadoresRoutes')
*/
const loginRoute = require('./routes/LoginRoute');

const registoDoador=require('./routes/RegistarDoadorRoute');

//const alterarSenhaRoute = require('./routes/alterarSenha');

const port =  process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3080' 
}));

// Middleware para parsear JSON
app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
  res.send('Bem-vindo ao sistema de doações de sangue! Para 2025');
});


//app.use('/campanhas', campanhasRoute);
//app.use('/doacao', DoacaoRoute);
//app.use('/agendamento', agendamentoRoute);
//app.use('/notificacoes', notificacaoRoute);
app.use('/login', loginRoute);
//app.use('/doadores',doadoresRoute);
app.use('/registo',registoDoador)

//app.use('/alterar-senha', alterarSenhaRoute);


// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

