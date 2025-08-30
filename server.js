import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import produtosRoutes from "./routes/produtos.routes.js";
import pedidosRoutes from "./routes/pedidos.routes.js"; 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/produtos", produtosRoutes);
app.use("/pedidos", pedidosRoutes); // REGISTRA AS ROTAS DE PEDIDOS

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));

