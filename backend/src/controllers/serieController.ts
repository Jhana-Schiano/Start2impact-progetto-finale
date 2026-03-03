import type { Request, Response } from "express";
import Serie from "../models/SerieModels.js";

export const getAllSerie = async (_req: Request, res: Response) => {
  try {
    const serie = await Serie.findAll({
      order: [["id", "ASC"]],
    });

    return res.status(200).json(serie);
  } catch (error) {
    console.error("Errore recupero serie:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

export const createSerie = async (req: Request, res: Response) => {
  try {
    const { esercizioId, riposo, ripetizioni, cedimento, volume, durata } =
      req.body;

    if (
      esercizioId == null ||
      riposo == null ||
      ripetizioni == null ||
      cedimento == null
    ) {
      return res.status(400).json({
        error: "esercizioId, riposo, ripetizioni e cedimento sono obbligatori",
      });
    }

    const nuovaSerie = await Serie.create({
      esercizio_id: esercizioId,
      riposo,
      ripetizioni,
      cedimento,
      volume,
      durata,
    });

    return res.status(201).json({
      message: "Serie creata con successo",
      id: nuovaSerie.getDataValue("id"),
    });
  } catch (error: any) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        error: "esercizioId non valido",
      });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Errore di validazione",
        details: error.errors.map((e: any) => e.message),
      });
    }

    console.error("Errore creazione serie:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};
