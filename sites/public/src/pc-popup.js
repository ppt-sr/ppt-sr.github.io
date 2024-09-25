// Esperar a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', function() {
    // Obtener los elementos
    const popup = document.getElementById('pc-popup');
    const buttonImg = document.getElementById('pc-button-img');
    const buttonText = document.getElementById('pc-button-text');

    // Función para mostrar el popup y posicionarlo por encima del botón
    function showPopup(event) {
        const button = event.target.closest('button');
        const rect = button.getBoundingClientRect(); // Obtener la posición y el tamaño del botón

        // Posicionar el popup centrado y encima del botón, ajustando el scroll
        popup.style.display = 'block';
        popup.style.left = rect.left + (rect.width / 2) - (popup.offsetWidth / 2) + 'px';
        popup.style.top = rect.top + window.scrollY - popup.offsetHeight - 10 + 'px'; // 10px para el espacio de la flecha

        // Prevenir que otros clics lo cierren inmediatamente
        event.stopPropagation();
    }

    // Añadir listeners a ambos botones
    buttonImg.addEventListener('click', showPopup);
    buttonText.addEventListener('click', showPopup);

    // Función para cerrar el popup cuando se haga clic fuera
    document.addEventListener('click', function(event) {
        if (!popup.contains(event.target)) {
            popup.style.display = 'none';
        }
    });
});
