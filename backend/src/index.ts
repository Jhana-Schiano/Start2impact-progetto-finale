import express from "express";
import type { Request, Response, NextFunction } from "express";
import { fileURLToPath } from "node:url";
import sequelize, { ensureDatabaseExists } from "./config/database.js";
import {
  allenamentiRoutes,
  eserciziRoutes,
  clientiRoutes,
  schedeRoutes,
  utentiRoutes,
} from "./routes/index.js";

const app = express();

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

app.use("/api/utenti", utentiRoutes);
app.use("/api/clienti", clientiRoutes);
app.use("/api/schede", schedeRoutes);
app.use("/api/allenamenti", allenamentiRoutes);
app.use("/api/esercizi", eserciziRoutes);

const port = Number(process.env.PORT ?? 5000);

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  ensureDatabaseExists()
    .then(() => sequelize.authenticate())
    .then(() => sequelize.sync())
    .then(() => {
      console.log("Connessione al database stabilita.");
      app.listen(port, function () {
        console.log(`Express App running at http://127.0.0.1:${port}/`);
      });
    })
    .catch((error) => {
      console.error("Impossibile connettersi al database:", error);
      process.exit(1);
    });
}

export default app;
