document.addEventListener('DOMContentLoaded', () => {
    const favoritesGrid = document.getElementById('favorites-grid');
    const emptyMessage = document.getElementById('empty-favorites-message');

    const renderFavorites = () => {
        // Limpa a grade atual para evitar duplicação
        favoritesGrid.innerHTML = '';

        const favorites = JSON.parse(localStorage.getItem('petPalFavorites')) || [];

        if (favorites.length === 0) {
            emptyMessage.classList.remove('hidden');
            favoritesGrid.classList.add('hidden');
        } else {
            emptyMessage.classList.add('hidden');
            favoritesGrid.classList.remove('hidden');

            favorites.forEach(pet => {
                const petCard = document.createElement('div');
                petCard.className = 'item-card flex flex-col gap-3 pb-3 cursor-pointer transition-all hover:shadow-lg rounded-xl';
                // Adiciona os data-* atributos para que o modal.js possa usá-los
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
                favoritesGrid.appendChild(petCard);
            });
            addRemoveListeners();
            addModalListeners();
        }
    };

    const addRemoveListeners = () => {
        const removeButtons = document.querySelectorAll('.remove-favorite-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.stopPropagation(); // Impede que o modal abra ao clicar em remover
                const petTitle = event.target.closest('.item-card').dataset.title;
                removeFavorite(petTitle);
            });
        });
    };
    
    const addModalListeners = () => {
        // Esta função garante que os novos cartões também abram o modal
        const itemCards = document.querySelectorAll('#favorites-grid .item-card');
        itemCards.forEach(card => {
            card.addEventListener('click', () => {
                const cardData = card.dataset;
                 const data = {
                    image: cardData.image,
                    title: cardData.title,
                    description: cardData.description,
                    subtext: cardData.subtext,
                    buttonText: cardData.buttonText || 'Fechar'
                };
                // A função openModal já existe globalmente por causa do modal.js
                openModal(data); 
            });
        });
    };

    const removeFavorite = (petTitle) => {
        let favorites = JSON.parse(localStorage.getItem('petPalFavorites')) || [];
        favorites = favorites.filter(pet => pet.title !== petTitle);
        localStorage.setItem('petPalFavorites', JSON.stringify(favorites));
        renderFavorites(); // Re-renderiza a lista para refletir a remoção
    };
    
    // Renderiza os favoritos ao carregar a página
    renderFavorites();
});