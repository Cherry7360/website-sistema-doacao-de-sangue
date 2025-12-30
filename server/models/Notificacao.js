// Notificacao.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import Funcionario from "./Funcionario.js";
import Doador from "./Doador.js";

const Notificacao = sequelize.define(
  "Notificacao",
  {
    id_notificacao: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      titulo: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "sem titulo",
  },
    mensagem: DataTypes.TEXT,
    data_envio:  DataTypes.DATEONLY,  
 
    visto: { type: DataTypes.BOOLEAN, defaultValue: false },
      hora_envio: DataTypes.TIME,
     tipo: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "campanha",
  },
  },
  
  { tableName: "notificacoes", timestamps: false }
);

// Relacionamentos
Funcionario.hasMany(Notificacao, { foreignKey: "id_funcionario" });
Notificacao.belongsTo(Funcionario, { foreignKey: "id_funcionario" });

Doador.hasMany(Notificacao, { foreignKey: "id_doador" });
Notificacao.belongsTo(Doador, { foreignKey: "id_doador" });

export default Notificacao;
