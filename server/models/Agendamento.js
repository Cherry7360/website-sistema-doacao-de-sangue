// src/models/Agendamento.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import Funcionario from "./Funcionario.js";
import  Doador  from "./Doador.js";

const Agendamento = sequelize.define('Agendamento', {
   id_agendamento: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  data_agendamento: DataTypes.DATEONLY,
  
  local_doacao: {
  type: DataTypes.STRING,
  allowNull: false,
  defaultValue: "Hospital Dr. Agostinho Neto",
},
  horario: DataTypes.TIME,
  obs: DataTypes.TEXT,
  estado: { type: DataTypes.STRING, defaultValue: 'pendente' }
}, { tableName: 'agendamentos', timestamps: false });

Funcionario.hasMany(Agendamento, { foreignKey: 'id_funcionario' });
Agendamento.belongsTo(Funcionario, { foreignKey: 'id_funcionario' });

Doador.hasMany(Agendamento, { foreignKey: 'id_doador' });
Agendamento.belongsTo(Doador, { foreignKey: 'id_doador' });

export default Agendamento;