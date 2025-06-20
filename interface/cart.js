document.addEventListener('DOMContentLoaded', () => {
    const cartIconButton = document.getElementById('cart-icon-button');

    // Função para atualizar o ícone do carrinho com a contagem de itens
    window.updateCartIcon = () => {
        const cart = JSON.parse(localStorage.getItem('petPalCart')) || [];
        // Soma a quantidade de todos os itens no carrinho
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        // Remove o badge antigo se existir
        const existingBadge = cartIconButton.querySelector('.cart-badge');
        if (existingBadge) {
            existingBadge.remove();
        }

        // Adiciona um novo badge se houver itens no carrinho
        if (totalItems > 0) {
            const badge = document.createElement('span');
            badge.className = 'cart-badge absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center';
            badge.textContent = totalItems;
            cartIconButton.appendChild(badge);
        }
    };

    // Atualiza o ícone ao carregar a página
    updateCartIcon();
});