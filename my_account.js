document.addEventListener('DOMContentLoaded', () => {
    const accountForm = document.getElementById('account-form');
    const saveButton = document.getElementById('save-changes-btn');

    if (accountForm && saveButton) {
        accountForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o recarregamento da página

            // Estado original do botão
            const originalButtonText = 'Salvar Alterações';
            
            // 1. Estado de "Salvando..."
            saveButton.disabled = true;
            saveButton.innerHTML = `
                <div class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                </div>`;

            // 2. Simula o salvamento e muda para "Salvo!"
            setTimeout(() => {
                saveButton.classList.remove('bg-green-500', 'hover:bg-green-600');
                saveButton.classList.add('bg-blue-500');
                saveButton.innerHTML = 'Salvo com Sucesso! ✅';

                // 3. Volta ao estado original após um tempo
                setTimeout(() => {
                    saveButton.innerHTML = originalButtonText;
                    saveButton.disabled = false;
                    saveButton.classList.remove('bg-blue-500');
                    saveButton.classList.add('bg-green-500', 'hover:bg-green-600');
                }, 2000); // Fica no estado de "Salvo" por 2 segundos

            }, 1500); // Simula o tempo de salvamento de 1.5 segundos
        });
    }
});