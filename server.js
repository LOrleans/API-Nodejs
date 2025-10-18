// Importações
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import { initDatabase } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Rotas da aplicação
app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Rota raiz
app.get('/', (req, res) => {
    res.send('API de Gestão de Inventário de E-commerce!');
});

// Substitui o app.listen(), dessa forma o banco de dados é carregado primeiro
const startServer = async () => {
  try {
    // Espera o db.read() e db.write() do db.js terminarem
    await initDatabase();
    
    // Só depois que o db estiver pronto, o servidor começa a escutar
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Falha ao iniciar o servidor:", error);
    process.exit(1); // Encerra a aplicação se o DB falhar
  }
};

startServer();