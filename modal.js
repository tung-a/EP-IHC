document.addEventListener('DOMContentLoaded', () => {
  // --- Elementos do Modal ---
  const modal = document.getElementById('details-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const closeModalButton = document.getElementById('close-modal-btn');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalSubtext = document.getElementById('modal-subtext');
  const modalActionButton = document.getElementById('modal-action-button');
  const modalConfirmation = document.getElementById('modal-confirmation');

  // --- Funções para gerenciar o localStorage ---
  const getFavorites = () => JSON.parse(localStorage.getItem('petPalFavorites')) || [];
  const saveFavorites = (favorites) => localStorage.setItem('petPalFavorites', JSON.stringify(favorites));
  const isFavorite = (petTitle) => getFavorites().some(pet => pet.title === petTitle);
  const getCart = () => JSON.parse(localStorage.getItem('petPalCart')) || [];
  const saveCart = (cart) => localStorage.setItem('petPalCart', JSON.stringify(cart));
  const getBookings = () => JSON.parse(localStorage.getItem('petPalBookings')) || [];
  const saveBookings = (bookings) => localStorage.setItem('petPalBookings', JSON.stringify(bookings));
  const isBooked = (serviceTitle) => getBookings().some(service => service.title === serviceTitle);

  // --- Função de Feedback Visual ---
  const showConfirmation = (message) => {
    const confirmationText = modalConfirmation.querySelector('p');
    if (!confirmationText) return;

    confirmationText.textContent = message;
    
    modalActionButton.classList.add('hidden');
    modalConfirmation.classList.remove('hidden');
  };
  
  // --- Função para fechar o modal (e resetar o feedback) ---
  const closeModal = () => {
    if (modal) {
      modal.classList.add('hidden');
      if(modalConfirmation) {
        modalActionButton.classList.remove('hidden');
        modalConfirmation.classList.add('hidden');
      }
    }
  };

  // --- Função para abrir e popular o modal ---
  const openModal = (data) => {
    if (!modal) return;

    modalActionButton.classList.remove('hidden');
    modalConfirmation.classList.add('hidden');

    modalImage.style.backgroundImage = `url(${data.image})`;
    modalTitle.textContent = data.title;
    modalDescription.textContent = data.description;
    modalSubtext.textContent = data.subtext;
    
    // --- LÓGICA DO BOTÃO DE AÇÃO ---
    
    if (data.buttonText === 'Adicionar aos Favoritos') {
      if (isFavorite(data.title)) {
        modalActionButton.textContent = 'Adicionado!';
        modalActionButton.disabled = true;
        modalActionButton.className = 'px-4 py-2 bg-gray-400 text-white text-base font-medium rounded-md w-full shadow-sm';
      } else {
        modalActionButton.textContent = 'Adicionar aos Favoritos';
        modalActionButton.disabled = false;
        modalActionButton.className = 'px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300';
        
        modalActionButton.onclick = (event) => {
          event.stopPropagation(); // <-- **A CORREÇÃO ESTÁ AQUI**
          const favorites = getFavorites();
          favorites.push(data);
          saveFavorites(favorites);
          showConfirmation('✅ Adicionado aos Favoritos!');
        };
      }
    } 
    else if (data.buttonText === 'Add to Cart') {
        modalActionButton.textContent = 'Add to Cart';
        modalActionButton.disabled = false;
        modalActionButton.className = 'px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300';

        modalActionButton.onclick = (event) => {
            event.stopPropagation(); // <-- **A CORREÇÃO ESTÁ AQUI**
            let cart = getCart();
            const productInCart = cart.find(item => item.title === data.title);
            if (productInCart) {
                productInCart.quantity += 1;
            } else {
                cart.push({ ...data, quantity: 1 });
            }
            saveCart(cart);
            if (window.updateCartIcon) window.updateCartIcon();
            showConfirmation('✅ Adicionado ao Carrinho!');
        };
    }
    else if (data.buttonText === 'Book Now') {
        if (isBooked(data.title)) {
            modalActionButton.textContent = 'Agendado!';
            modalActionButton.disabled = true;
            modalActionButton.className = 'px-4 py-2 bg-gray-400 text-white text-base font-medium rounded-md w-full shadow-sm';
        } else {
            modalActionButton.textContent = 'Book Now';
            modalActionButton.disabled = false;
            modalActionButton.className = 'px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300';

            modalActionButton.onclick = (event) => {
                event.stopPropagation(); // <-- **A CORREÇÃO ESTÁ AQUI**
                const bookings = getBookings();
                bookings.push(data);
                saveBookings(bookings);
                showConfirmation('✅ Serviço Agendado!');
            };
        }
    }
    else {
      modalActionButton.textContent = data.buttonText;
      modalActionButton.disabled = false;
      modalActionButton.className = 'px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300';
      modalActionButton.onclick = null;
    }

    modal.classList.remove('hidden');
  };
  
  if (closeModalButton) closeModalButton.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

  const itemCards = document.querySelectorAll('.item-card');
  itemCards.forEach(card => {
    card.addEventListener('click', () => {
      const cardData = card.dataset;
      const data = {
        image: cardData.image,
        title: cardData.title,
        description: cardData.description,
        subtext: cardData.subtext,
        price: cardData.price,
        buttonText: cardData.buttonText || 'Fechar'
      };
      openModal(data);
    });
  });
});