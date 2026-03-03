import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Scheda = sequelize.define(
  "Schede",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titolo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    data_inizio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    data_fine: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    personal_trainer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "utenti",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    obiettivo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "clienti",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
  },
  {
    tableName: "schede",
    timestamps: true,
  },
);

export default Scheda;
