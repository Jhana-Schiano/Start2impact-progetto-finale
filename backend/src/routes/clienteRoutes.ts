import express from "express";
import {
  aggiornaCliente,
  createCliente,
  getClienteById,
} from "../controllers/clientiController.js";

const router = express.Router();

router.post("/", createCliente);
router.get("/:id", getClienteById);
router.patch("/:id", aggiornaCliente);

export default router;
