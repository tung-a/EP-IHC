document.addEventListener('DOMContentLoaded', () => {
    const historyContainer = document.getElementById('order-history-container');
    const emptyMessage = document.getElementById('empty-history-message');
    const clearHistoryBtn = document.getElementById('clear-history-btn'); // Novo botão

    const renderHistory = () => {
        const orderHistory = JSON.parse(localStorage.getItem('petPalOrderHistory')) || [];

        if (orderHistory.length === 0) {
            emptyMessage.classList.remove('hidden');
            historyContainer.classList.add('hidden');
            clearHistoryBtn.classList.add('hidden'); // Esconde o botão se não houver histórico
        } else {
            emptyMessage.classList.add('hidden');
            historyContainer.classList.remove('hidden');
            clearHistoryBtn.classList.remove('hidden'); // Mostra o botão se houver histórico
            historyContainer.innerHTML = '';

            orderHistory.forEach(order => {
                const orderCard = document.createElement('div');
                orderCard.className = 'bg-white p-6 rounded-lg shadow-md border';

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

    // --- NOVA LÓGICA PARA O BOTÃO DE LIMPAR ---
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            // Pede confirmação ao usuário antes de apagar
            if (confirm('Tem certeza que deseja limpar todo o histórico de compras? Esta ação não pode ser desfeita.')) {
                // Remove o item do localStorage
                localStorage.removeItem('petPalOrderHistory');
                // Re-renderiza a página para mostrar o estado vazio
                renderHistory();
            }
        });
    }

    renderHistory();
});