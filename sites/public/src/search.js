// Seleccionar los elementos necesarios
const searchResultsContainer = document.getElementById('search-results');
const searchBarX = document.getElementById('search-bar-input'); // Cambiado a 'searchBarX'
let data = [];

// Función para cargar datos desde el archivo JSON
async function loadData() {
    try {
        const response = await fetch('/jsons/ch1/strats.json'); // Ruta al archivo JSON
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        data = await response.json(); // Convertir la respuesta en JSON
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Llama a la función para cargar los datos
loadData();

// Evento input para buscar en tiempo real
searchBarX.addEventListener('input', () => { // Usar 'searchBarX'
    const searchTerm = searchBarX.value.trim().toLowerCase();
    
    // Si el campo de búsqueda está vacío, limpiar los resultados
    if (searchTerm === '') {
        searchResultsContainer.innerHTML = '';
        searchResultsContainer.style.display = 'none';
        return;
    }

    // Filtrar los resultados que coincidan con el término de búsqueda en title y description
    const filteredData = data.filter(item => 
        (item.title && item.title.toLowerCase().includes(searchTerm)) || 
        (item.description && item.description.toLowerCase().includes(searchTerm))
    );

    // Mostrar los resultados filtrados
    displayResults(filteredData);
});

// Función para mostrar los resultados en el contenedor
function displayResults(results) {
    // Limpiar los resultados anteriores
    searchResultsContainer.innerHTML = '';

    // Si no hay resultados, mostrar un mensaje
    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<p>No results found.</p>';
        searchResultsContainer.style.display = 'block';
        return;
    }

    // Crear un elemento para cada resultado
    results.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('search-result-item');
        resultItem.textContent = item.title; // Mostrar solo el title
        
        // Evento al hacer clic en un resultado
        resultItem.addEventListener('click', () => {
            alert(`Selected: ${item.title}`); // O realizar otra acción
        });

        searchResultsContainer.appendChild(resultItem);
    });

    // Mostrar el contenedor de resultados
    searchResultsContainer.style.display = 'block';
}
