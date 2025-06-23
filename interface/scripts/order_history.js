document.addEventListener('DOMContentLoaded', () => {
    const historyContainer = document.getElementById('order-history-container');
    const emptyMessage = document.getElementById('empty-history-message');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    const renderHistory = () => {
        const orderHistory = JSON.parse(localStorage.getItem('petPalOrderHistory')) || [];

        // Limpa sempre a vista antes de renderizar
        historyContainer.innerHTML = ''; 

        if (orderHistory.length === 0) {
            emptyMessage.classList.remove('hidden');
            historyContainer.classList.add('hidden');
            if (clearHistoryBtn) clearHistoryBtn.classList.add('hidden');
        } else {
            emptyMessage.classList.add('hidden');
            historyContainer.classList.remove('hidden');
            if (clearHistoryBtn) clearHistoryBtn.classList.remove('hidden');

            orderHistory.forEach(order => {
                const orderCard = document.createElement('div');
                // Adicionamos uma classe específica para os cards de pedido
                orderCard.className = 'order-card bg-white p-6 rounded-lg shadow-md border';

                let itemsHtml = order.items.map(item => `
                    <div class="flex items-center gap-4 py-2 border-b last:border-b-0">
                        <img src="${item.image}" alt="${item.title}" class="w-12 h-12 object-cover rounded-md">
                        <div class="flex-grow">
                            <p class="font-semibold">${item.title}</p>
                            <p class="text-sm text-gray-500">Qtd: ${item.quantity} x $${parseFloat(item.price).toFixed(2)}</p>
                        </div>
                        <p class="font-semibold">$${(item.quantity * parseFloat(item.price)).toFixed(2)}</p>
                    </div>
                `).join('');

                orderCard.innerHTML = `
                    <div class="flex justify-between items-center border-b pb-3 mb-3">
                        <div>
                            <p class="font-bold text-lg">Pedido #${order.id}</p>
                            <p class="text-sm text-gray-500">Realizado em: ${order.date}</p>
                        </div>
                        <p class="font-bold text-xl text-green-600">$${order.total.toFixed(2)}</p>
                    </div>
                    <div class="space-y-2">
                        ${itemsHtml}
                    </div>
                `;
                historyContainer.appendChild(orderCard);
            });
        }
    };

    // --- [NOVA LÓGICA] Limpar histórico com animação ---
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            const cards = document.querySelectorAll('.order-card');
            
            if (cards.length > 0) {
                // Adiciona a classe de animação a todos os cards
                cards.forEach(card => {
                    card.classList.add('removing');
                });

                // Espera a animação terminar (400ms) antes de limpar os dados
                setTimeout(() => {
                    localStorage.removeItem('petPalOrderHistory');
                    // Re-renderiza a página para mostrar o estado vazio
                    renderHistory();
                }, 400); 
            }
        });
    }

    // Renderização inicial ao carregar a página
    renderHistory();
});
