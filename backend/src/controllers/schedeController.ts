import type { Request, Response } from "express";
import Scheda from "../models/SchedaModels.js";

export const getAllSchede = async (_req: Request, res: Response) => {
  try {
    const schede = await Scheda.findAll({
      order: [["id", "ASC"]],
    });

    return res.status(200).json(schede);
  } catch (error) {
    console.error("Errore recupero schede:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

export const createScheda = async (req: Request, res: Response) => {
  try {
    const {
      titolo,
      dataInizio,
      dataFine,
      personalTrainerId,
      obiettivo,
      clienteId,
    } = req.body;

    if (
      !titolo ||
      !dataInizio ||
      !dataFine ||
      personalTrainerId == null ||
      !obiettivo ||
      clienteId == null
    ) {
      return res.status(400).json({
        error:
          "titolo, dataInizio, dataFine, personalTrainerId, obiettivo e clienteId sono obbligatori",
      });
    }

    const nuovaScheda = await Scheda.create({
      titolo,
      data_inizio: dataInizio,
      data_fine: dataFine,
      personal_trainer_id: personalTrainerId,
      obiettivo,
      cliente_id: clienteId,
    });

    return res.status(201).json({
      message: "Scheda creata con successo",
      id: nuovaScheda.getDataValue("id"),
    });
  } catch (error: any) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        error: "clienteId o personalTrainerId non validi",
      });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Errore di validazione",
        details: error.errors.map((e: any) => e.message),
      });
    }

    console.error("Errore creazione scheda:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};
