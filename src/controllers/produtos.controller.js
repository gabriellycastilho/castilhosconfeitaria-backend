import { pool } from "../db.js";

// listar (GET)
export async function getProdutos(req, res) {
  try {
    const result = await pool.query("SELECT * FROM produtos");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
}

export async function getProdutosPorCategoria(req, res) {
  const { categoria } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM produtos WHERE categoria = $1",
      [categoria]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar produtos por categoria" });
  }
}

// Criar um novo produto (POST)
export async function criarProduto(req, res) {
  const { nome, categoria, preco, imagem, detalhes } = req.body;

  // Se algum campo obrigatório não vier, retorna erro
  if (!nome || !categoria || !preco) {
    return res
      .status(400)
      .json({ error: "Nome, categoria e preço são obrigatórios" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO produtos (nome, categoria, preco, imagem, detalhes) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nome, categoria, preco, imagem || null, detalhes || null]
    );

    res.status(201).json(result.rows[0]); // retorna o produto criado
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
}

// Atualizar um produto existente (PUT)
export async function atualizarProduto(req, res) {
  const { id } = req.params; // pega o id da URL
  const { nome, categoria, preco, imagem, detalhes } = req.body;

  try {
    const result = await pool.query(
      `UPDATE produtos 
       SET nome = $1, categoria = $2, preco = $3, imagem = $4, detalhes = $5 
       WHERE id = $6 RETURNING *`,
      [nome, categoria, preco, imagem || null, detalhes || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(result.rows[0]); // retorna o produto atualizado
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
}

// Deletar um produto (DELETE)
export async function deletarProduto(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM produtos WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json({ message: "Produto removido com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar produto" });
  }
}
