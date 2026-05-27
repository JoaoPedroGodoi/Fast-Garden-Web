import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const PORTA = 3001;

// Habilita o acesso de outras origens (como o seu frontend)
app.use(cors());
app.use(express.json());
// app.use(express.static())

// Configuração do pool de conexões do MySQL
const dbPool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'fast_gardenbd',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Rota para buscar todos os produtos
app.get('/produtos', async (req, res) => {
    try {
        const [rows] = await dbPool.query('SELECT * FROM produtos');
        res.json(rows);
    } catch (erro) {
        console.error('Erro ao buscar produtos:', erro);
        res.status(500).json({ erro: 'Falha ao buscar produtos no banco de dados MySQL.' });
    }
});

// Iniciando o servidor
app.listen(PORTA, () => {
    console.log(` Backend de Produtos rodando em http://localhost:${PORTA} conectado ao MySQL (fast_gardenbd) na porta 3306`);
});
