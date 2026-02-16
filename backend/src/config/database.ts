import "dotenv/config";
import { createConnection } from "mysql2/promise";
import { Sequelize } from "sequelize";

const databaseHost = process.env.DB_HOST ?? "localhost";
const databasePort = Number(process.env.DB_PORT ?? 3306);
const databaseName = process.env.DB_NAME ?? "js-gym-db";
const databaseUser = process.env.DB_USER ?? "root";
const databasePassword = process.env.DB_PASSWORD ?? "root";

const databaseLogging = (process.env.DB_LOGGING ?? "false") === "true";

export const ensureDatabaseExists = async (): Promise<void> => {
  const connection = await createConnection({
    host: databaseHost,
    port: databasePort,
    user: databaseUser,
    password: databasePassword,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await connection.end();
};

const sequelize = new Sequelize(databaseName, databaseUser, databasePassword, {
  host: databaseHost,
  port: databasePort,
  dialect: "mysql",
  logging: databaseLogging,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;
