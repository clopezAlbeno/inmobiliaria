import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "dosPageDb",
  process.env.DB_USER || "favi",
  process.env.DB_PASSWORD || "favi2023@",
  {
    host: process.env.DB_HOST || "146.190.138.108",
    dialect: "mysql",
    logging: false
  }
);

try {
  await sequelize.authenticate();
  console.log("Conexión a MySQL establecida correctamente.");
} catch (error) {
  console.error("No se pudo conectar a MySQL:", error);
}

export default sequelize;
