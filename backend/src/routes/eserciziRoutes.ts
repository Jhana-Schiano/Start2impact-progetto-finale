import express from "express";
import {
  createEsercizio,
  getAllEsercizi,
} from "../controllers/eserciziController.js";

const router = express.Router();

router.post("/", createEsercizio);
router.get("/", getAllEsercizi);

export default router;
