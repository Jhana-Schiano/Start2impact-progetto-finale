import express from "express";
import {
  createEsercizio,
  deleteEsercizio,
  getAllEsercizi,
} from "../controllers/eserciziController.js";

const router = express.Router();

router.post("/", createEsercizio);
router.get("/", getAllEsercizi);
router.delete("/:id", deleteEsercizio);

export default router;
