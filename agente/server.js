import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatController from './controllers/chatController.js';

dotenv.config();

const app = express();
const PORTA = process.env.PORTA || 3000;

app.use(cors());
app.use(express.json());

app.post('/chat', chatController.iniciarChat);

app.listen(PORTA, () => {
    console.log(`🌿 Servidor da Flora rodando na porta ${PORTA}`);
});
