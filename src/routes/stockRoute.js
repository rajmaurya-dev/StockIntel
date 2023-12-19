import express from "express";
import stockController from "../controllers/stockController.js";

const router = express.Router();

router.get("/stocks/:ticker/target/:price", stockController.getStock);

export default router;
