/*
 * nav.js — Lógica del menú de navegación desplegable
 * Focus Study — Área privada
 *
 * INCLUIR al final del <body> en todas las páginas privadas:
 *   <script src="{{ url_for('static', filename='js/nav.js') }}"></script>
 *
 * Requiere en el HTML:
 *   <button id="fsNavToggle" aria-controls="fsNavMenu" aria-expanded="false">
 *   <div    id="fsNavMenu"   class="fs-nav-menu">
 *
 * Sin dependencias externas. Compatible con todos los navegadores modernos.
 */
(function () {
    'use strict';

    var toggle = document.getElementById('fsNavToggle');
    var menu   = document.getElementById('fsNavMenu');

    if (!toggle || !menu) { return; }

    function openMenu() {
        menu.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    }

    /* Abrir / cerrar al pulsar el botón hamburguesa */
    toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        menu.classList.contains('open') ? closeMenu() : openMenu();
    });

    /* Cerrar al hacer clic fuera del menú */
    document.addEventListener('click', function (e) {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            closeMenu();
        }
    });

    /* Cerrar con la tecla Escape */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeMenu(); }
    });

    /* ── Sub-menú Zona de Estudio ── */
    var zonaToggle = document.getElementById('fsNavZonaToggle');
    var zonaMenu   = document.getElementById('fsNavZonaMenu');

    if (zonaToggle && zonaMenu) {
        zonaToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            var open = zonaMenu.classList.toggle('open');
            zonaToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    /* Al cerrar el menú principal también cerrar el sub-menú */
    var _origClose = closeMenu;
    closeMenu = function () {
        _origClose();
        if (zonaMenu) {
            zonaMenu.classList.remove('open');
            if (zonaToggle) zonaToggle.setAttribute('aria-expanded', 'false');
        }
    };
}());
