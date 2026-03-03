import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Allenamento = sequelize.define(
  "Allenamenti",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    scheda_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "schede",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    durata_stimata: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    aree_coinvolte: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    giorno: {
      type: DataTypes.ENUM(
        "Lunedi",
        "Martedi",
        "Mercoledi",
        "Giovedi",
        "Venerdi",
        "Sabato",
        "Domenica",
      ),
      allowNull: false,
    },
  },
  {
    tableName: "allenamenti",
    timestamps: true,
  },
);

export default Allenamento;
