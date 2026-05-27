import mysql from 'mysql2/promise';

const produtosIniciais = [
    { id: '1', nome: 'Costela de Adão', categoria: 'Internas', descricao: 'Perfeita para ambientes internos.', preco: 75.00, imagemUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=400&auto=format&fit=crop' },
    { id: '2', nome: 'Suculenta Mista', categoria: 'Internas', descricao: 'Ideal para quem esquece de regar.', preco: 25.90, imagemUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=400&auto=format&fit=crop' },
    { id: '3', nome: 'Espada de São Jorge', categoria: 'Internas', descricao: 'Forte e purifica o ambiente.', preco: 40.00, imagemUrl: 'https://images.pexels.com/photos/7405748/pexels-photo-7405748.jpeg' },
    { id: '8', nome: 'Orquídea Phalaenopsis', categoria: 'Flores', descricao: 'Floração duradoura e elegante.', preco: 85.00, imagemUrl: 'https://images.pexels.com/photos/5646/flower-pink-houseplants-orchid.jpg' },
    { id: '9', nome: 'Bonsai Ficus', categoria: 'Árvores', descricao: 'Uma mini árvore perfeita para decoração.', preco: 120.00, imagemUrl: 'https://images.pexels.com/photos/9130872/pexels-photo-9130872.jpeg' },
    { id: '10', nome: 'Girassol Anão', categoria: 'Flores', descricao: 'Luz e alegria para sua casa.', preco: 35.00, imagemUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?q=80&w=400&auto=format&fit=crop' },
    { id: '5', nome: 'Vaso Autoirrigável', categoria: 'Acessórios', descricao: 'Praticidade para quem não tem muito tempo.', preco: 45.00, imagemUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=400&auto=format&fit=crop' },
    { id: '6', nome: 'Kit Ferramentas', categoria: 'Acessórios', descricao: 'Pá, ancinho e tesoura para o dia a dia.', preco: 55.90, imagemUrl: 'https://http2.mlstatic.com/D_Q_NP_899092-MLB82993312802_032025-F.webp' },
    { id: '7', nome: 'Nutriente Spray', categoria: 'Acessórios', descricao: 'Adubo líquido pronto para uso direto nas folhas.', preco: 19.90, imagemUrl: 'https://down-br.img.susercontent.com/file/4b7fca9961b8a55eb7e32de4612b19d8' }
];

async function iniciar() {
    console.log(' Conectando ao MySQL na porta 3306...');
    
    // Conecta primeiro sem selecionar banco de dados para poder criá-lo
    const db = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '' // Conforme informado
    });

    console.log(' Criando o banco de dados fast_gardenBD...');
    await db.query(`CREATE DATABASE IF NOT EXISTS fast_gardenBD`);
    await db.query(`USE fast_gardenBD`);

    console.log(' Criando a tabela de produtos...');
    await db.query(`
        CREATE TABLE IF NOT EXISTS produtos (
            id VARCHAR(50) PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            categoria VARCHAR(50) NOT NULL,
            descricao TEXT,
            preco DECIMAL(10, 2) NOT NULL,
            imagemUrl TEXT
        )
    `);

    // Limpa a tabela para não duplicar se rodar novamente
    await db.query('DELETE FROM produtos');

    console.log(' Inserindo os produtos iniciais...');
    
    for (const produto of produtosIniciais) {
        await db.execute(
            'INSERT INTO produtos (id, nome, categoria, descricao, preco, imagemUrl) VALUES (?, ?, ?, ?, ?, ?)',
            [produto.id, produto.nome, produto.categoria, produto.descricao, produto.preco, produto.imagemUrl]
        );
    }

    console.log(' Banco de dados MySQL criado e populado com sucesso!');
    await db.end();
}

iniciar().catch(err => {
    console.error(' Erro ao criar banco de dados:', err);
});
