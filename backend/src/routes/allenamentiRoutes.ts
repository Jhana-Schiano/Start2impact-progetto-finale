import express from "express";
import {
  createAllenamento,
  getAllAllenamenti,
} from "../controllers/allenamentiController.js";

const router = express.Router();

router.post("/", createAllenamento);
router.get("/", getAllAllenamenti);

export default router;
