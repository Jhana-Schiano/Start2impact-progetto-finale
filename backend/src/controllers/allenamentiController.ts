import type { Request, Response } from "express";
import Allenamento from "../models/AllenamentoModels.js";

export const getAllAllenamenti = async (_req: Request, res: Response) => {
  try {
    const allenamenti = await Allenamento.findAll({
      order: [["id", "ASC"]],
    });

    return res.status(200).json(allenamenti);
  } catch (error) {
    console.error("Errore recupero allenamenti:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

export const createAllenamento = async (req: Request, res: Response) => {
  try {
    const { schedaId, durataStimata, areeCoinvolte, giorno } = req.body;

    if (
      schedaId == null ||
      durataStimata == null ||
      !areeCoinvolte ||
      !giorno
    ) {
      return res.status(400).json({
        error:
          "schedaId, durataStimata, areeCoinvolte e giorno sono obbligatori",
      });
    }

    const nuovoAllenamento = await Allenamento.create({
      scheda_id: schedaId,
      durata_stimata: durataStimata,
      aree_coinvolte: areeCoinvolte,
      giorno,
    });

    return res.status(201).json({
      message: "Allenamento creato con successo",
      id: nuovoAllenamento.getDataValue("id"),
    });
  } catch (error: any) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        error: "schedaId non valido",
      });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Errore di validazione",
        details: error.errors.map((e: any) => e.message),
      });
    }

    console.error("Errore creazione allenamento:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};
