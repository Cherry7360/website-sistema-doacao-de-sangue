// models/Usuario.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

 const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo_usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  palavra_passe: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nome: DataTypes.STRING,
  morada: DataTypes.STRING,
  cni: DataTypes.STRING,
  email: DataTypes.STRING,
  telefone: DataTypes.STRING,
  tipo_usuario: DataTypes.STRING,
  foto: DataTypes.STRING
}, {
  tableName: 'usuarios',
  timestamps: false
});
export default Usuario; 
