
import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import Usuario from "./Usuario.js";

const Funcionario = sequelize.define('Funcionario', {
  id_funcionario: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  codigo_usuario: { type: DataTypes.STRING(16), allowNull: false },
  
}, { tableName: 'funcionarios', timestamps: false });

Funcionario.belongsTo(Usuario, { foreignKey: 'codigo_usuario', targetKey: 'codigo_usuario' });
Usuario.hasOne(Funcionario, { foreignKey: 'codigo_usuario', sourceKey: 'codigo_usuario' });
export default Funcionario;