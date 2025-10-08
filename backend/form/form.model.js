import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Formulario = sequelize.define("formulario", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  correo: { type: DataTypes.STRING, allowNull: false },
  telefono: DataTypes.STRING,
  mensaje: { type: DataTypes.TEXT, allowNull: false },
  fecha_envio: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

export default Formulario;
