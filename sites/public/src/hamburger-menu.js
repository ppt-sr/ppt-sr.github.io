document.getElementById("menu-toggle").addEventListener("click", function () {
    const menu = document.getElementById("mobile-menu");
    const overlay = document.getElementById("overlay");

    // Toggle clases para abrir/cerrar el menú y overlay
    menu.classList.toggle("open");
    overlay.classList.toggle("visible");
});

// Cerrar el menú y el overlay al hacer clic fuera del menú
document.addEventListener("click", function (event) {
    const menu = document.getElementById("mobile-menu");
    const menuToggle = document.getElementById("menu-toggle");
    const overlay = document.getElementById("overlay");

    // Verificar si el clic ocurrió fuera del menú y el botón del menú
    if (overlay.contains(event.target)) {
        menu.classList.remove("open");
        overlay.classList.remove("visible");
    }
});
