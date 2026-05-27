let produtos = [];
let carrinho = {};
let meusPedidos = [];

function formatarMoeda(valor) {
    return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
}

function navegarPara(idDaTela) {
    document.querySelectorAll('.tela').forEach(tela => tela.classList.add('oculto'));
    document.getElementById(idDaTela).classList.remove('oculto');
    window.scrollTo(0, 0);
    
    const botaoChat = document.getElementById('botao-chat-flutuante');
    if (botaoChat) {
        if (idDaTela === 'tela-abertura') {
            botaoChat.classList.add('oculto');
            const janelaChat = document.getElementById('janela-chat');
            if (janelaChat && !janelaChat.classList.contains('oculto')) {
                janelaChat.classList.add('oculto');
            }
        } else {
            botaoChat.classList.remove('oculto');
        }
    }
    
    if (idDaTela === 'tela-inicial') renderizarProdutosHome();
    if (idDaTela === 'tela-catalogo') renderizarProdutos();
    if (idDaTela === 'tela-carrinho') renderizarCarrinho();
    if (idDaTela === 'tela-pedidos') renderizarPedidos();
}

function rolarParaCategoria(categoria) {
    const elemento = document.getElementById(`categoria-${categoria}`);
    if (elemento) {
        const compensacao = 80;
        const topo = elemento.getBoundingClientRect().top + window.scrollY - compensacao;
        window.scrollTo({ top: topo, behavior: 'smooth' });
    }
}

function adicionarItem(id) {
    if (carrinho[id]) {
        carrinho[id].quantidade += 1;
    } else {
        const produto = produtos.find(p => p.id === id);
        if (produto) {
            carrinho[id] = { produto, quantidade: 1 };
        }
    }
    atualizarInterfaceCarrinho();
}

function removerItemUnico(id) {
    if (!carrinho[id]) return;
    if (carrinho[id].quantidade > 1) {
        carrinho[id].quantidade -= 1;
    } else {
        delete carrinho[id];
    }
    atualizarInterfaceCarrinho();
    
    if (!document.getElementById('tela-carrinho').classList.contains('oculto')) {
        renderizarCarrinho();
    }
}

function atualizarInterfaceCarrinho() {
    let totalItens = 0;
    for (let id in carrinho) {
        totalItens += carrinho[id].quantidade;
    }
    
    document.querySelectorAll('.contador-carrinho').forEach(contador => {
        if (totalItens > 0) {
            contador.textContent = totalItens;
            contador.classList.remove('oculto');
        } else {
            contador.classList.add('oculto');
        }
    });
}

function renderizarProdutosHome() {
    const container = document.getElementById('container-produtos-home');
    if (!container) return;
    if (container.children.length > 0) return;

    const categorias = ['Internas', 'Flores', 'Árvores', 'Acessórios'];
    let htmlGerado = '';
    
    categorias.forEach(categoria => {
        const produtosFiltrados = produtos.filter(p => p.categoria === categoria);
        if (produtosFiltrados.length === 0) return;
        
        htmlGerado += `
            <div class="flex-espacado margem-cima-4 margem-baixo-4" id="categoria-${categoria}">
                <h2 style="font-size: 18px">${categoria}</h2>
                <button style="color: var(--primaria); background: none; font-size: 14px; cursor: pointer;" onclick="navegarPara('tela-catalogo')">Ver mais</button>
            </div>
            <div class="grade-produtos" style="padding: 0; gap: 16px;">
        `;
        
        produtosFiltrados.forEach(produto => {
            htmlGerado += `
                <div class="cartao-vidro cartao-produto">
                    <img src="${produto.imagemUrl}" class="imagem-produto" alt="${produto.nome}">
                    <div>
                        <h3 class="titulo-produto">${produto.nome}</h3>
                        <p class="descricao-produto">${produto.descricao}</p>
                    </div>
                    <div class="flex-espacado">
                        <span class="preco-produto">${formatarMoeda(produto.preco)}</span>
                        <button class="botao-adicionar" onclick="adicionarItem('${produto.id}')"><i class="ph ph-plus"></i></button>
                    </div>
                </div>
            `;
        });
        
        htmlGerado += `</div>`;
    });
    
    container.innerHTML = htmlGerado;
}

