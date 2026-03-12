import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Attrezzo = sequelize.define(
  "Attrezzi",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    anno: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 1900,
      },
    },
    quantita: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 0,
      },
    },
    palestra_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "palestre",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "attrezzi",
    timestamps: true,
  },
);

export default Attrezzo;
