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
      numeroSerie,
      ripetizioni,
      riposo,
      volume,
    } = req.body;

    if (
      !nome ||
      allenamentoId == null ||
      numeroSerie == null ||
      ripetizioni == null ||
      riposo == null
    ) {
      return res.status(400).json({
        error:
          "nome, allenamentoId, numeroSerie, ripetizioni e riposo sono obbligatori",
      });
    }

    const rawAttrezzo = attrezzo == null ? "" : String(attrezzo).trim();
    const normalizedAttrezzo = rawAttrezzo === "" ? null : rawAttrezzo;

    const normalizedVolume =
      volume == null || volume === "" ? null : Number(volume);

    if (
      normalizedVolume != null &&
      (!Number.isFinite(normalizedVolume) || normalizedVolume <= 0)
    ) {
      return res.status(400).json({
        error: "volume deve essere maggiore di zero quando valorizzato",
      });
    }

    const nuovoEsercizio = await Esercizio.create({
      nome,
      attrezzo: normalizedAttrezzo,
      allenamento_id: allenamentoId,
      numero_serie: numeroSerie,
      ripetizioni,
      riposo,
      volume: normalizedVolume,
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

export const deleteEsercizio = async (req: Request, res: Response) => {
  const esercizioId = Number(req.params.id);

  if (!Number.isInteger(esercizioId) || esercizioId <= 0) {
    return res.status(400).json({ error: "Id esercizio non valido" });
  }

  try {
    const deletedRows = await Esercizio.destroy({
      where: { id: esercizioId },
    });

    if (deletedRows === 0) {
      return res.status(404).json({ error: "Esercizio non trovato" });
    }

    return res
      .status(200)
      .json({ message: "Esercizio eliminato con successo" });
  } catch (error) {
    console.error("Errore eliminazione esercizio:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};
