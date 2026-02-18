import express from "express";
import {
  aggiornaCliente,
  createCliente,
} from "../controllers/clientiController.js";

const router = express.Router();

router.post("/", createCliente);
router.patch("/:id", aggiornaCliente);

export default router;
