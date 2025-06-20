document.addEventListener('DOMContentLoaded', () => {
  // --- Elementos da DOM ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const petGrid = document.getElementById('pet-grid');
  const pets = petGrid ? Array.from(petGrid.children) : [];
  const searchInput = document.getElementById('main-search-input');

  // Objeto para armazenar os filtros ativos
  const activeFilters = {
    species: null,
    size: null,
    age: null,
    location: null,
  };

  // --- Lógica para Abrir/Fechar Dropdowns ---
  filterButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      // Impede que o clique no botão feche o menu imediatamente
      event.stopPropagation();
      const dropdownId = button.getAttribute('data-dropdown');
      const dropdown = document.getElementById(dropdownId);
      
      // Fecha outros dropdowns abertos
      document.querySelectorAll('.filter-dropdown').forEach(d => {
        if (d.id !== dropdownId) {
          d.classList.add('hidden');
        }
      });

      // Abre ou fecha o dropdown atual
      dropdown.classList.toggle('hidden');
    });
  });

  // Fecha todos os dropdowns se o usuário clicar fora deles
  window.addEventListener('click', () => {
    document.querySelectorAll('.filter-dropdown').forEach(d => {
      d.classList.add('hidden');
    });
  });

  // --- Lógica de Filtro ---
  const applyFilters = () => {
    const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';

    pets.forEach(pet => {
      const petData = pet.dataset;
      const petText = pet.textContent.toLowerCase();

      // 1. Verifica a correspondência com a busca de texto
      const searchMatch = searchQuery === '' || petText.includes(searchQuery);

      // 2. Verifica a correspondência com os filtros de dropdown
      const speciesMatch = !activeFilters.species || petData.species === activeFilters.species;
      const sizeMatch = !activeFilters.size || petData.size === activeFilters.size;
      const ageMatch = !activeFilters.age || petData.age === activeFilters.age;
      const locationMatch = !activeFilters.location || petData.location.toLowerCase().includes(activeFilters.location.toLowerCase());

      // O pet só é exibido se corresponder a TODOS os critérios
      if (searchMatch && speciesMatch && sizeMatch && ageMatch && locationMatch) {
        pet.style.display = '';
      } else {
        pet.style.display = 'none';
      }
    });
  };

  // Adiciona listeners aos itens dos dropdowns
  document.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', (event) => {
      event.preventDefault();
      const filterType = option.getAttribute('data-filter-type');
      const filterValue = option.getAttribute('data-filter-value');
      
      // Atualiza o estado do filtro
      activeFilters[filterType] = filterValue;

      // Atualiza o texto do botão do filtro
      const button = document.querySelector(`[data-dropdown="${filterType}-dropdown"]`);
      const originalText = button.querySelector('p').getAttribute('data-original-text');
      button.querySelector('.filter-label').textContent = filterValue ? `${originalText}: ${option.textContent}` : originalText;
      
      // Aplica os filtros
      applyFilters();
    });
  });
  
  // Limpa um filtro específico
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


  // Aplica o filtro ao digitar na barra de busca principal
  if(searchInput) {
      searchInput.addEventListener('input', applyFilters);
  }
  
   // Lógica da Busca no Cabeçalho (sincroniza com a busca principal)
    const headerSearchInput = document.querySelector('header input[placeholder="Search"]');
    if (headerSearchInput && searchInput) {
        headerSearchInput.addEventListener('input', () => {
            searchInput.value = headerSearchInput.value;
            applyFilters();
        });
    }
});