import { GoogleGenerativeAI } from "@google/generative-ai";

const iniciarChat = async (req, res) => {
    try {
        const CHAVE_API = process.env.API_KEY;
        const mensagem = req.body.mensagem;
        const historico = req.body.historico ? req.body.historico : [];

        const genAI = new GoogleGenerativeAI(CHAVE_API);
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview", 
            systemInstruction: `Você é a Flora, a especialista botânica e atendente virtual do Fast Garden, um e-commerce de plantas.
                    Catálogo de Produtos:
                    - Costela de Adão R$ 75,00
                    - Suculenta Mista R$ 25,90
                    - Espada de São Jorge R$ 40,00
                    - Orquídea Phalaenopsis R$ 85,00
                    - Bonsai Ficus R$ 120,00
                    - Girassol Anão R$ 35,00
                    - Vaso Autoirrigável R$ 45,00
                    - Kit Ferramentas R$ 55,90
                    - Nutriente Spray R$ 19,90

                    Regras:
                    1. Seja breve, amigável e direta. Aja como uma verdadeira amante de plantas e use emojis da natureza (🌿, 🪴, 🌺) com moderação.
                    2. Se o cliente pedir algo fora do catálogo, peça desculpas e diga que não temos no momento.
                    3. Não colete endereço de entrega por aqui. Instrua o usuário a adicionar os itens desejados no carrinho através da interface do site e finalizar por lá.
                    4. Calcule valores e dê recomendações de plantas baseadas na necessidade do cliente (luz, espaço, cuidados).
                    5. Considere o histórico de mensagens antes de responder.`
        });

        const chat = model.startChat({ history: historico});
        const resultado = await chat.sendMessage(mensagem);
        const resposta = resultado.response.text();

        res.status(200).json({
            resposta: resposta,
            novoHistorico: [
                ...historico, 
                { role: "user", parts: [{text: mensagem}] },
                { role: "model", parts: [{text: resposta}] },
            ]});

    } catch (erro) {
        console.error("Erro: ", erro);
        res.status(500).json({erro: "Erro ao processar a mensagem", message: erro.message})
    }
}

export default {iniciarChat};
