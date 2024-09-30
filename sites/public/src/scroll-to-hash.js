// Esperar a que la página cargue completamente
window.addEventListener('load', () => {
    // Verificar si hay un hash en la URL
    const targetHash = window.location.hash;
    if (targetHash) {
        const targetId = targetHash.substring(1); // Eliminar el '#' al obtener el ID
        const scrollToElement = () => {
            const targetElement = document.getElementById(targetId); // Seleccionar el elemento por ID

            if (targetElement) {
                // Si se encuentra el elemento, hacer scroll hacia él
                targetElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Si no se encuentra el elemento, hacer scroll hacia abajo
                window.scrollBy(0, window.innerHeight); // Scroll hacia abajo por la altura de la ventana

                // Verificar nuevamente si el elemento está en la vista
                setTimeout(scrollToElement, 500); // Volver a verificar después de 500 ms
            }
        };

        // Iniciar el proceso de scroll
        scrollToElement();
    }
});
