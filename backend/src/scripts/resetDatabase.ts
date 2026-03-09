import sequelize, { ensureDatabaseExists } from "../config/database.js";

// Import models so Sequelize registers every table before sync.
import "../models/AllenamentoModels.js";
import "../models/ClienteModels.js";
import "../models/EsercizioModels.js";
import "../models/SchedaModels.js";
import "../models/SerieModels.js";
import "../models/UtenteModel.js";

const resetDatabase = async () => {
  try {
    const nodeEnv = process.env.NODE_ENV ?? "development";

    if (nodeEnv === "production") {
      throw new Error("db:reset bloccato in produzione");
    }

    await ensureDatabaseExists();
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    console.log("Database resettato: tabelle ricreate dai model.");
    process.exit(0);
  } catch (error) {
    console.error("Errore durante il reset DB:", error);
    process.exit(1);
  }
};

resetDatabase();
