import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Serie = sequelize.define(
  "Serie",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    esercizio_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "esercizi",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    riposo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ripetizioni: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cedimento: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    volume: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    durata: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "serie",
    timestamps: true,
  },
);

export default Serie;
