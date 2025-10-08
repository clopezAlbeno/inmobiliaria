import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Contacto = sequelize.define("contacto", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_propiedad: DataTypes.INTEGER,
  nombre: { type: DataTypes.STRING, allowNull: false },
  correo: { type: DataTypes.STRING, allowNull: false },
  telefono: DataTypes.STRING,
  mensaje: { type: DataTypes.TEXT, allowNull: false },
  fecha_envio: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

export default Contacto;
