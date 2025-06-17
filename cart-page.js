document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const orderSummary = document.getElementById('order-summary');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartTotalElement = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutFeedback = document.getElementById('checkout-feedback');

    const renderCart = () => {
        const cart = JSON.parse(localStorage.getItem('petPalCart')) || [];

        if (cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            cartItemsContainer.classList.add('hidden');
            if (orderSummary) {
                orderSummary.classList.add('hidden');
            }
            return;
        }

        emptyCartMessage.classList.add('hidden');
        cartItemsContainer.classList.remove('hidden');
        if (orderSummary) {
            orderSummary.classList.remove('hidden');
        }
        cartItemsContainer.innerHTML = '';
        
        let subtotal = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'flex items-center justify-between border-b py-4';
            
            const itemPrice = parseFloat(item.price) || 0;
            const itemSubtotal = itemPrice * item.quantity;
            subtotal += itemSubtotal;

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
                        <span class="px-3">${item.quantity}</span>
                        <button data-title="${item.title}" class="quantity-change-btn increase-btn px-3 py-1 text-lg font-bold">+</button>
                    </div>
                    <p class="font-bold w-20 text-right">$${itemSubtotal.toFixed(2)}</p>
                    <button data-title="${item.title}" class="remove-item-btn text-red-500 hover:text-red-700 font-bold">X</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        cartTotalElement.textContent = `$${subtotal.toFixed(2)}`;

        addEventListeners();
    };

    const handleQuantityChange = (title, change) => {
        let cart = JSON.parse(localStorage.getItem('petPalCart')) || [];
        const item = cart.find(i => i.title === title);
        
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                handleRemoveItem(title);
                return;
            }
        }

        localStorage.setItem('petPalCart', JSON.stringify(cart));
        renderCart();
        if (window.updateCartIcon) window.updateCartIcon();
    };

    const handleRemoveItem = (title) => {
        let cart = JSON.parse(localStorage.getItem('petPalCart')) || [];
        cart = cart.filter(item => item.title !== title);
        localStorage.setItem('petPalCart', JSON.stringify(cart));
        renderCart();
        if (window.updateCartIcon) window.updateCartIcon();
    };

    const addEventListeners = () => {
        document.querySelectorAll('.quantity-change-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const title = event.target.dataset.title;
                const change = event.target.classList.contains('increase-btn') ? 1 : -1;
                handleQuantityChange(title, change);
            });
        });

        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const title = event.target.dataset.title;
                handleRemoveItem(title);
            });
        });
    };
    
    // --- LÓGICA DO CHECKOUT ---
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const cart = JSON.parse(localStorage.getItem('petPalCart')) || [];
            checkoutFeedback.innerHTML = ''; // Limpa feedback anterior

            // Cenário de Fracasso
            if (cart.length === 0) {
                checkoutFeedback.innerHTML = `<p class="text-red-500 font-semibold">Seu carrinho está vazio!</p>`;
                return;
            }

            // Cenário de Sucesso (Simulação)
            // 1. Mostra estado de processamento
            checkoutBtn.disabled = true;
            checkoutBtn.innerHTML = `
                <div class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando...
                </div>`;

            // 2. Simula o tempo de processamento (2 segundos)
            setTimeout(() => {
                // Salva o pedido no histórico
                const orderHistory = JSON.parse(localStorage.getItem('petPalOrderHistory')) || [];
                const newOrder = {
                    id: Date.now(),
                    date: new Date().toLocaleDateString('pt-BR'),
                    items: cart,
                    total: cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0)
                };
                orderHistory.unshift(newOrder);
                localStorage.setItem('petPalOrderHistory', JSON.stringify(orderHistory));

                // 3. Mostra feedback de sucesso
                checkoutBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
                checkoutBtn.classList.add('bg-blue-500');
                checkoutBtn.innerHTML = `Compra Aprovada! ✅`;

                // 4. Limpa o carrinho e atualiza o ícone
                localStorage.removeItem('petPalCart');
                if (window.updateCartIcon) window.updateCartIcon();

                // 5. Redireciona para a página de sucesso após 1.5s
                setTimeout(() => {
                    window.location.href = 'checkout_success.html';
                }, 1500);

            }, 2000);
        });
    }

    renderCart();
});