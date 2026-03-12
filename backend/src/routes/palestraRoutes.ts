import express from "express";
import { getPalestraDati } from "../controllers/PalestraController.js";

const router = express.Router();

router.get("/:id/dati", getPalestraDati);

export default router;