function renderizarProdutos() {
    const grade = document.getElementById('grade-produtos-id');
    if (grade.children.length > 0) return;
    
    grade.innerHTML = '';
    produtos.forEach(produto => {
        grade.innerHTML += `
            <div class="cartao-vidro cartao-produto">
                <img src="${produto.imagemUrl}" class="imagem-produto" alt="${produto.nome}">
                <div>
                    <h3 class="titulo-produto">${produto.nome}</h3>
                    <p class="descricao-produto">${produto.descricao}</p>
                </div>
                <div class="flex-espacado">
                    <span class="preco-produto">${formatarMoeda(produto.preco)}</span>
                    <button class="botao-adicionar" onclick="adicionarItem('${produto.id}')"><i class="ph ph-plus"></i></button>
                </div>
            </div>
        `;
    });
}

function renderizarCarrinho() {
    const listaCarrinho = document.getElementById('lista-carrinho');
    const estadoVazio = document.getElementById('carrinho-vazio');
    const revisaoPedido = document.getElementById('revisao-pedido');
    
    let totalItens = 0;
    let subtotal = 0;
    let frete = 15.00;
    
    listaCarrinho.innerHTML = '';
    
    for (let id in carrinho) {
        totalItens += carrinho[id].quantidade;
        let item = carrinho[id];
        subtotal += item.produto.preco * item.quantidade;
        
        listaCarrinho.innerHTML += `
            <div class="cartao-vidro item-carrinho">
                <img src="${item.produto.imagemUrl}" alt="">
                <div class="info-item-carrinho">
                    <h3 class="titulo-produto">${item.produto.nome}</h3>
                    <p class="preco-produto">${formatarMoeda(item.produto.preco)}</p>
                </div>
                <div class="controles-quantidade">
                    <button onclick="removerItemUnico('${id}')"><i class="ph ph-minus-circle"></i></button>
                    <span>${item.quantidade}</span>
                    <button onclick="adicionarItem('${id}'); renderizarCarrinho();"><i class="ph ph-plus-circle"></i></button>
                </div>
            </div>
        `;
    }
    
    if (totalItens === 0) {
        estadoVazio.classList.remove('oculto');
        revisaoPedido.classList.add('oculto');
        document.getElementById('barra-pagamento').classList.add('oculto');
    } else {
        estadoVazio.classList.add('oculto');
        revisaoPedido.classList.remove('oculto');
        document.getElementById('barra-pagamento').classList.remove('oculto');
        
        document.getElementById('valor-subtotal').textContent = formatarMoeda(subtotal);
        document.getElementById('valor-total').textContent = formatarMoeda(subtotal + frete);
        document.getElementById('botao-pagamento').textContent = `Pagar ${formatarMoeda(subtotal + frete)}`;
    }
}

