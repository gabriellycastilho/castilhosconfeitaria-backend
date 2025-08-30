import { Router } from "express";
import { 
  getProdutos, 
  getProdutosPorCategoria,
  criarProduto,
  atualizarProduto,
  deletarProduto
} from "../controllers/produtos.controller.js";

const router = Router();

// LISTAR
router.get("/", getProdutos);
router.get("/:categoria", getProdutosPorCategoria);

// CRIAR
router.post("/", criarProduto);

// ATUALIZAR
router.put("/:id", atualizarProduto);

// DELETAR
router.delete("/:id", deletarProduto);

export default router;

