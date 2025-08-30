import { pool } from "../db.js";

export async function criarPedido(req, res) {
  const {
    cliente_nome,
    cliente_email,
    cliente_telefone,
    endereco_entrega,
    observacoes,
    itens
  } = req.body;

  // Verifica se o pedido tem ao menos 1 item
  if (!itens || itens.length === 0) {
    return res.status(400).json({ error: "O pedido precisa ter ao menos 1 item" });
  }

  try {
    // Calcula o total do pedido
    const total = itens.reduce(
      (acc, item) => acc + item.quantidade * item.preco_unitario,
      0
    );

    // Cria o pedido na tabela pedidos e pega o ID gerado
    const pedidoResult = await pool.query(
      `INSERT INTO pedidos 
       (cliente_nome, cliente_email, cliente_telefone, endereco_entrega, observacoes, total) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        cliente_nome,
        cliente_email,
        cliente_telefone,
        endereco_entrega,
        observacoes,
        total
      ]
    );

    const pedidoId = pedidoResult.rows[0].id;

    // Insere todos os itens do pedido
    for (const item of itens) {
      await pool.query(
        `INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario)
         VALUES ($1, $2, $3, $4)`,
        [pedidoId, item.produto_id, item.quantidade, item.preco_unitario]
      );
    }

    res.status(201).json({
      message: "✅ Pedido criado com sucesso!",
      pedido_id: pedidoId,
      total
    });

  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ error: "Erro ao criar pedido" });
  }
}
