import express from "express";
import {
  createScheda,
  getAllSchede,
  getSchedaById,
} from "../controllers/schedeController.js";

const router = express.Router();

router.post("/", createScheda);
router.get("/", getAllSchede);
router.get("/:id", getSchedaById);

export default router;
