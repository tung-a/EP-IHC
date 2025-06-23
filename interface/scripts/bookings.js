document.addEventListener('DOMContentLoaded', () => {
    const bookingsGrid = document.getElementById('bookings-grid');
    const emptyMessage = document.getElementById('empty-bookings-message');

    /**
     * [LÓGICA APRIMORADA] Cancela o agendamento com uma animação de fade-out.
     * @param {string} serviceTitle - O título do serviço a cancelar.
     * @param {HTMLElement} cardElement - O elemento do card a ser animado.
     */
    const cancelBooking = (serviceTitle, cardElement) => {
        // Adiciona a classe que aciona a animação CSS
        if (cardElement) {
            cardElement.classList.add('removing');
        }

        // Espera a animação terminar (400ms) antes de remover os dados
        setTimeout(() => {
            let bookings = JSON.parse(localStorage.getItem('petPalBookings')) || [];
            bookings = bookings.filter(service => service.title !== serviceTitle);
            localStorage.setItem('petPalBookings', JSON.stringify(bookings));
            
            // Re-renderiza a lista para refletir o cancelamento.
            // O card já terá desaparecido visualmente.
            renderBookings();
        }, 400); // A duração deve corresponder à animação no custom.css
    };

    /**
     * Adiciona os event listeners aos botões de cancelar e aos cards.
     */
    const addEventListeners = () => {
        // Adiciona evento para o botão de cancelar
        document.querySelectorAll('.cancel-booking-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation(); // Impede que o modal abra ao clicar no botão
                const cardElement = event.target.closest('.item-card');
                const serviceTitle = cardElement.dataset.title;
                
                // Remove o antigo `confirm()` e chama diretamente a função de cancelar
                cancelBooking(serviceTitle, cardElement);
            });
        });

        // Adiciona evento para abrir o modal nos cards
        document.querySelectorAll('#bookings-grid .item-card').forEach(card => {
            card.addEventListener('click', () => {
                // Impede a abertura do modal se o card estiver a ser removido
                if (card.classList.contains('removing')) return;

                const cardData = card.dataset;
                const data = {
                    image: cardData.image,
                    title: cardData.title,
                    description: cardData.description,
                    subtext: cardData.subtext,
                    buttonText: "Agendado!" // No modal, o botão mostrará que o serviço já está agendado
                };
                
                // A função openModal já existe globalmente através do modal.js
                if (window.openModal) {
                    window.openModal(data);
                }
            });
        });
    };

    /**
     * Renderiza os agendamentos na página.
     */
    const renderBookings = () => {
        if (!bookingsGrid) return;
        
        bookingsGrid.innerHTML = '';
        const bookings = JSON.parse(localStorage.getItem('petPalBookings')) || [];

        if (bookings.length === 0) {
            if (emptyMessage) emptyMessage.classList.remove('hidden');
            if (bookingsGrid) bookingsGrid.classList.add('hidden');
        } else {
            if (emptyMessage) emptyMessage.classList.add('hidden');
            if (bookingsGrid) bookingsGrid.classList.remove('hidden');

            bookings.forEach(service => {
                const serviceCard = document.createElement('div');
                serviceCard.className = 'item-card flex flex-col gap-3 pb-3 cursor-pointer transition-all hover:shadow-lg rounded-xl';
                
                Object.keys(service).forEach(key => {
                    serviceCard.dataset[key] = service[key];
                });

                serviceCard.innerHTML = `
                    <div class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl" style="background-image: url('${service.image}');"></div>
                    <div class="p-2">
                        <p class="text-[#101914] text-base font-medium leading-normal">${service.title}</p>
                        <p class="text-[#5a8c6e] text-sm font-normal leading-normal">${service.subtext}</p>
                    </div>
                    <button class="cancel-booking-btn mt-auto mx-2 px-3 py-1 text-xs font-semibold rounded-full">Cancelar Agendamento</button>
                `;
                bookingsGrid.appendChild(serviceCard);
            });
            addEventListeners();
        }
    };
    
    // Renderização inicial ao carregar a página
    renderBookings();
});
