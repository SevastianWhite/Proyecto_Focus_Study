// nav.js — abre y cierra el menú hamburguesa de las páginas privadas.
(function () {
    'use strict';

    var toggle = document.getElementById('fsNavToggle');
    var menu = document.getElementById('fsNavMenu');
    var zonaToggle = document.getElementById('fsNavZonaToggle');
    var zonaMenu = document.getElementById('fsNavZonaMenu');

    if (!toggle || !menu) { return; }

    // Cierra el menú principal y, de paso, el submenú de Zona de Estudio.
    function cerrarMenu() {
        menu.classList.remove('open');
        if (zonaMenu) { zonaMenu.classList.remove('open'); }
    }

    // Abrir o cerrar el menú al pulsar el botón hamburguesa.
    toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        if (menu.classList.contains('open')) {
            cerrarMenu();
        } else {
            menu.classList.add('open');
        }
    });

    // El submenú "Zona de Estudio" se abre y cierra por su cuenta.
    if (zonaToggle && zonaMenu) {
        zonaToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            zonaMenu.classList.toggle('open');
        });
    }

    // Cerrar si se hace clic fuera del menú.
    document.addEventListener('click', function (e) {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            cerrarMenu();
        }
    });

    // Cerrar con la tecla Escape.
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { cerrarMenu(); }
    });
}());
