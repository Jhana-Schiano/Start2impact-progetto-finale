import express from "express";
import { createScheda, getAllSchede } from "../controllers/schedeController.js";

const router = express.Router();

router.post("/", createScheda);
router.get("/", getAllSchede);

export default router;
