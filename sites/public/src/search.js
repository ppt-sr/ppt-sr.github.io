// Mapeo de archivos JSON según la URL
const jsonFilesMapping = {
    '/chapter-1/pc/strats/': '/jsons/ch1/strats.json',
    '/chapter-2/pc/strats/': '/jsons/ch2/strats.json',
    '/chapter-3/pc/strats/': '/jsons/ch3/strats.json',
    '/chapter-1/pc/guides/': '/jsons/ch1/guides.json',
    '/chapter-2/pc/guides/': '/jsons/ch2/guides.json',
    '/chapter-3/pc/guides/': '/jsons/ch3/guides.json',
    // Añadir más rutas y archivos JSON según sea necesario
};

// Seleccionar los elementos necesarios
const searchResultsContainer = document.getElementById('search-results');
const searchBarX = document.getElementById('search-bar-input');
let allData = []; // Array para almacenar todos los datos de los JSON

// Función para cargar todos los datos de los archivos JSON
async function loadAllData() {
    const jsonFiles = Object.entries(jsonFilesMapping); // Obtener pares [ruta, archivo]

    const loadPromises = jsonFiles.map(async ([url, jsonFile]) => {
        try {
            const response = await fetch(jsonFile);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            // Agregar la URL a cada elemento y asegurarse de que cada objeto tenga la URL
            const enrichedData = data.map(item => ({ ...item, url })); // Añadir la URL a cada item
            allData.push(...enrichedData);
        } catch (error) {
            console.error(`Error loading data from ${jsonFile}:`, error);
        }
    });

    await Promise.all(loadPromises);
}

// Llama a la función para cargar todos los datos
loadAllData();

// Evento input para buscar en tiempo real
searchBarX.addEventListener('input', () => {
    const searchTerm = searchBarX.value.trim().toLowerCase();

    // Si el campo de búsqueda está vacío, limpiar los resultados
    if (searchTerm === '') {
        searchResultsContainer.innerHTML = '';
        searchResultsContainer.style.display = 'none';
        return;
    }

    // Filtrar los resultados que coincidan con el término de búsqueda en title y description
    const filteredData = allData.filter(item => 
        (item.title && item.title.toLowerCase().includes(searchTerm)) || 
        (item.description && item.description.toLowerCase().includes(searchTerm))
    );

    // Mostrar los resultados filtrados
    displayResults(filteredData);
});

// Función para mostrar los resultados en el contenedor
function displayResults(results) {
    searchResultsContainer.innerHTML = ''; // Limpiar los resultados anteriores

    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<p>No results found.</p>';
        searchResultsContainer.style.display = 'block';
        return;
    }

    results.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('search-result-item');
        resultItem.textContent = item.title; // Mostrar solo el title

        // Evento al hacer clic en un resultado
        resultItem.addEventListener('click', () => {
            // Redirigir a la URL correspondiente con el ID del skip como hash
            const targetUrl = item.url + '#' + item.id; // Usar el id del item del JSON
            window.location.href = targetUrl; // Redirigir a la URL
        });

        searchResultsContainer.appendChild(resultItem);
    });

    searchResultsContainer.style.display = 'block'; // Mostrar el contenedor de resultados
}
