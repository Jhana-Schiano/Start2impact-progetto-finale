import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Esercizio = sequelize.define(
  "Esercizi",
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
    attrezzo: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    allenamento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "allenamenti",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    numero_serie: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ripetizioni: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    riposo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    volume: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "esercizi",
    timestamps: true,
  },
);

export default Esercizio;
