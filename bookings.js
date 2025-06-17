document.addEventListener('DOMContentLoaded', () => {
    const bookingsGrid = document.getElementById('bookings-grid');
    const emptyMessage = document.getElementById('empty-bookings-message');

    const renderBookings = () => {
        // Limpa a grade atual
        bookingsGrid.innerHTML = '';

        const bookings = JSON.parse(localStorage.getItem('petPalBookings')) || [];

        if (bookings.length === 0) {
            emptyMessage.classList.remove('hidden');
            bookingsGrid.classList.add('hidden');
        } else {
            emptyMessage.classList.add('hidden');
            bookingsGrid.classList.remove('hidden');

            bookings.forEach(service => {
                const serviceCard = document.createElement('div');
                serviceCard.className = 'item-card flex flex-col gap-3 pb-3 cursor-pointer transition-all hover:shadow-lg rounded-xl';
                // Adiciona os data-* atributos para o modal
                Object.keys(service).forEach(key => {
                    serviceCard.dataset[key] = service[key];
                });

                serviceCard.innerHTML = `
                    <div class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl" style="background-image: url('${service.image}');"></div>
                    <div>
                        <p class="text-[#101914] text-base font-medium leading-normal">${service.title}</p>
                        <p class="text-[#5a8c6e] text-sm font-normal leading-normal">${service.subtext}</p>
                    </div>
                    <button class="cancel-booking-btn mt-2 mx-2 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full hover:bg-red-600">Cancelar Agendamento</button>
                `;
                bookingsGrid.appendChild(serviceCard);
            });
            addEventListeners();
        }
    };

    const cancelBooking = (serviceTitle) => {
        let bookings = JSON.parse(localStorage.getItem('petPalBookings')) || [];
        bookings = bookings.filter(service => service.title !== serviceTitle);
        localStorage.setItem('petPalBookings', JSON.stringify(bookings));
        renderBookings(); // Re-renderiza a lista para refletir o cancelamento
    };

    const addEventListeners = () => {
        // Adiciona evento para o botão de cancelar
        document.querySelectorAll('.cancel-booking-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation(); // Impede que o modal abra
                const serviceTitle = event.target.closest('.item-card').dataset.title;
                if (confirm(`Tem certeza que deseja cancelar o agendamento de "${serviceTitle}"?`)) {
                    cancelBooking(serviceTitle);
                }
            });
        });

        // Adiciona evento para abrir o modal
        document.querySelectorAll('#bookings-grid .item-card').forEach(card => {
            card.addEventListener('click', () => {
                const cardData = card.dataset;
                const data = {
                    image: cardData.image,
                    title: cardData.title,
                    description: cardData.description,
                    subtext: cardData.subtext,
                    buttonText: "Agendado!" // O botão no modal mostrará que já está agendado
                };
                // A função openModal já existe globalmente por causa do modal.js
                openModal(data);
            });
        });
    };
    
    // Renderiza os agendamentos ao carregar a página
    renderBookings();
});