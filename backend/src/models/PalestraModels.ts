import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Palestra = sequelize.define(
  "Palestre",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ragione_sociale: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    partita_iva: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    indirizzo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    citta: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "palestre",
    timestamps: true,
  },
);

export default Palestra;
