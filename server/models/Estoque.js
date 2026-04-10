import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import Funcionario from "./Funcionario.js";
import Doacao from "./Doacao.js";

const Estoque = sequelize.define('Estoque', {
  id_estoque: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tipo_sangue: { type: DataTypes.STRING(5), allowNull: false },
  quantidade_ml: { type: DataTypes.INTEGER, allowNull: false },
  utilidade: { type: DataTypes.STRING(50), allowNull: true },
  observacao: { type: DataTypes.TEXT, allowNull: true },
  data_utilizacao: { type: DataTypes.DATEONLY, allowNull: true },
  movimento: { type: DataTypes.STRING(10), allowNull: true }
 }, { tableName: 'estoque', timestamps: false });

 // Um funcionário pode controlar várias entradas de estoque
Funcionario.hasMany(Estoque, { foreignKey: 'id_funcionario' });
Estoque.belongsTo(Funcionario, { foreignKey: 'id_funcionario' });

// Uma doação adiciona estoque (uma doação pode gerar uma entradas no estoque)
Doacao.hasOne(Estoque, { foreignKey: 'id_doacao' });
Estoque.belongsTo(Doacao, { foreignKey: 'id_doacao'});

 export default Estoque;