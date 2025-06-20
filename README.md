# PetPal: Interface de E-commerce para Adoção e Venda de Produtos para Pets

Este projeto é uma interface de usuário para um site de e-commerce fictício chamado PetPal. O site oferece serviços de adoção de animais, uma loja de produtos e agendamento de serviços, tudo em uma plataforma coesa e interativa. A interface foi construída com foco na usabilidade e interatividade, utilizando HTML, Tailwind CSS e JavaScript.

## 🚀 Acesso ao Site

O projeto está hospedado no GitHub Pages e pode ser acessado através do seguinte link:

**[https://tung-a.github.io/EP-IHC/interface/home_page.html](https://tung-a.github.io/EP-IHC/interface/home_page.html)**

## ✨ Funcionalidades Principais

O site conta com as seguintes funcionalidades:

* **Navegação Completa**: Páginas interconectadas para Home, Adoção, Loja e Serviços.
* **Autenticação de Usuário**: Sistema de login e logout com persistência de sessão. Ao logar, o usuário `teste@petpal.com` com a senha `ihc2023` pode acessar funcionalidades exclusivas.
* **Busca e Filtragem**:
    * Busca global no cabeçalho da página inicial.
    * Filtros dinâmicos nas páginas de Adoção, Loja e Serviços para refinar os resultados por categoria, preço, avaliação, etc.
* **Carrinho de Compras Funcional**: Os usuários podem adicionar produtos ao carrinho, ajustar quantidades e remover itens. O estado do carrinho é salvo entre as sessões.
* **Modal de Detalhes**: Ao clicar em um item (pet, produto ou serviço), um modal com informações detalhadas é exibido.
* **Área do Usuário**: Após o login, um menu de perfil dá acesso a:
    * **Meus Favoritos**: Página para visualizar pets favoritados para adoção.
    * **Meus Agendamentos**: Visualize e cancele serviços agendados.
    * **Histórico de Compras**: Lista de todas as compras realizadas, com opção de limpar o histórico.
    * **Minha Conta**: Permite ao usuário visualizar e "salvar" alterações em suas informações.

## 🛠️ Tecnologias Utilizadas

* **HTML5**: Estrutura semântica para todas as páginas.
* **Tailwind CSS**: Framework CSS para estilização rápida e responsiva.
* **JavaScript (ES6+)**: Utilizado para criar toda a interatividade, manipulação do DOM e lógica do site.
* **Local Storage**: Para persistir o estado do usuário, carrinho, favoritos e agendamentos no navegador.

## 📁 Estrutura do Projeto

O código é organizado da seguinte forma:

* `.html` **files**: Contêm a estrutura base de cada página do site.
* `.js` **files**:
    * `auth.js`: Gerencia a autenticação e o estado de login/logout.
    * `cart.js` / `cart-page.js`: Controlam a lógica do carrinho de compras.
    * `modal.js`: Responsável por abrir, fechar e popular os modais de detalhes.
    * `favorites.js`, `bookings.js`, `order_history.js`: Gerenciam a lógica das respectivas páginas da conta do usuário.
    * `filter-logic.js`, `product-filter.js`, `service-filter.js`, `search.js`: Implementam as funcionalidades de busca e filtragem.