import { hash } from "bcryptjs";
import sequelize, { ensureDatabaseExists } from "../config/database.js";

// Import models so Sequelize registers every table before sync.
import Allenamento from "../models/AllenamentoModels.js";
import Attrezzo from "../models/AttrezziModels.js";
import Cliente from "../models/ClienteModels.js";
import Esercizio from "../models/EsercizioModels.js";
import Palestra from "../models/PalestraModels.js";
import Scheda from "../models/SchedaModels.js";
import Utente from "../models/UtenteModel.js";

const DEFAULT_SEED_PASSWORD = "Password123!";

const getRecordId = (record: {
  getDataValue: (key: string) => unknown;
}): number => {
  return Number(record.getDataValue("id"));
};

const seedDatabase = async (): Promise<void> => {
  await ensureDatabaseExists();
  await sequelize.authenticate();
  await sequelize.sync();

  const transaction = await sequelize.transaction();

  try {
    const seedPassword =
      process.env.SEED_USER_PASSWORD ?? DEFAULT_SEED_PASSWORD;
    const passwordHash = await hash(seedPassword, 10);

    const [palestra] = await Palestra.findOrCreate({
      where: { partita_iva: "12345678901" },
      defaults: {
        ragione_sociale: "JS Gym",
        partita_iva: "12345678901",
        indirizzo: "Via Roma 10",
        citta: "Milano",
      },
      transaction,
    });
    const palestraId = getRecordId(palestra);

    const [utenteTrainer] = await Utente.findOrCreate({
      where: { email: "pt.demo@jsgym.it" },
      defaults: {
        nome: "Mario",
        cognome: "Trainer",
        email: "pt.demo@jsgym.it",
        password_hash: passwordHash,
        telefono: "+393331112233",
        dataNascita: new Date("1990-04-12"),
        sesso: "M",
      },
      transaction,
    });

    const utenteId = getRecordId(utenteTrainer);

    const clientiToSeed = [
      {
        nome: "Luca",
        cognome: "Rossi",
        email: "luca.rossi@example.com",
        data_nascita: "1996-01-20",
        indirizzo: "Via Dante 30",
        citta: "Milano",
        telefono: "+393401234567",
        sesso: "M",
        altezza: 178,
        peso: 79.5,
        massaGrassa: 17.2,
        massaMagra: 65.8,
        lavoro: "Sviluppatore",
        terapie: null,
        condizioniMediche: "Lieve lombalgia episodica",
        note: "Obiettivo: ricomposizione corporea",
      },
      {
        nome: "Giulia",
        cognome: "Bianchi",
        email: "giulia.bianchi@example.com",
        data_nascita: "1993-08-09",
        indirizzo: "Corso Torino 12",
        citta: "Monza",
        telefono: "+393409876543",
        sesso: "F",
        altezza: 165,
        peso: 62.3,
        massaGrassa: 23.4,
        massaMagra: 47.7,
        lavoro: "Insegnante",
        terapie: "Nessuna",
        condizioniMediche: null,
        note: "Obiettivo: tonificazione",
      },
    ] as const;

    const clientiIdsByEmail = new Map<string, number>();

    for (const clienteData of clientiToSeed) {
      const [cliente] = await Cliente.findOrCreate({
        where: { email: clienteData.email },
        defaults: clienteData,
        transaction,
      });

      clientiIdsByEmail.set(clienteData.email, getRecordId(cliente));
    }

    const attrezziCount = await Attrezzo.count({
      where: { palestra_id: palestraId },
      transaction,
    });

    if (attrezziCount === 0) {
      await Attrezzo.bulkCreate(
        [
          {
            nome: "Tapis Roulant",
            anno: 2022,
            quantita: 6,
            palestra_id: palestraId,
          },
          {
            nome: "Panca piana",
            anno: 2021,
            quantita: 4,
            palestra_id: palestraId,
          },
          {
            nome: "Lat machine",
            anno: 2020,
            quantita: 3,
            palestra_id: palestraId,
          },
          {
            nome: "Manubri regolabili",
            anno: 2023,
            quantita: 12,
            palestra_id: palestraId,
          },
          {
            nome: "Leg press",
            anno: 2021,
            quantita: 2,
            palestra_id: palestraId,
          },
          {
            nome: "Cable crossover",
            anno: 2022,
            quantita: 1,
            palestra_id: palestraId,
          },
        ],
        { transaction },
      );
    }

    const clienteLucaId = clientiIdsByEmail.get("luca.rossi@example.com");
    const clienteGiuliaId = clientiIdsByEmail.get("giulia.bianchi@example.com");

    if (!clienteLucaId || !clienteGiuliaId) {
      throw new Error("Impossibile risolvere gli id dei clienti seed.");
    }

    const [schedaLuca] = await Scheda.findOrCreate({
      where: {
        cliente_id: clienteLucaId,
        personal_trainer_id: utenteId,
        data_inizio: "2026-03-01",
      },
      defaults: {
        data_inizio: "2026-03-01",
        data_fine: "2026-05-31",
        personal_trainer_id: utenteId,
        obiettivo: "Forza e ricomposizione",
        cliente_id: clienteLucaId,
      },
      transaction,
    });

    const [schedaGiulia] = await Scheda.findOrCreate({
      where: {
        cliente_id: clienteGiuliaId,
        personal_trainer_id: utenteId,
        data_inizio: "2026-03-01",
      },
      defaults: {
        data_inizio: "2026-03-01",
        data_fine: "2026-05-31",
        personal_trainer_id: utenteId,
        obiettivo: "Tonificazione generale",
        cliente_id: clienteGiuliaId,
      },
      transaction,
    });

    const ensureAllenamento = async (args: {
      schedaId: number;
      durataStimata: number;
      areeCoinvolte: string;
      giorno:
        | "Lunedi"
        | "Martedi"
        | "Mercoledi"
        | "Giovedi"
        | "Venerdi"
        | "Sabato"
        | "Domenica";
    }) => {
      const existing = await Allenamento.findOne({
        where: {
          scheda_id: args.schedaId,
          giorno: args.giorno,
        },
        transaction,
      });

      if (existing) {
        return existing;
      }

      return Allenamento.create(
        {
          scheda_id: args.schedaId,
          durata_stimata: args.durataStimata,
          aree_coinvolte: args.areeCoinvolte,
          giorno: args.giorno,
        },
        { transaction },
      );
    };

    const allenamentoLucaA = await ensureAllenamento({
      schedaId: getRecordId(schedaLuca),
      durataStimata: 60,
      areeCoinvolte: "Petto, Tricipiti",
      giorno: "Lunedi",
    });

    const allenamentoLucaB = await ensureAllenamento({
      schedaId: getRecordId(schedaLuca),
      durataStimata: 70,
      areeCoinvolte: "Schiena, Bicipiti",
      giorno: "Giovedi",
    });

    const allenamentoGiuliaA = await ensureAllenamento({
      schedaId: getRecordId(schedaGiulia),
      durataStimata: 55,
      areeCoinvolte: "Total body",
      giorno: "Martedi",
    });

    const maybeSeedEsercizi = async (
      allenamentoId: number,
      esercizi: Array<{
        nome: string;
        attrezzo: string | null;
        numero_serie: number;
        ripetizioni: number;
        riposo: number;
        volume: number | null;
      }>,
    ) => {
      const eserciziCount = await Esercizio.count({
        where: { allenamento_id: allenamentoId },
        transaction,
      });

      if (eserciziCount > 0) {
        return;
      }

      await Esercizio.bulkCreate(
        esercizi.map((esercizio) => ({
          ...esercizio,
          allenamento_id: allenamentoId,
        })),
        { transaction },
      );
    };

    await maybeSeedEsercizi(getRecordId(allenamentoLucaA), [
      {
        nome: "Panca piana bilanciere",
        attrezzo: "Panca piana",
        numero_serie: 4,
        ripetizioni: 8,
        riposo: 120,
        volume: 32,
      },
      {
        nome: "Croci con manubri",
        attrezzo: "Manubri regolabili",
        numero_serie: 3,
        ripetizioni: 12,
        riposo: 75,
        volume: 36,
      },
    ]);

    await maybeSeedEsercizi(getRecordId(allenamentoLucaB), [
      {
        nome: "Lat machine presa larga",
        attrezzo: "Lat machine",
        numero_serie: 4,
        ripetizioni: 10,
        riposo: 90,
        volume: 40,
      },
      {
        nome: "Curl manubri alternato",
        attrezzo: "Manubri regolabili",
        numero_serie: 3,
        ripetizioni: 12,
        riposo: 60,
        volume: 36,
      },
    ]);

    await maybeSeedEsercizi(getRecordId(allenamentoGiuliaA), [
      {
        nome: "Squat goblet",
        attrezzo: "Manubri regolabili",
        numero_serie: 4,
        ripetizioni: 10,
        riposo: 90,
        volume: 40,
      },
      {
        nome: "Tapis roulant camminata veloce",
        attrezzo: "Tapis Roulant",
        numero_serie: 1,
        ripetizioni: 20,
        riposo: 0,
        volume: null,
      },
    ]);

    await transaction.commit();

    console.log("Seeding completato con successo.");
    console.log("Utente demo:", "pt.demo@jsgym.it");
    console.log("Password demo:", seedPassword);
  } catch (error) {
    await transaction.rollback();
    throw error;
  } finally {
    await sequelize.close();
  }
};

seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Errore durante il seeding DB:", error);
    process.exit(1);
  });
