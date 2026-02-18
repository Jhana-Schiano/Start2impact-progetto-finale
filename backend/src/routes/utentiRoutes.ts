import express from "express";
import {
  createUtente,
  modificaContatti,
} from "../controllers/utentiController.js";

const router = express.Router();

router.post("/", createUtente);
router.patch("/:id/contatti", modificaContatti);

export default router;
