import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import Doador from "./Doador.js";
import Funcionario from "./Funcionario.js";

const Doacao = sequelize.define('Doacao', {
  id_doacao: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // chave primária
  descricao: DataTypes.TEXT,
  data_doacao: DataTypes.DATEONLY, 
  estado: { type: DataTypes.STRING, defaultValue: "Pendente" },
}, { tableName: 'doacoes', timestamps: false });

// Relacionamentos 
Doador.hasMany(Doacao, { foreignKey: 'id_doador' });
Doacao.belongsTo(Doador, { foreignKey: 'id_doador' });

Funcionario.hasMany(Doacao, { foreignKey: 'id_funcionario' });
Doacao.belongsTo(Funcionario, { foreignKey: 'id_funcionario' });

export default Doacao;
