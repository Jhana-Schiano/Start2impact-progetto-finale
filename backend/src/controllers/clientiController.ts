import type { Request, Response } from "express";
import Cliente from "../models/ClienteModels.js";
import { isEmailValid, isPhoneValid } from "../services/validationService.js";

export const createCliente = async (req: Request, res: Response) => {
  try {
    const {
      nome,
      cognome,
      dataNascita,
      indirizzo,
      citta,
      telefono,
      email,
      sesso,
      altezza,
      peso,
      massaGrassa,
      massaMagra,
      lavoro,
      terapie,
      condizioniMediche,
      note,
    } = req.body;

    // Validazione dati obbligatori
    if (
      !nome ||
      !cognome ||
      !email ||
      !dataNascita ||
      !sesso ||
      altezza == null ||
      peso == null
    ) {
      return res.status(400).json({
        error:
          "Nome, cognome, email, dataNascita, sesso, altezza e peso sono obbligatori",
      });
    }

    if (!isEmailValid(email)) {
      return res.status(400).json({
        error: "Formato email non valido",
      });
    }

    if (!["M", "F", "Altro"].includes(sesso)) {
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
    const nuovoUtente = await Cliente.create({
      nome,
      cognome,
      email,
      telefono,
      data_nascita: dataNascita,
      sesso,
      indirizzo,
      citta,
      altezza,
      peso,
      massaGrassa,
      massaMagra,
      lavoro,
      terapie,
      condizioniMediche,
      note,
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

export const aggiornaCliente = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        error: "Id cliente non valido",
      });
    }

    const {
      indirizzo,
      citta,
      telefono,
      email,
      sesso,
      altezza,
      peso,
      massaGrassa,
      massaMagra,
      lavoro,
      terapie,
      condizioniMediche,
      note,
    } = req.body;

    if (
      indirizzo == null &&
      citta == null &&
      telefono == null &&
      email == null &&
      sesso == null &&
      altezza == null &&
      peso == null &&
      massaGrassa == null &&
      massaMagra == null &&
      lavoro == null &&
      terapie == null &&
      condizioniMediche == null &&
      note == null
    ) {
      return res.status(400).json({
        error: "Devi fornire almeno un campo da aggiornare",
      });
    }

    if (email != null) {
      if (!isEmailValid(email)) {
        return res.status(400).json({
          error: "Formato email non valido",
        });
      }
    }

    if (telefono != null) {
      if (!isPhoneValid(telefono)) {
        return res.status(400).json({
          error: "Formato telefono non valido",
        });
      }
    }

    if (sesso != null && !["M", "F", "Altro"].includes(sesso)) {
      return res.status(400).json({
        error: "Il campo sesso deve essere M, F o Altro",
      });
    }

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        error: "Cliente non trovato",
      });
    }

    const datiDaAggiornare: Record<string, unknown> = {};

    if (indirizzo != null) datiDaAggiornare.indirizzo = indirizzo;
    if (citta != null) datiDaAggiornare.citta = citta;
    if (telefono != null) datiDaAggiornare.telefono = telefono;
    if (email != null) datiDaAggiornare.email = email;
    if (sesso != null) datiDaAggiornare.sesso = sesso;
    if (altezza != null) datiDaAggiornare.altezza = altezza;
    if (peso != null) datiDaAggiornare.peso = peso;
    if (massaGrassa != null) datiDaAggiornare.massaGrassa = massaGrassa;
    if (massaMagra != null) datiDaAggiornare.massaMagra = massaMagra;
    if (lavoro != null) datiDaAggiornare.lavoro = lavoro;
    if (terapie != null) datiDaAggiornare.terapie = terapie;
    if (condizioniMediche != null) {
      datiDaAggiornare.condizioniMediche = condizioniMediche;
    }
    if (note != null) datiDaAggiornare.note = note;

    await cliente.update(datiDaAggiornare);

    return res.status(200).json({
      message: "Cliente aggiornato con successo",
    });
  } catch (error: any) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ error: "Email già registrata" });
    }

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Errore di validazione",
        details: error.errors.map((e: any) => e.message),
      });
    }

    console.error("Errore aggiornamento cliente:", error);
    return res.status(500).json({ error: "Errore interno del server" });
  }
};
