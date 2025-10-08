import sequelize from "./config/db.js";
import Usuario from "./usuario/usuario.model.js";
import Propiedad from "./propiedad/propiedad.model.js";
import PropiedadImagen from "./propiedadImagen/propiedadImagen.model.js";
import Formulario from "./form/form.model.js";
import Contacto from "./contacto/contacto.model.js";

// Relaciones

// Relaciones - Usar los mismos alias
Usuario.hasMany(Propiedad, { 
  foreignKey: "id_usuario", 
  as: "propiedades" 
});

Propiedad.belongsTo(Usuario, { 
  foreignKey: "id_usuario", 
  as: "usuario"  // Mismo alias que en propiedad.model.js
});

Propiedad.hasMany(PropiedadImagen, { 
  foreignKey: "id_propiedad", 
  as: "imagenes",
  onDelete: "CASCADE" 
});

PropiedadImagen.belongsTo(Propiedad, { 
  foreignKey: "id_propiedad" 
});

Usuario.hasMany(Propiedad, { foreignKey: "id_usuario", as: "propiedades" });
Propiedad.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" }); // Usar 'usuario' como alias

Propiedad.hasMany(PropiedadImagen, { foreignKey: "id_propiedad", onDelete: "CASCADE" });
PropiedadImagen.belongsTo(Propiedad, { foreignKey: "id_propiedad" });

Propiedad.hasMany(Contacto, { foreignKey: "id_propiedad", onDelete: "CASCADE" });
Contacto.belongsTo(Propiedad, { foreignKey: "id_propiedad" });

export { sequelize, Usuario, Propiedad, PropiedadImagen, Formulario, Contacto };
