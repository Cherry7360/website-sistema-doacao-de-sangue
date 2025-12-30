
import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import  Funcionario  from "./Funcionario.js";

const Campanha = sequelize.define('Campanha', {
    id_campanha: {type: DataTypes.INTEGER,
    autoIncrement: true, primaryKey: true,},
  descricao: DataTypes.TEXT,
  data_campanha: DataTypes.DATEONLY,
  horario: DataTypes.TIME,
  foto: DataTypes.STRING,
  local: { type: DataTypes.STRING }, 
  estado: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'campanhas', timestamps: false });


// Relacionamentos 
Funcionario.hasMany(Campanha, { foreignKey: 'id_funcionario' });
Campanha.belongsTo(Funcionario, { foreignKey: 'id_funcionario' });

export default Campanha;