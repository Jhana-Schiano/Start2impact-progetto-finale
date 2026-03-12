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
      {
        nome: "Marco",
        cognome: "Verdi",
        email: "marco.verdi@example.com",
        data_nascita: "1991-11-03",
        indirizzo: "Via Manzoni 14",
        citta: "Milano",
        telefono: "+393351112244",
        sesso: "M",
        altezza: 182,
        peso: 84.1,
        massaGrassa: 19.1,
        massaMagra: 67.9,
        lavoro: "Commercialista",
        terapie: null,
        condizioniMediche: null,
        note: "Obiettivo: migliorare la postura",
      },
      {
        nome: "Sara",
        cognome: "Neri",
        email: "sara.neri@example.com",
        data_nascita: "1998-06-17",
        indirizzo: "Via Leopardi 8",
        citta: "Sesto San Giovanni",
        telefono: "+393498881122",
        sesso: "F",
        altezza: 168,
        peso: 58.2,
        massaGrassa: 21.6,
        massaMagra: 45.6,
        lavoro: "Graphic designer",
        terapie: "Nessuna",
        condizioniMediche: null,
        note: "Obiettivo: aumentare resistenza",
      },
      {
        nome: "Paolo",
        cognome: "Conti",
        email: "paolo.conti@example.com",
        data_nascita: "1987-02-22",
        indirizzo: "Via Cavour 51",
        citta: "Monza",
        telefono: "+393476661133",
        sesso: "M",
        altezza: 176,
        peso: 88.7,
        massaGrassa: 24.3,
        massaMagra: 67.1,
        lavoro: "Impiegato",
        terapie: "Nessuna",
        condizioniMediche: "Dolore cervicale saltuario",
        note: "Obiettivo: dimagrimento graduale",
      },
      {
        nome: "Elena",
        cognome: "Greco",
        email: "elena.greco@example.com",
        data_nascita: "1994-09-05",
        indirizzo: "Via Garibaldi 72",
        citta: "Cinisello Balsamo",
        telefono: "+393401019283",
        sesso: "F",
        altezza: 162,
        peso: 64.9,
        massaGrassa: 25.1,
        massaMagra: 48.6,
        lavoro: "Farmacista",
        terapie: null,
        condizioniMediche: null,
        note: "Obiettivo: tonificazione arti inferiori",
      },
      {
        nome: "Davide",
        cognome: "Fontana",
        email: "davide.fontana@example.com",
        data_nascita: "1990-12-14",
        indirizzo: "Viale Lombardia 19",
        citta: "Milano",
        telefono: "+393339874561",
        sesso: "M",
        altezza: 180,
        peso: 81.3,
        massaGrassa: 18.5,
        massaMagra: 66.2,
        lavoro: "Architetto",
        terapie: null,
        condizioniMediche: "Pregressa distorsione caviglia",
        note: "Obiettivo: recupero mobilita e forza",
      },
      {
        nome: "Chiara",
        cognome: "Riva",
        email: "chiara.riva@example.com",
        data_nascita: "1999-04-10",
        indirizzo: "Via Pisacane 6",
        citta: "Bresso",
        telefono: "+393490001122",
        sesso: "F",
        altezza: 170,
        peso: 60.4,
        massaGrassa: 20.7,
        massaMagra: 47.9,
        lavoro: "Studentessa",
        terapie: "Nessuna",
        condizioniMediche: null,
        note: "Obiettivo: preparazione test fisici",
      },
      {
        nome: "Andrea",
        cognome: "Costa",
        email: "andrea.costa@example.com",
        data_nascita: "1985-07-29",
        indirizzo: "Via Monti 43",
        citta: "Milano",
        telefono: "+393329991188",
        sesso: "M",
        altezza: 174,
        peso: 90.2,
        massaGrassa: 27.4,
        massaMagra: 65.5,
        lavoro: "Autista",
        terapie: "Nessuna",
        condizioniMediche: "Ipertensione lieve monitorata",
        note: "Obiettivo: riduzione massa grassa",
      },
      {
        nome: "Martina",
        cognome: "Ferri",
        email: "martina.ferri@example.com",
        data_nascita: "1992-03-12",
        indirizzo: "Piazza Repubblica 4",
        citta: "Monza",
        telefono: "+393467770012",
        sesso: "F",
        altezza: 166,
        peso: 57.8,
        massaGrassa: 19.8,
        massaMagra: 46.3,
        lavoro: "Consulente HR",
        terapie: null,
        condizioniMediche: null,
        note: "Obiettivo: mantenimento e mobilita",
      },
      {
        nome: "Simone",
        cognome: "Colombo",
        email: "simone.colombo@example.com",
        data_nascita: "1997-10-01",
        indirizzo: "Via Solferino 25",
        citta: "Sesto San Giovanni",
        telefono: "+393388880045",
        sesso: "M",
        altezza: 186,
        peso: 92.4,
        massaGrassa: 22.3,
        massaMagra: 71.8,
        lavoro: "Tecnico informatico",
        terapie: "Nessuna",
        condizioniMediche: null,
        note: "Obiettivo: incremento massa muscolare",
      },
      {
        nome: "Federica",
        cognome: "Gallo",
        email: "federica.gallo@example.com",
        data_nascita: "1989-05-26",
        indirizzo: "Via Carducci 31",
        citta: "Milano",
        telefono: "+393377654390",
        sesso: "F",
        altezza: 160,
        peso: 63.5,
        massaGrassa: 26.8,
        massaMagra: 46.5,
        lavoro: "Infermiera",
        terapie: null,
        condizioniMediche: "Lieve scoliosi",
        note: "Obiettivo: rinforzo core e schiena",
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
