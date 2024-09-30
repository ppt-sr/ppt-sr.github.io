// Selecciona los elementos
const searchBar = document.getElementById('filter-search-bar');
const searchBarInput = document.getElementById('search-bar-input');
const searchIcon = document.getElementById('search-icon'); // Ícono de la lupa

// Variable para verificar si la barra está expandida
let isExpanded = false;

// Añade el evento de clic a la barra de búsqueda para expandir
searchBar.addEventListener('click', () => {
    if (!isExpanded) {
        expandSearchBar();
    }
});

// Evento input para controlar la expansión/contracción
searchBarInput.addEventListener('input', () => {
    if (searchBarInput.value === '') {
        // Si está vacío, contraer
        contractSearchBar();
    } else if (!isExpanded) {
        // Si se empieza a escribir después de estar vacío, expandir
        expandSearchBar();
    }
});

// Evento para seleccionar el texto cuando se hace clic en la lupa
searchIcon.addEventListener('click', () => {
    if (searchBarInput.value !== '') {
        // Si hay texto en el campo, seleccionarlo
        searchBarInput.select();
    } else {
        // Si el campo está vacío, expandir la barra para que el usuario pueda escribir
        expandSearchBar();
        searchBarInput.focus(); // Poner el foco en el campo de texto
    }
});

// Evento global para detectar clics fuera de la barra de búsqueda
document.addEventListener('click', (event) => {
    // Si el campo está vacío y se hizo clic fuera de la barra de búsqueda
    if (!searchBar.contains(event.target) && searchBarInput.value === '') {
        contractSearchBar();
    }
});

// Función para expandir la barra de búsqueda
function expandSearchBar() {
    searchBar.classList.add('expanded');
    isExpanded = true;
}

// Función para contraer la barra de búsqueda
function contractSearchBar() {
    searchBar.classList.remove('expanded');
    isExpanded = false;
}
