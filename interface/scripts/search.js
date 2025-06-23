document.addEventListener('DOMContentLoaded', () => {
    const headerSearchInput = document.querySelector('header input[placeholder="Search"]');
    const searchableContainers = document.querySelectorAll('.searchable-container');
    const noResultsMessage = document.getElementById('no-results-message');
    
    // Seleciona todos os títulos das secções de forma mais robusta
    const sectionTitles = document.querySelectorAll('.section-title');

    const filterContent = () => {
        if (!headerSearchInput || searchableContainers.length === 0) return;
        
        const query = headerSearchInput.value.toLowerCase().trim();
        let totalVisibleItems = 0;

        // Itera sobre cada container de carrossel/secção
        searchableContainers.forEach(container => {
            let visibleItemsInSection = 0;
            // Itera sobre cada item (card) dentro do container
            for (const item of container.children) {
                // Garante que estamos a trabalhar com um elemento (ignora nós de texto)
                if (item.nodeType === 1) { 
                    const itemText = item.textContent.toLowerCase();
                    if (itemText.includes(query)) {
                        item.style.display = '';
                        visibleItemsInSection++;
                    } else {
                        item.style.display = 'none';
                    }
                }
            }
            totalVisibleItems += visibleItemsInSection;

            // Encontra o título associado a este container e controla a sua visibilidade
            const sectionId = container.getAttribute('data-section-id');
            const associatedTitle = document.getElementById(sectionId);
            
            if (associatedTitle) {
                 if (visibleItemsInSection > 0) {
                    associatedTitle.style.display = '';
                } else {
                    associatedTitle.style.display = 'none';
                }
            }
        });
        
        // Controla a visibilidade da mensagem "Nenhum resultado encontrado"
        if (totalVisibleItems === 0 && query !== '') {
            if (noResultsMessage) noResultsMessage.classList.remove('hidden');
        } else {
            if (noResultsMessage) noResultsMessage.classList.add('hidden');
        }
    };

    if (headerSearchInput) {
        headerSearchInput.addEventListener('input', filterContent);
    }
});
