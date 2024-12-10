// Mapeo de archivos JSON según la URL
const jsonFilesMapping = {
    '/chapter-1/pc/strats/': '/jsons/ch1/strats.json',
    '/chapter-2/pc/strats/': '/jsons/ch2/strats.json',
    '/chapter-3/pc/strats/': '/jsons/ch3/strats.json',
    '/chapter-1/pc/guides/': '/jsons/ch1/guides.json',
    '/chapter-2/pc/guides/': '/jsons/ch2/guides.json',
    '/chapter-2/mobile/': '/jsons/ch2/mobile.json',
    '/chapter-3/pc/guides/': '/jsons/ch3/guides.json',
    // Añadir más rutas y archivos JSON según sea necesario
};

function getChapterIcon(chapter) {
    switch (chapter) {
        case 1:
            return '/images/svgs/c1.svg'; 
        case 2:
            return '/images/svgs/c2.svg';
        case 3:
            return '/images/svgs/c3.svg';
        default:
            return '/images/bunzo_nerdge.webp'; 
    }
}

function getPlatformIcon(url) {
    if (url.includes('/pc/')) {
        return '/images/svgs/pc-icon.svg'; // Cambia la ruta a tu ícono de PC
    } else if (url.includes('/mobile/')) {
        return '/images/svgs/mobile-icon.svg'; // Cambia la ruta a tu ícono de móvil
    } else if (url.includes('/console/')) {
        return '/images/svgs/console-icon.svg'; // Cambia la ruta a tu ícono de consola
    }
    return '/images/svgs/default-icon.svg'; // Ícono por defecto
}


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

            // Determinar el tipo y el capítulo según la URL
            const type = url.includes('/guides/') ? 'guide' : 'strat';
            const chapterMatch = url.match(/chapter-(\d+)/);
            const chapter = chapterMatch ? parseInt(chapterMatch[1]) : null;

            // Agregar la URL, tipo, capítulo y plataforma a cada elemento
            const enrichedData = data.map(item => ({
                ...item,
                url,
                type,
                chapter,
                platform: getPlatformIcon(url) // Obtener el ícono de la plataforma
            }));

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

    // Limitar los resultados a un máximo de 15
    const limitedResults = results.slice(0, 15);

    limitedResults.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('search-result-item');

        // Crear un contenedor flex para el título
        const titleContainer = document.createElement('div');
        titleContainer.classList.add('title-container');

        // Crear un elemento para el título
        const titleElement = document.createElement('span');
        titleElement.textContent = item.title;

        // Añadir el título al contenedor
        titleContainer.appendChild(titleElement);

        // Crear un contenedor para los iconos
        const iconsContainer = document.createElement('div');
        iconsContainer.classList.add('icons-container'); // Añadir una clase para estilos si es necesario

        // Crear un ícono para la plataforma
        const platformIcon = document.createElement('img');
        platformIcon.src = item.platform; // Obtener el ícono de la plataforma desde los datos enriquecidos
        platformIcon.alt = 'Plataforma Icono';
        platformIcon.classList.add('platform-icon'); // Añadir una clase para estilos si es necesario

        // Crear un ícono para el tipo (guía o estrategia)
        const typeIcon = document.createElement('img'); // O <i> para iconos de fuente
        typeIcon.src = item.type === 'guide' ? '/images/svgs/guide.svg' : '/images/svgs/strat.svg';
        typeIcon.alt = item.type === 'guide' ? 'Guía Icono' : 'Estrategia Icono';
        typeIcon.classList.add('result-icon'); // Añadir una clase para estilos si es necesario

        // Crear un ícono para el capítulo
        const chapterIcon = document.createElement('img');
        chapterIcon.src = getChapterIcon(item.chapter); // Llama a la función para obtener el ícono del capítulo
        chapterIcon.alt = `Capítulo ${item.chapter}`;
        chapterIcon.classList.add('chapter-icon'); // Añadir una clase para estilos si es necesario

        // Añadir los íconos al contenedor de iconos
        iconsContainer.appendChild(platformIcon); // Añadir el ícono de la plataforma
        iconsContainer.appendChild(typeIcon);
        iconsContainer.appendChild(chapterIcon);

        // Añadir el contenedor de título y el contenedor de íconos al item de resultado
        resultItem.appendChild(titleContainer);
        resultItem.appendChild(iconsContainer);

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