const produtos = [
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

let carrinho = {};

function formatCurrency(value) {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
    window.scrollTo(0, 0);
    
    if (screenId === 'home-screen') renderHomeProducts();
    if (screenId === 'cardapio-screen') renderProducts();
    if (screenId === 'cart-screen') renderCart();
}

function scrollToCategory(cat) {
    const el = document.getElementById(`cat-${cat}`);
    if (el) {
        const offset = 80;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }
}

function adicionarItem(id) {
    if (carrinho[id]) {
        carrinho[id].quantidade += 1;
    } else {
        const produto = produtos.find(p => p.id === id);
        carrinho[id] = { produto, quantidade: 1 };
    }
    updateCartUI();
}

function removerItemUnico(id) {
    if (!carrinho[id]) return;
    if (carrinho[id].quantidade > 1) {
        carrinho[id].quantidade -= 1;
    } else {
        delete carrinho[id];
    }
    updateCartUI();
    if (!document.getElementById('cart-screen').classList.contains('hidden')) {
        renderCart();
    }
}

function updateCartUI() {
    let totalItems = 0;
    for (let id in carrinho) {
        totalItems += carrinho[id].quantidade;
    }
    
    document.querySelectorAll('.cart-badge').forEach(badge => {
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });
}

function renderHomeProducts() {
    const container = document.getElementById('home-products-container');
    if (!container) return;
    if (container.children.length > 0) return; // Evita re-renderizar

    const categorias = ['Internas', 'Flores', 'Árvores', 'Acessórios'];
    let html = '';
    
    categorias.forEach(cat => {
        const prods = produtos.filter(p => p.categoria === cat);
        if (prods.length === 0) return;
        
        html += `
            <div class="flex-between mt-4 mb-4" id="cat-${cat}">
                <h2 style="font-size: 18px">${cat}</h2>
                <button style="color: var(--primary); background: none; font-size: 14px; cursor: pointer;" onclick="navigateTo('cardapio-screen')">Ver mais</button>
            </div>
            <div class="product-grid" style="padding: 0; gap: 16px;">
        `;
        
        prods.forEach(p => {
            html += `
                <div class="glass-card product-card">
                    <img src="${p.imagemUrl}" class="product-image" alt="${p.nome}">
                    <div>
                        <h3 class="product-title">${p.nome}</h3>
                        <p class="product-desc">${p.descricao}</p>
                    </div>
                    <div class="flex-between">
                        <span class="product-price">${formatCurrency(p.preco)}</span>
                        <button class="add-btn" onclick="adicionarItem('${p.id}')"><i class="ph ph-plus"></i></button>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
    });
    
    container.innerHTML = html;
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (grid.children.length > 0) return; // Evita re-renderizar
    
    grid.innerHTML = '';
    produtos.forEach(p => {
        grid.innerHTML += `
            <div class="glass-card product-card">
                <img src="${p.imagemUrl}" class="product-image" alt="${p.nome}">
                <div>
                    <h3 class="product-title">${p.nome}</h3>
                    <p class="product-desc">${p.descricao}</p>
                </div>
                <div class="flex-between">
                    <span class="product-price">${formatCurrency(p.preco)}</span>
                    <button class="add-btn" onclick="adicionarItem('${p.id}')"><i class="ph ph-plus"></i></button>
                </div>
            </div>
        `;
    });
}

function renderCart() {
    const cartList = document.getElementById('cart-list');
    const emptyState = document.getElementById('empty-cart');
    const orderReview = document.getElementById('order-review');
    
    let totalItems = 0;
    let subtotal = 0;
    let frete = 15.00;
    
    cartList.innerHTML = '';
    
    for (let id in carrinho) {
        totalItems += carrinho[id].quantidade;
        let item = carrinho[id];
        subtotal += item.produto.preco * item.quantidade;
        
        cartList.innerHTML += `
            <div class="glass-card cart-item">
                <img src="${item.produto.imagemUrl}" alt="">
                <div class="cart-item-info">
                    <h3 class="product-title">${item.produto.nome}</h3>
                    <p class="product-price">${formatCurrency(item.produto.preco)}</p>
                </div>
                <div class="qty-controls">
                    <button onclick="removerItemUnico('${id}')"><i class="ph ph-minus-circle"></i></button>
                    <span>${item.quantidade}</span>
                    <button onclick="adicionarItem('${id}'); renderCart();"><i class="ph ph-plus-circle"></i></button>
                </div>
            </div>
        `;
    }
    
    if (totalItems === 0) {
        emptyState.classList.remove('hidden');
        orderReview.classList.add('hidden');
        document.getElementById('checkout-bar').classList.add('hidden');
    } else {
        emptyState.classList.add('hidden');
        orderReview.classList.remove('hidden');
        document.getElementById('checkout-bar').classList.remove('hidden');
        
        document.getElementById('subtotal-value').textContent = formatCurrency(subtotal);
        document.getElementById('total-value').textContent = formatCurrency(subtotal + frete);
        document.getElementById('btn-checkout').textContent = `Pagar ${formatCurrency(subtotal + frete)}`;
    }
}

function finalizarPedido() {
    alert("Pedido realizado com sucesso!");
    carrinho = {};
    updateCartUI();
    navigateTo('home-screen');
}

updateCartUI();
if (!document.getElementById('home-screen').classList.contains('hidden')) {
    renderHomeProducts();
}
