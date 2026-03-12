import type { Request, Response } from "express";
import Attrezzo from "../models/AttrezziModels.js";
import Palestra from "../models/PalestraModels.js";

export const getPalestraDati = async (req: Request, res: Response) => {
  const palestraId = Number(req.params.id);

  if (!Number.isInteger(palestraId) || palestraId <= 0) {
    return res.status(400).json({ error: "Id palestra non valido" });
  }

  try {
    const palestra = await Palestra.findByPk(palestraId);

    if (!palestra) {
      return res.status(404).json({ error: "Palestra non trovata" });
    }

    const attrezzi = await Attrezzo.findAll({
      where: { palestra_id: palestraId },
      order: [
        ["nome", "ASC"],
        ["id", "ASC"],
      ],
    });

    return res.status(200).json({
      palestra,
      attrezzi,
    });
  } catch (error) {
    console.error("Errore recupero dati palestra:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};
