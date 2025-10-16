import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import Usuario from "./Usuario.js";

const Doador = sequelize.define("Doador", {
  id_doador: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  codigo_usuario: { type: DataTypes.STRING(16), allowNull: false },
  tipo_sangue: { type: DataTypes.STRING(3) },
  profissao: { type: DataTypes.STRING(100) },
  data_ultima_doacao: { type: DataTypes.DATE }
}, {
  tableName: "doadores",
  timestamps: false
});

// Relacionamento com Usuario
Doador.belongsTo(Usuario, { foreignKey: "codigo_usuario", targetKey: "codigo_usuario" });
Usuario.hasOne(Doador, { foreignKey: "codigo_usuario", sourceKey: "codigo_usuario" });
export default Doador;
