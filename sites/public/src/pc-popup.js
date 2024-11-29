document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('pc-popup');
    const buttonImg = document.getElementById('pc-button-img');
    let hoverTarget = false; // Variable para rastrear si el mouse está en el trigger o el popup

    // Función para mostrar el popup
    function showPopup(event) {
        const target = event.currentTarget;
        const rect = target.getBoundingClientRect();

        // Posicionar el popup
        popup.style.left = rect.left + (rect.width / 2) - (popup.offsetWidth / 2) + 'px';
        popup.style.top = rect.top + window.scrollY - popup.offsetHeight + 10 + 'px'; // 10px para espacio

        // Activar la animación de entrada
        popup.classList.remove('closing');
        popup.classList.add('opened');
    }

    // Función para ocultar el popup
    function hidePopup() {
        if (!hoverTarget) {
            popup.classList.remove('opened');
            popup.classList.add('closing'); // Activar la animación de salida

            // Esperar a que termine la animación antes de ocultar completamente
            setTimeout(() => {
                if (!popup.classList.contains('opened')) {
                    popup.style.display = 'none';
                }
            }, 300); // Duración de la animación en milisegundos
        }
    }

    // Manejar el estado de hover
    function setHoverState(state) {
        hoverTarget = state;
        if (state) {
            popup.style.display = 'block'; // Mostrar el popup si el hover está activo
        }
    }

    // Añadir listeners de hover a los activadores
    [buttonImg].forEach(element => {
        element.addEventListener('mouseenter', event => {
            setHoverState(true);
            showPopup(event);
        });
        element.addEventListener('mouseleave', () => {
            setHoverState(false);
            setTimeout(hidePopup, 100); // Pequeño retraso para suavizar
        });
    });

    // Manejar eventos en el popup
    popup.addEventListener('mouseenter', () => setHoverState(true));
    popup.addEventListener('mouseleave', () => {
        setHoverState(false);
        setTimeout(hidePopup, 100);
    });
});
