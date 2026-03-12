# Start2impact-progetto-finale

Guida rapida per avviare l'applicazione in locale.

## Prerequisiti

- Node.js 20+ (consigliato)
- MySQL attivo in locale (default: `localhost:3306`)

## 1) Installazione dipendenze

Da root progetto:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## 2) Configurazione backend

Il file `backend/.env` e gia presente con valori di default:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=js-gym-db
DB_USER=root
DB_PASSWORD=root
DB_LOGGING=false
```

Se necessario, modifica questi valori in base al tuo ambiente MySQL.

## 3) Avvio applicazione

Apri 2 terminali.

Terminale 1 (backend):

```bash
cd backend
npm run dev
```

Terminale 2 (frontend):

```bash
cd frontend
npm run dev
```

App disponibile su:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 4) (Opzionale) Popolare il database con dati demo

Da `backend`:

```bash
npm run db:seed
```

Oppure reset completo + seed:

```bash
npm run db:reset:seed
```

Credenziali demo (seed):

- Email: `pt.demo@jsgym.it`
- Password: `Password123!`
