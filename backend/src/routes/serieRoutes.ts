import express from "express";
import { createSerie, getAllSerie } from "../controllers/serieController.js";

const router = express.Router();

router.post("/", createSerie);
router.get("/", getAllSerie);

export default router;
