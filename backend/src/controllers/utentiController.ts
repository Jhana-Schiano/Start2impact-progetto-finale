import type { Request, Response } from "express";
import Utente from "../models/UtenteModel.js";
import { isEmailValid, isPhoneValid } from "../services/validationService.js";

export const getUtenteById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "Id utente non valido",
      });
    }

    const utente = await Utente.findByPk(id);

    if (!utente) {
      return res.status(404).json({
        error: "Utente non trovato",
      });
    }

    return res.status(200).json(utente);
  } catch (error) {
    console.error("Errore recupero utente:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

export const createUtente = async (req: Request, res: Response) => {
  try {
    const { nome, cognome, email, telefono, data_nascita, sesso } = req.body;

    // Validazione dati obbligatori
    if (!nome || !cognome || !email) {
      return res.status(400).json({
        error: "Nome, cognome ed email sono obbligatori",
      });
    }

    if (!isEmailValid(email)) {
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

    if (telefono != null && !isPhoneValid(telefono)) {
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
      id: nuovoUtente.getDataValue("id"),
    });
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError")
      return res.status(409).json({ error: "Email già registrata" });

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Errore di validazione",
        details: error.errors.map((e: any) => e.message),
      });
    }

    console.error("Errore creazione utente:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};

export const modificaContatti = async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    const { email, telefono } = req.body;

    const id = Number(idParam);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "Id utente non valido",
      });
    }

    if (email == null && telefono == null) {
      return res.status(400).json({
        error: "Devi fornire almeno email o telefono",
      });
    }

    const datiDaAggiornare: { email?: string; telefono?: string } = {};

    if (email != null) {
      if (!isEmailValid(email)) {
        return res.status(400).json({
          error: "Formato email non valido",
        });
      }

      datiDaAggiornare.email = email;
    }

    if (telefono != null) {
      if (!isPhoneValid(telefono)) {
        return res.status(400).json({
          error: "Formato telefono non valido",
        });
      }

      datiDaAggiornare.telefono = telefono;
    }

    const utente = await Utente.findByPk(id);

    if (!utente) {
      return res.status(404).json({
        error: "Utente non trovato",
      });
    }

    await utente.update(datiDaAggiornare);

    return res.status(200).json({
      message: "Contatti aggiornati con successo",
    });
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError")
      return res.status(409).json({ error: "Email già registrata" });

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Errore di validazione",
        details: error.errors.map((e: any) => e.message),
      });
    }

    console.error("Errore modifica contatti:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};
