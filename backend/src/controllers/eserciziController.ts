import type { Request, Response } from "express";
import Esercizio from "../models/EsercizioModels.js";

export const getAllEsercizi = async (_req: Request, res: Response) => {
  try {
    const esercizi = await Esercizio.findAll({
      order: [["id", "ASC"]],
    });

    return res.status(200).json(esercizi);
  } catch (error) {
    console.error("Errore recupero esercizi:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

export const createEsercizio = async (req: Request, res: Response) => {
  try {
    const {
      nome,
      attrezzo,
      allenamentoId,
      ordine,
      numeroSerie,
      ripetizioni,
      riposo,
      volume,
    } = req.body;

    if (
      !nome ||
      !attrezzo ||
      allenamentoId == null ||
      ordine == null ||
      numeroSerie == null ||
      ripetizioni == null ||
      riposo == null ||
      volume == null
    ) {
      return res.status(400).json({
        error:
          "nome, attrezzo, allenamentoId, ordine, numeroSerie, ripetizioni, riposo e volume sono obbligatori",
      });
    }

    const nuovoEsercizio = await Esercizio.create({
      nome,
      attrezzo,
      allenamento_id: allenamentoId,
      ordine,
      numero_serie: numeroSerie,
      ripetizioni,
      riposo,
      volume,
    });

    return res.status(201).json({
      message: "Esercizio creato con successo",
      id: nuovoEsercizio.getDataValue("id"),
    });
  } catch (error: any) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        error: "allenamentoId non valido",
      });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Errore di validazione",
        details: error.errors.map((e: any) => e.message),
      });
    }

    console.error("Errore creazione esercizio:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};
