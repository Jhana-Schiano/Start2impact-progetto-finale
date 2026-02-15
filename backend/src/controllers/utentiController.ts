import type { Request, Response } from "express";
import Utente from "../models/UtenteModel.js";

export const createUtente = async (req: Request, res: Response) => {
  try {
    const { nome, cognome, email, telefono, data_nascita, sesso } = req.body;

    // Validazione dati obbligatori
    if (!nome || !cognome || !email) {
      return res.status(400).json({
        error: "Nome, cognome ed email sono obbligatori",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Formato email non valido",
      });
    }

    // Validazione dati facoltativi
    if (sesso && !["M", "F", "Altro"].includes(sesso)) {
      return res.status(400).json({
        error: "Il campo sesso deve essere M, F o Altro",
      });
    }

    if (telefono && !/^[0-9\s\-+()]+$/.test(telefono)) {
      return res.status(400).json({
        error: "Formato telefono non valido",
      });
    }

    // Creazione utente nel database
    const nuovoUtente = await Utente.create({
      nome,
      cognome,
      email,
      telefono,
      data_nascita,
      sesso,
    });

    // Risposta con ID utente creato
    return res.status(201).json({
      message: "Utente creato con successo",
      id: nuovoUtente.id,
    });
  }
  catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError")
        return res.status(409).json({error: "Email già registrata"});
        
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Errore di validazione",
        details: error.errors.map((e: any) => e.message),
      });
      }
      
    console.error("Errore creazione utente:", error);
    return res.status(500).json({error: "Errore interno del server"});
  }
};
