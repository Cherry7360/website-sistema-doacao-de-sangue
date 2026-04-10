import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import Doador from "./Doador.js";
import Funcionario from "./Funcionario.js";
import Agendamento from "./Agendamento.js";

const Doacao = sequelize.define('Doacao', {
  id_doacao: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // chave primária
  descricao: DataTypes.TEXT,
  data_doacao: DataTypes.DATEONLY, 
  estado: { type: DataTypes.STRING, defaultValue: "Pendente" },
  id_agendamento: {
  type: DataTypes.INTEGER,
  allowNull: false,
},
  altura_cm: DataTypes.DECIMAL(5, 2),
    peso_kg: DataTypes.DECIMAL(5, 2),
    tensao_arterial: DataTypes.STRING(10),
    volume_ml: DataTypes.INTEGER,
    tipo_doador: { type: DataTypes.STRING(20), defaultValue: "voluntario" },


}, { tableName: 'doacoes', timestamps: false });

// Relacionamentos 
Doador.hasMany(Doacao, { foreignKey: 'id_doador' });
Doacao.belongsTo(Doador, { foreignKey: 'id_doador' });

Funcionario.hasMany(Doacao, { foreignKey: 'id_funcionario' });
Doacao.belongsTo(Funcionario, { foreignKey: 'id_funcionario' });

Doacao.belongsTo(Agendamento, { foreignKey: 'id_agendamento'});

export default Doacao;

/**
 * 
    altura_cm: DataTypes.DECIMAL(5, 2),
    peso_kg: DataTypes.DECIMAL(5, 2),
    tensao_arterial: DataTypes.STRING(10),
    volume_ml: DataTypes.INTEGER,
    tipo_doador: { type: DataTypes.STRING(20), defaultValue: "voluntario" },

 */