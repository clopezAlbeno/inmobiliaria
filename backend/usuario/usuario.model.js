import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Usuario = sequelize.define("usuario", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  apellido: DataTypes.STRING,
  correo: { type: DataTypes.STRING, unique: true, allowNull: false },
  telefono: DataTypes.STRING,
  contrasena: { type: DataTypes.STRING, allowNull: false },
  rol: { 
  type: DataTypes.ENUM("admin", "asesor"), 
  defaultValue: "asesor" 
    },
  fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "usuario", // Explicitly set the table name to match the existing table
  timestamps: false // Optional: disable createdAt/updatedAt if not needed
});

export default Usuario;