import express from "express";
import type { Request, Response, NextFunction } from "express";
import utentiRoutes from "./routes/utentiRoutes.js";

const app = express();

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

app.use("/api/utenti", utentiRoutes);

if (require.main === module) {
  app.listen(5000, function () {
    console.log(
      `Express App running at http://127.0.0.1:5000}/`
    );
  });
}

export default app;