function finalizarPedido() {
    let totalItens = 0;
    let subtotal = 0;
    let itensPedido = [];
    
    for (let id in carrinho) {
        totalItens += carrinho[id].quantidade;
        let item = carrinho[id];
        subtotal += item.produto.preco * item.quantidade;
        itensPedido.push({
            nome: item.produto.nome,
            quantidade: item.quantidade,
            preco: item.produto.preco,
            imagemUrl: item.produto.imagemUrl
        });
    }

    if (totalItens === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let frete = 15.00;
    let total = subtotal + frete;

    const data = new Date();
    const dataFormatada = data.toLocaleDateString('pt-BR');

    const novoPedido = {
        id: Math.random().toString(36).substr(2, 9),
        data: dataFormatada,
        itens: itensPedido,
        total: total
    };

    meusPedidos.unshift(novoPedido);
    
    alert("Pedido realizado com sucesso!");
    carrinho = {};
    atualizarInterfaceCarrinho();
    navegarPara('tela-inicial');
}

function renderizarPedidos() {
    const listaPedidos = document.getElementById('lista-pedidos');
    const pedidosVazio = document.getElementById('pedidos-vazio');
    
    listaPedidos.innerHTML = '';
    
    if (meusPedidos.length === 0) {
        pedidosVazio.classList.remove('oculto');
    } else {
        pedidosVazio.classList.add('oculto');
        
        meusPedidos.forEach(pedido => {
            let itensHtml = '';
            pedido.itens.forEach(item => {
                itensHtml += `
                    <div style="display: flex; gap: 8px; margin-top: 8px; align-items: center">
                        <img src="${item.imagemUrl}" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
                        <div style="flex: 1">
                            <p style="font-size: 14px; font-weight: 600">${item.quantidade}x ${item.nome}</p>
                        </div>
                        <span style="font-size: 14px">${formatarMoeda(item.preco * item.quantidade)}</span>
                    </div>
                `;
            });

            listaPedidos.innerHTML += `
                <div class="cartao-vidro" style="padding: 16px; margin-bottom: 16px;">
                    <div class="flex-espacado" style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; margin-bottom: 12px;">
                        <div>
                            <p style="font-size: 12px; color: rgba(255,255,255,0.5)">Pedido #${pedido.id.toUpperCase()}</p>
                            <p style="font-size: 14px; font-weight: bold">${pedido.data}</p>
                        </div>
                        <div style="text-align: right">
                            <p style="font-size: 12px; color: rgba(255,255,255,0.5)">Total</p>
                            <p style="font-size: 16px; font-weight: bold; color: var(--primaria)">${formatarMoeda(pedido.total)}</p>
                        </div>
                    </div>
                    <div>
                        ${itensHtml}
                    </div>
                </div>
            `;
        });
    }
}

// === Lógica do Chatbot Flutuante ===
let historicoChat = [];

function alternarChat() {
    const janelaChat = document.getElementById('janela-chat');
    janelaChat.classList.toggle('oculto');
}

async function enviarMensagemChat(evento) {
    evento.preventDefault();
    
    const campoDeTexto = document.getElementById('entrada-chat');
    const texto = campoDeTexto.value.trim();
    if (!texto) return;

    exibirMensagemNaTela(texto, 'usuario');
    campoDeTexto.value = '';

    try {
        const respostaDaApi = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mensagem: texto,
                historico: historicoChat
            })
        });

        if (!respostaDaApi.ok) {
            throw new Error('Falha na resposta do servidor');
        }

        const dadosConvertidos = await respostaDaApi.json();
        
        historicoChat.push({ role: "user", parts: [{ text: texto }] });
        historicoChat.push({ role: "model", parts: [{ text: dadosConvertidos.resposta }] });
        
        exibirMensagemNaTela(dadosConvertidos.resposta, 'bot');
    } catch (erro) {
        console.error('Erro ao enviar mensagem:', erro);
        exibirMensagemNaTela('Desculpe, ocorreu um erro ao conectar com a assistente.', 'sistema');
    }
}

function exibirMensagemNaTela(texto, tipoMensagem) {
    const recipienteMensagens = document.getElementById('mensagens-chat');
    const novaDiv = document.createElement('div');
    
    let classeDoTipo = 'mensagem-sistema';
    if (tipoMensagem === 'usuario') {
        classeDoTipo = 'mensagem-usuario';
    } else if (tipoMensagem === 'bot') {
        classeDoTipo = 'mensagem-bot';
    }
    
    novaDiv.className = 'mensagem ' + classeDoTipo;
    novaDiv.innerHTML = texto.replace(/\n/g, '<br>');
    
    recipienteMensagens.appendChild(novaDiv);
    recipienteMensagens.scrollTop = recipienteMensagens.scrollHeight;
}

// === Conexão com o Banco de Dados (Backend Produtos) ===
async function carregarProdutosDoBanco() {
    try {
        const resposta = await fetch('http://localhost:3001/produtos');
        if (!resposta.ok) throw new Error('Falha ao buscar produtos');
        produtos = await resposta.json();
        console.log(produtos)
        
        if (!document.getElementById('tela-inicial').classList.contains('oculto')) {
            renderizarProdutosHome();
        }
        if (!document.getElementById('tela-catalogo').classList.contains('oculto')) {
            renderizarProdutos();
        }
    } catch (erro) {
        console.error('Erro ao carregar produtos:', erro);
        alert('Erro ao se conectar com o banco de dados de produtos. Certifique-se de que o backend_produtos está rodando na porta 3001.');
    }
}

atualizarInterfaceCarrinho();
carregarProdutosDoBanco();
