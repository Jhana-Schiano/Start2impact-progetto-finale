import { createConnection } from "mysql2/promise";
import sequelize from "../config/database.js";

// Import models so Sequelize registers every table before sync.
import "../models/AllenamentoModels.js";
import "../models/AttrezziModels.js";
import "../models/ClienteModels.js";
import "../models/EsercizioModels.js";
import "../models/PalestraModels.js";
import "../models/SchedaModels.js";
import "../models/UtenteModel.js";

const databaseHost = process.env.DB_HOST ?? "localhost";
const databasePort = Number(process.env.DB_PORT ?? 3306);
const databaseName = process.env.DB_NAME ?? "js-gym-db";
const databaseUser = process.env.DB_USER ?? "root";
const databasePassword = process.env.DB_PASSWORD ?? "root";

const recreateDatabase = async (): Promise<void> => {
  const connection = await createConnection({
    host: databaseHost,
    port: databasePort,
    user: databaseUser,
    password: databasePassword,
  });

  const escapedDbName = databaseName.replace(/`/g, "``");

  await connection.query(`DROP DATABASE IF EXISTS \`${escapedDbName}\``);
  await connection.query(
    `CREATE DATABASE \`${escapedDbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );

  await connection.end();
};

const resetDatabase = async () => {
  try {
    const nodeEnv = process.env.NODE_ENV ?? "development";

    if (nodeEnv === "production") {
      throw new Error("db:reset bloccato in produzione");
    }

    await recreateDatabase();
    await sequelize.authenticate();
    await sequelize.sync();

    console.log("Database eliminato e ricreato: tabelle generate dai model.");
    process.exit(0);
  } catch (error) {
    console.error("Errore durante il reset DB:", error);
    process.exit(1);
  }
};

resetDatabase();
