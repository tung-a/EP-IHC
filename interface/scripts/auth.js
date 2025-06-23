document.addEventListener('DOMContentLoaded', function() {

    // --- LÓGICA COMPARTILHADA ---
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginButtonContainer = document.getElementById('login-button-container');

    // --- ATUALIZAÇÃO DO CABEÇALHO ---
    if (loginButtonContainer) {
        if (isLoggedIn) {
            // Se logado, insere o HTML do menu dropdown.
            loginButtonContainer.innerHTML = `
                <div class="relative">
                    <button id="profile-menu-button" class="block rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDmDKxRrWbweQy2ts30XwT_YS4xrzaVZpQeno4ZTM3BYEpul0vA9yQZvYvEnXVNFlNUtPFK1AEIJlh9KjkIEL5v121ZPu7NZjWUfThuu7Ft4GsVgWcmUuLg8_EvHYGx8yHQrc9srDl81eeQ4j1Tac2LcKGMfgsFQm3u2ByBjQtvvgiEj7qRPbac-E4wpF95aE2vm2N3uSnV9G9iiV7tZD-afP6pftqpvY_yL4oOq1v7jKeawCPwSLd0pSBCATwc8lfoT6__TqopHnU");'></div>
                    </button>
                    <div id="profile-menu-dropdown" class="hidden absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                        <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="profile-menu-button">
                            <div class="px-4 py-2"><p class="text-sm text-gray-700">Logado como</p><p class="text-sm font-medium text-gray-900 truncate">teste@petpal.com</p></div>
                            <div class="border-t border-gray-100"></div>
                            <a href="my_account_page.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Minha Conta</a>
                            <a href="favorites_page.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Meus Favoritos</a>
                            <a href="order_history.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Histórico de Compras</a>
                            <a href="bookings_page.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Serviços Agendados</a>
                            <div class="border-t border-gray-100"></div>
                            <button id="logout-button" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100" role="menuitem">Sair</button>
                        </div>
                    </div>
                </div>`;
            
            // --- Lógica para controlar o dropdown ---
            const menuButton = document.getElementById('profile-menu-button');
            const dropdown = document.getElementById('profile-menu-dropdown');
            if(menuButton) {
                menuButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    dropdown.classList.toggle('hidden');
                });
            }
            window.addEventListener('click', (event) => {
                if (dropdown && !dropdown.classList.contains('hidden') && !menuButton.contains(event.target)) {
                    dropdown.classList.add('hidden');
                }
            });

            // Adiciona evento de clique ao botão de logout
            const logoutButton = document.getElementById('logout-button');
            if(logoutButton) {
                logoutButton.addEventListener('click', () => {
                    localStorage.removeItem('isLoggedIn');
                    window.location.reload(); 
                });
            }
        } else {
            // Se não estiver logado, mostra o botão de Login
            loginButtonContainer.innerHTML = `<a href="login.html" class="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-[#e8f2ec] text-[#101914] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4">Login</a>`;
        }
    }

    // --- LÓGICA DA PÁGINA DE LOGIN (Aprimorada) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalButtonHtml = submitButton.innerHTML;

        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');

            // [NOVO] Adiciona estado de carregamento ao botão
            submitButton.disabled = true;
            submitButton.classList.add('btn-loading');
            submitButton.innerHTML = `
                <div class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    A entrar...
                </div>`;

            // Simula uma verificação de rede (atraso de 1 segundo)
            setTimeout(() => {
                if (email === 'teste@petpal.com' && password === 'ihc2023') {
                    localStorage.setItem('isLoggedIn', 'true');
                    window.location.href = 'home_page.html';
                } else {
                    errorMessage.textContent = 'Email ou palavra-passe inválidos.';
                    errorMessage.style.display = 'block';
                    
                    // Restaura o botão em caso de erro
                    submitButton.disabled = false;
                    submitButton.classList.remove('btn-loading');
                    submitButton.innerHTML = originalButtonHtml;
                }
            }, 1000);
        });
    }
});
