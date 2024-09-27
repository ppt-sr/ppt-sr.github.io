document.addEventListener('DOMContentLoaded', function() {
    // Obtener los elementos
    const popup = document.getElementById('info-popup');
    const buttonImg = document.getElementById('filters-info');

    // Función para mostrar el popup y posicionarlo sin que cambie de lugar
    function showPopup(event) {
        const button = event.currentTarget; // El botón clickeado
        const rect = button.getBoundingClientRect(); // Obtener la posición y el tamaño del botón

        // Solo mostrar el popup si no está visible
        if (popup.style.display !== 'block') {
            // Mostrar el popup para calcular su tamaño si está oculto
            popup.style.display = 'block';

        } else {
            // Si ya está visible, cerrarlo
            popup.style.display = 'none';
        }

        // Prevenir que otros clics cierren el popup inmediatamente
        event.stopPropagation();
    }

    // Añadir listener al botón de imagen
    buttonImg.addEventListener('click', showPopup);

    // Función para cerrar el popup cuando se haga clic fuera
    document.addEventListener('click', function(event) {
        if (!popup.contains(event.target)) {
            popup.style.display = 'none';
        }
    });

    // Prevenir que el popup se cierre al hacer clic en su interior
    popup.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});
