// server.js

const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Habilitar CORS para todas as rotas
app.use(cors());

// Conectar ao banco de dados
connectDB();

// Middleware para analisar JSON
app.use(express.json());

// Rotas
app.use('/api/users', require('./routes/userRoutes'));  // Certifique-se de que isso esteja aqui

// Rota de health check
app.get('/healthcheck', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
