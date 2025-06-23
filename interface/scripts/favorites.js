document.addEventListener('DOMContentLoaded', () => {
    const favoritesGrid = document.getElementById('favorites-grid');
    const emptyMessage = document.getElementById('empty-favorites-message');

    const renderFavorites = () => {
        // Limpa a grade atual para evitar duplicação ao re-renderizar
        if(favoritesGrid) favoritesGrid.innerHTML = '';

        const favorites = JSON.parse(localStorage.getItem('petPalFavorites')) || [];

        if (favorites.length === 0) {
            if (emptyMessage) emptyMessage.classList.remove('hidden');
            if (favoritesGrid) favoritesGrid.classList.add('hidden');
        } else {
            if (emptyMessage) emptyMessage.classList.add('hidden');
            if (favoritesGrid) favoritesGrid.classList.remove('hidden');

            favorites.forEach(pet => {
                const petCard = document.createElement('div');
                petCard.className = 'item-card flex flex-col gap-3 pb-3 cursor-pointer transition-all hover:shadow-lg rounded-xl';
                
                // Adiciona os data-* atributos para que o modal.js os possa usar
                Object.keys(pet).forEach(key => {
                    petCard.dataset[key] = pet[key];
                });

                petCard.innerHTML = `
                    <div class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl" style="background-image: url('${pet.image}');"></div>
                    <div>
                        <p class="text-[#101914] text-base font-medium leading-normal">${pet.title}</p>
                        <p class="text-[#5a8c6e] text-sm font-normal leading-normal">${pet.description}</p>
                    </div>
                    <button class="remove-favorite-btn mt-2 mx-2 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full hover:bg-red-600">Remover</button>
                `;
                if(favoritesGrid) favoritesGrid.appendChild(petCard);
            });
            // Re-anexa os event listeners aos novos elementos criados
            addRemoveListeners();
            addModalListeners();
        }
    };

    /**
     * [NOVA LÓGICA] Remove o favorito com uma animação.
     * @param {string} petTitle - O título do pet a ser removido.
     * @param {HTMLElement} cardElement - O elemento do card a ser animado.
     */
    const removeFavorite = (petTitle, cardElement) => {
        // 1. Adiciona a classe que aciona a animação de 'fade out'
        cardElement.classList.add('removing');

        // 2. Espera a animação terminar (400ms)
        setTimeout(() => {
            // 3. Remove os dados do localStorage
            let favorites = JSON.parse(localStorage.getItem('petPalFavorites')) || [];
            favorites = favorites.filter(pet => pet.title !== petTitle);
            localStorage.setItem('petPalFavorites', JSON.stringify(favorites));
            
            // 4. Re-renderiza a lista de favoritos. O card já terá desaparecido visualmente.
            // Esta chamada irá reconstruir o DOM sem o elemento removido.
            renderFavorites();
        }, 400); // Duração deve corresponder à animação no CSS
    };

    const addRemoveListeners = () => {
        const removeButtons = document.querySelectorAll('.remove-favorite-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation(); // Impede que o modal abra ao clicar em remover
                const cardElement = event.target.closest('.item-card');
                const petTitle = cardElement.dataset.title;
                // Passa o elemento do card para a função de remover para ser animado
                removeFavorite(petTitle, cardElement);
            });
        });
    };
    
    const addModalListeners = () => {
        // Esta função garante que os novos cartões também abram o modal
        const itemCards = document.querySelectorAll('#favorites-grid .item-card');
        itemCards.forEach(card => {
            card.addEventListener('click', () => {
                // Se o card já está a ser removido, não abre o modal
                if (card.classList.contains('removing')) return;

                const cardData = card.dataset;
                 const data = {
                    image: cardData.image,
                    title: cardData.title,
                    description: cardData.description,
                    subtext: cardData.subtext,
                    buttonText: cardData.buttonText || 'Fechar'
                };
                // A função openModal já existe globalmente por causa de modal.js
                // Verifica se a função existe para evitar erros
                if (window.openModal) {
                    window.openModal(data); 
                }
            });
        });
    };
    
    // Renderiza os favoritos ao carregar a página
    renderFavorites();
});
