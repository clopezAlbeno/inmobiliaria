import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import PropiedadImagen from "../propiedadImagen/propiedadImagen.model.js";
import Usuario from "../usuario/usuario.model.js";

const Propiedad = sequelize.define("propiedad", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_usuario: { type: DataTypes.INTEGER, allowNull: true },
  titulo: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  precio: { type: DataTypes.DECIMAL(15,2), allowNull: false },
  tipo_operacion: { type: DataTypes.ENUM("venta", "alquiler", "ambos"), defaultValue: "venta" },
  tipo_propiedad: { type: DataTypes.ENUM("Casa", "Departamento", "Condominio", "Terreno", "Otro"), allowNull: false, defaultValue: "Casa" },
  habitaciones: { type: DataTypes.INTEGER },
  banos: { type: DataTypes.INTEGER },
  estacionamientos: { type: DataTypes.INTEGER },
  metros: { type: DataTypes.DECIMAL(10,2) },
  direccion: { type: DataTypes.STRING },
  ciudad: { type: DataTypes.STRING },
  departamento: { type: DataTypes.STRING },
  pais: { type: DataTypes.STRING },
  latitud: { type: DataTypes.DECIMAL(10,7) },
  longitud: { type: DataTypes.DECIMAL(10,7) },
  destacado: { type: DataTypes.BOOLEAN, defaultValue: false },
  fecha_publicacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: "propiedad",
  timestamps: false
});

// Relaciones
Propiedad.hasMany(PropiedadImagen, { 
  foreignKey: "id_propiedad", 
  as: "imagenes" 
});

Propiedad.belongsTo(Usuario, { 
  foreignKey: "id_usuario", 
  as: "usuario" 
});

export default Propiedad;