document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const itemGrid = document.getElementById('item-grid');
  const items = itemGrid ? Array.from(itemGrid.children) : [];
  const searchInput = document.getElementById('main-search-input');

  const activeFilters = {
    category: null,
    brand: null,
    price: null,
  };

  // --- LÓGICA DE DROPDOWN APRIMORADA COM ANIMAÇÃO ---
  filterButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const dropdownId = button.getAttribute('data-dropdown');
      const dropdown = document.getElementById(dropdownId);
      const isActive = dropdown.classList.contains('is-active');

      // Fecha todos os outros dropdowns que estiverem abertos
      document.querySelectorAll('.filter-dropdown.is-active').forEach(d => {
        d.classList.remove('is-active');
      });

      // Se o dropdown clicado não estava ativo, ele o torna ativo
      if (!isActive) {
        dropdown.classList.add('is-active');
      }
    });
  });

  // Adiciona um listener global para fechar os dropdowns se o clique for fora deles
  window.addEventListener('click', (event) => {
    if (!event.target.closest('.filter-btn') && !event.target.closest('.filter-dropdown')) {
      document.querySelectorAll('.filter-dropdown.is-active').forEach(d => {
        d.classList.remove('is-active');
      });
    }
  });


  // --- LÓGICA PRINCIPAL DE FILTRAGEM ---
  const applyFilters = () => {
    const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';

    items.forEach(item => {
      const itemData = item.dataset;
      const itemText = item.textContent.toLowerCase();

      const searchMatch = searchQuery === '' || itemText.includes(searchQuery);
      const categoryMatch = !activeFilters.category || itemData.category === activeFilters.category;
      const brandMatch = !activeFilters.brand || itemData.brand === activeFilters.brand;

      let priceMatch = true;
      if (activeFilters.price) {
        const price = parseFloat(itemData.price);
        const [min, max] = activeFilters.price.split('-').map(parseFloat);
        priceMatch = price >= min && (isNaN(max) || price <= max);
      }

      if (searchMatch && categoryMatch && brandMatch && priceMatch) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  };

  // --- LISTENERS DOS ITENS DE FILTRO ---
  document.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', (event) => {
      event.preventDefault();
      const filterType = option.getAttribute('data-filter-type');
      const filterValue = option.getAttribute('data-filter-value');
      activeFilters[filterType] = filterValue;

      const button = document.querySelector(`[data-dropdown="${filterType}-dropdown"]`);
      const originalText = button.querySelector('p').getAttribute('data-original-text');
      button.querySelector('.filter-label').textContent = filterValue ? `${originalText}: ${option.textContent}` : originalText;

      // Fecha o dropdown após a seleção
      option.closest('.filter-dropdown').classList.remove('is-active');

      applyFilters();
    });
  });

  // Limpa filtros
  document.querySelectorAll('.clear-filter').forEach(clearButton => {
    clearButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const filterType = clearButton.getAttribute('data-filter-type');
      activeFilters[filterType] = null;

      const button = document.querySelector(`[data-dropdown="${filterType}-dropdown"]`);
      const originalText = button.querySelector('p').getAttribute('data-original-text');
      button.querySelector('.filter-label').textContent = originalText;

      // Fecha o dropdown após a ação
      clearButton.closest('.filter-dropdown').classList.remove('is-active');

      applyFilters();
    });
  });
  
  // Sincronização com as barras de busca
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
  const headerSearchInput = document.querySelector('header input[placeholder="Search"]');
  if (headerSearchInput && searchInput) {
    headerSearchInput.addEventListener('input', () => {
      searchInput.value = headerSearchInput.value;
      applyFilters();
    });
  }
});
