import { Router } from "express";
import { criarPedido } from "../controllers/pedidos.controller.js";

const router = Router();

// Rota para criar um pedido
router.post("/", criarPedido);

export default router;
