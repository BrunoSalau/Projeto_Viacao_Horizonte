/**
 * Viação Horizonte — script.js
 * Gerencia o comportamento responsivo da sidebar em dispositivos móveis.
 */

(function () {
    'use strict';

    const hamburgerBtn  = document.getElementById('hamburgerBtn');
    const closeBtn      = document.getElementById('closeBtn');
    const sidebar       = document.getElementById('barraLateral');
    const overlay       = document.getElementById('sidebarOverlay');

    /** Abre o menu lateral */
    function openSidebar() {
        sidebar.classList.add('is-open');
        overlay.classList.add('is-visible');
        hamburgerBtn.classList.add('is-open');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // impede scroll do fundo
    }

    /** Fecha o menu lateral */
    function closeSidebar() {
        sidebar.classList.remove('is-open');
        overlay.classList.remove('is-visible');
        hamburgerBtn.classList.remove('is-open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // Abre ao clicar no hambúrguer
    hamburgerBtn.addEventListener('click', function () {
        const isOpen = sidebar.classList.contains('is-open');
        isOpen ? closeSidebar() : openSidebar();
    });

    // Fecha ao clicar no botão "×" dentro da sidebar
    closeBtn.addEventListener('click', closeSidebar);

    // Fecha ao clicar no overlay
    overlay.addEventListener('click', closeSidebar);

    // Fecha com a tecla Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
            closeSidebar();
        }
    });

    // Garante reset ao redimensionar para desktop (evita sidebar travada)
    window.addEventListener('resize', function () {
        if (window.innerWidth > 576) {
            closeSidebar();
            document.body.style.overflow = '';
        }
    });

})();

document.getElementById('btnLogout').addEventListener('click', async () => {
    await fetch('/usuario/logout', { method: 'POST' });
    localStorage.removeItem('token');
    localStorage.removeItem('tipo');
    window.location.href = '/';
});