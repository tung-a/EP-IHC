document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const orderSummary = document.getElementById('order-summary');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartTotalElement = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');

    /**
     * Calcula e atualiza os totais no resumo do pedido com um efeito visual.
     */
    const updateTotals = () => {
        const cart = JSON.parse(localStorage.getItem('petPalCart')) || [];
        const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        
        if (cartSubtotalElement) cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        if (cartTotalElement) cartTotalElement.textContent = `$${subtotal.toFixed(2)}`;

        // Adiciona um "flash" visual para indicar que os totais foram atualizados
        if (orderSummary) {
            orderSummary.classList.remove('is-updating');
            void orderSummary.offsetWidth; // Truque para reiniciar a animação CSS
            orderSummary.classList.add('is-updating');
        }

        // Mostra ou esconde a secção do carrinho se estiver vazio
        if (cart.length === 0) {
            if (emptyCartMessage) emptyCartMessage.classList.remove('hidden');
            if (cartItemsContainer) cartItemsContainer.classList.add('hidden');
            if (orderSummary) orderSummary.classList.add('hidden');
        }
    };

    /**
     * Remove um item do carrinho com uma animação.
     * @param {HTMLElement} buttonElement - O botão de remover que foi clicado.
     */
    const handleRemoveItem = (buttonElement) => {
        const row = buttonElement.closest('.cart-item-row');
        const title = buttonElement.dataset.title;

        row.classList.add('removing');

        setTimeout(() => {
            let cart = JSON.parse(localStorage.getItem('petPalCart')) || [];
            cart = cart.filter(item => item.title !== title);
            localStorage.setItem('petPalCart', JSON.stringify(cart));
            
            if (window.updateCartIcon) window.updateCartIcon();
            
            row.remove();
            updateTotals();
        }, 400); // Deve corresponder à duração da animação no CSS
    };

    /**
     * Altera a quantidade de um item.
     * @param {HTMLElement} buttonElement - O botão de +/- que foi clicado.
     * @param {number} change - 1 para aumentar, -1 para diminuir.
     */
    const handleQuantityChange = (buttonElement, change) => {
        const row = buttonElement.closest('.cart-item-row');
        const title = buttonElement.dataset.title;
        let cart = JSON.parse(localStorage.getItem('petPalCart')) || [];
        const item = cart.find(i => i.title === title);

        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            handleRemoveItem(buttonElement);
            return;
        }

        localStorage.setItem('petPalCart', JSON.stringify(cart));
        if (window.updateCartIcon) window.updateCartIcon();

        // Atualiza o DOM diretamente em vez de re-renderizar tudo
        const quantityEl = row.querySelector('.item-quantity');
        const subtotalEl = row.querySelector('.item-subtotal');
        if (quantityEl) quantityEl.textContent = item.quantity;
        if (subtotalEl) subtotalEl.textContent = `$${(item.quantity * item.price).toFixed(2)}`;

        updateTotals();
    };

    /**
     * Renderiza o estado inicial do carrinho.
     */
    const renderCart = () => {
        const cart = JSON.parse(localStorage.getItem('petPalCart')) || [];

        if (cart.length === 0) {
            if (emptyCartMessage) emptyCartMessage.classList.remove('hidden');
            return;
        }

        if (emptyCartMessage) emptyCartMessage.classList.add('hidden');
        if (cartItemsContainer) cartItemsContainer.classList.remove('hidden');
        if (orderSummary) orderSummary.classList.remove('hidden');

        cartItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item-row flex items-center justify-between border-b py-4';
            
            const itemPrice = parseFloat(item.price) || 0;
            const itemSubtotal = itemPrice * item.quantity;

            itemElement.innerHTML = `
                <div class="flex items-center gap-4">
                    <img src="${item.image}" alt="${item.title}" class="w-20 h-20 object-cover rounded-md">
                    <div>
                        <p class="font-bold">${item.title}</p>
                        <p class="text-sm text-gray-500">$${itemPrice.toFixed(2)}</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <div class="flex items-center border rounded-md">
                        <button data-title="${item.title}" class="quantity-change-btn decrease-btn px-3 py-1 text-lg font-bold">-</button>
                        <span class="item-quantity px-3">${item.quantity}</span>
                        <button data-title="${item.title}" class="quantity-change-btn increase-btn px-3 py-1 text-lg font-bold">+</button>
                    </div>
                    <p class="item-subtotal font-bold w-20 text-right">$${itemSubtotal.toFixed(2)}</p>
                    <button data-title="${item.title}" class="remove-item-btn text-red-500 hover:text-red-700 font-bold">X</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        updateTotals();
    };
    
    // --- Delegação de Eventos para os botões do carrinho ---
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            const target = event.target;
            if (target.matches('.quantity-change-btn')) {
                const change = target.classList.contains('increase-btn') ? 1 : -1;
                handleQuantityChange(target, change);
            }
            if (target.matches('.remove-item-btn')) {
                handleRemoveItem(target);
            }
        });
    }

    // --- Lógica do Checkout (mantida) ---
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('petPalCart')) || [];
            if (cart.length === 0) return;

            checkoutBtn.disabled = true;
            checkoutBtn.innerHTML = `<div class="flex items-center justify-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processando...</div>`;

            setTimeout(() => {
                const orderHistory = JSON.parse(localStorage.getItem('petPalOrderHistory')) || [];
                const newOrder = {
                    id: Date.now(),
                    date: new Date().toLocaleDateString('pt-BR'),
                    items: cart,
                    total: cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0)
                };
                orderHistory.unshift(newOrder);
                localStorage.setItem('petPalOrderHistory', JSON.stringify(orderHistory));
                localStorage.removeItem('petPalCart');
                if (window.updateCartIcon) window.updateCartIcon();
                window.location.href = 'checkout_success.html';
            }, 1500);
        });
    }

    renderCart();
});
