document.addEventListener('DOMContentLoaded', () => {

    const headerSearchInput = document.querySelector('header input[placeholder="Search"]');
    const searchableContainers = document.querySelectorAll('.searchable-container');
    const noResultsMessage = document.getElementById('no-results-message');
    
    // Seleciona os títulos das seções
    const adoptionTitle = document.getElementById('adoption-showcase-title');
    const storeTitle = document.getElementById('store-showcase-title');
    const servicesTitle = document.getElementById('services-showcase-title');

    const filterContent = () => {
        if (!headerSearchInput || searchableContainers.length === 0) return;
        
        const query = headerSearchInput.value.toLowerCase();
        let totalVisibleItems = 0;

        searchableContainers.forEach(container => {
            let visibleItemsInSection = 0;
            for (const item of container.children) {
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

            // Esconde o título da seção se não houver itens visíveis nela
            const sectionTitle = container.parentElement.previousElementSibling;
            if (sectionTitle && sectionTitle.tagName === 'H2') {
                 if(visibleItemsInSection > 0) {
                    sectionTitle.style.display = '';
                } else {
                    sectionTitle.style.display = 'none';
                }
            }
        });
        
        // Controla a visibilidade da mensagem "Nenhum resultado encontrado"
        if (totalVisibleItems === 0 && query !== '') {
            if(noResultsMessage) noResultsMessage.classList.remove('hidden');
        } else {
            if(noResultsMessage) noResultsMessage.classList.add('hidden');
        }
    };

    if (headerSearchInput) {
        headerSearchInput.addEventListener('input', filterContent);
    }
});