document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const itemGrid = document.getElementById('item-grid');
  const items = itemGrid ? Array.from(itemGrid.children) : [];
  const searchInput = document.getElementById('main-search-input');

  const activeFilters = {
    type: null,
    rating: null,
    price: null,
  };

  // Lógica para abrir/fechar dropdowns
  filterButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const dropdownId = button.getAttribute('data-dropdown');
      const dropdown = document.getElementById(dropdownId);
      
      document.querySelectorAll('.filter-dropdown').forEach(d => {
        if (d.id !== dropdownId) d.classList.add('hidden');
      });
      dropdown.classList.toggle('hidden');
    });
  });

  window.addEventListener('click', () => {
    document.querySelectorAll('.filter-dropdown').forEach(d => d.classList.add('hidden'));
  });

  // Lógica principal de filtro
  const applyFilters = () => {
    const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';

    items.forEach(item => {
      const itemData = item.dataset;
      const itemText = item.textContent.toLowerCase();

      const searchMatch = searchQuery === '' || itemText.includes(searchQuery);
      const typeMatch = !activeFilters.type || itemData.type === activeFilters.type;
      const ratingMatch = !activeFilters.rating || parseInt(itemData.rating) >= parseInt(activeFilters.rating);

      let priceMatch = true;
      if (activeFilters.price) {
        const price = parseFloat(itemData.price);
        const [min, max] = activeFilters.price.split('-').map(parseFloat);
        priceMatch = price >= min && (isNaN(max) || price <= max);
      }
      
      if (searchMatch && typeMatch && ratingMatch && priceMatch) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  };

  // Adiciona listeners aos itens de filtro
  document.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', (event) => {
      event.preventDefault();
      const filterType = option.getAttribute('data-filter-type');
      const filterValue = option.getAttribute('data-filter-value');
      activeFilters[filterType] = filterValue;
      
      const button = document.querySelector(`[data-dropdown="${filterType}-dropdown"]`);
      const originalText = button.querySelector('p').getAttribute('data-original-text');
      button.querySelector('.filter-label').textContent = filterValue ? `${originalText}: ${option.textContent}` : originalText;
      
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

      applyFilters();
    });
  });

  if(searchInput) {
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