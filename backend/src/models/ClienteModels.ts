import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Cliente = sequelize.define(
  "Clienti",
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
    data_nascita: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    indirizzo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    citta: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    sesso: {
      type: DataTypes.ENUM("M", "F", "Altro"),
      allowNull: false,
    },
    altezza: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    peso: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    massaGrassa: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    massaMagra: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    lavoro: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    terapie: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    condizioniMediche: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "clienti",
    timestamps: true,
  },
);

export default Cliente;
