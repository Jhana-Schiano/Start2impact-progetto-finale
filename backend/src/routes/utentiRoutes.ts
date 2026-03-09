import express from "express";
import {
  createUtente,
  getUtenteById,
  loginUtente,
  modificaContatti,
} from "../controllers/utentiController.js";

const router = express.Router();

router.post("/login", loginUtente);
router.post("/", createUtente);
router.get("/:id", getUtenteById);
router.patch("/:id/contatti", modificaContatti);

export default router;
