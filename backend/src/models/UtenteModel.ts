import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

const Utente = sequelize.define(
  "Utenti",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cognome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    data_nascita: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sesso: {
      type: DataTypes.ENUM("M", "F", "Altro"),
      allowNull: true,
    },
  },
  {
    tableName: "utenti",
    timestamps: true,
  },
);

export default Utente;
