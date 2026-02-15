import express from "express";
import { createUtente } from "../controllers/utentiController.js";

const router = express.Router();

router.post("/", createUtente);

export default router;
