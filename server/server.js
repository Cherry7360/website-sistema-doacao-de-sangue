import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './db.js';

import loginRoute from './routes/LoginRoute.js';
import registarDoadorRoute from './routes/RegistarDoadorRoute.js';
import doadorRoutes from './routes/DoadorRoute.js';
import doacaoRoutes from './routes/DoacaoRoute.js';
import notificacaoRoutes from './routes/NotificacaoRoute.js';
import campanhaRoutes from './routes/CampanhaRoute.js';
import agendamentoRoutes from './routes/AgendamentoRoute.js';
import DashRoutes from './routes/DashRoute.js';
import UsuarioRoutes from './routes/UsuariosRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use("/uploads", express.static("uploads"));
app.use(cors({ origin: 'http://localhost:3080' }));
app.use(express.json());

app.use('/loginUsuario', loginRoute);
app.use('/registo', registarDoadorRoute);
app.use('/doadores', doadorRoutes);
app.use('/doacoes',doacaoRoutes);
app.use('/notificacoes',notificacaoRoutes);
app.use('/campanhas',campanhaRoutes);
app.use('/agendamentos',agendamentoRoutes);
app.use('/dash',DashRoutes);
app.use('/usuario',UsuarioRoutes);


app.get('/', (req, res) => res.send('Servidor do Sistema de Doação de Sangue!'));

// Conectar à base de dados e sincronizar tabelas
sequelize.authenticate()
  .then(() => console.log('Conectado ao PostgreSQL com Sequelize'))
  .catch(err => console.error('Erro ao conectar:', err));

// Sincronização segura: não tenta alterar colunas existentes
sequelize.sync({ force: false }) // <-- aqui
  .then(() => console.log('BD sincronizada com os modelos'))
  .catch(err => console.error('Erro ao sincronizar BD:', err));

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));
