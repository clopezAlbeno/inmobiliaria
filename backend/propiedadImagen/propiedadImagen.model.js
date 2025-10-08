import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const PropiedadImagen = sequelize.define("propiedad_imagen", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_propiedad: { type: DataTypes.INTEGER, allowNull: false },
  url_imagen: { type: DataTypes.STRING, allowNull: false },
  es_principal: { type: DataTypes.BOOLEAN, defaultValue: false },
  orden: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: "propiedad_imagen", // Asegúrate de que esto esté presente
  timestamps: false
});

export default PropiedadImagen;