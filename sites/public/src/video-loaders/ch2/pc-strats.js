const isMobile = window.matchMedia("(max-width: 1023px)").matches;
let currentBatch = 0;
const batchSize = 5;
let filteredData = [];
let selectedVideoId = null; // Variable para almacenar el ID del video seleccionado
const storagePrefix = 'pc-ch2-';
let translations = {}; // Objeto para almacenar las traducciones
let currentLang = localStorage.getItem('selectedLanguage') || 'en'; // Obtener el idioma almacenado o por defecto 'en'

// Obtener el ID del video del hash en la URL
const hash = window.location.hash.substring(1); // Remover el '#' del inicio
if (hash) {
    selectedVideoId = hash; // Establecer el ID del video seleccionado basado en el hash
}

// Fetch y almacenar las traducciones para el idioma seleccionado
function loadTranslations(langCode) {
    return fetch(`/lang/${langCode}.json`)
        .then(response => response.json())
        .then(data => {
            translations = data;
        })
        .catch(error => console.error(`Error loading translations for ${langCode}:`, error));
}

// Fetch video data and initialize
function fetchVideos() {
    fetch('/jsons/ch2/strats.json')
        .then(response => response.json())
        .then(data => {
            const videoContainer = document.getElementById('strats-container-ch2');
            const searchInput = document.getElementById('search-bar-input'); // Obtener el campo de búsqueda

            const updateFilters = () => {
                const selectedCategories = [];
                const selectedRoutes = [];
                const selectedVersions = [];

                // Recoger categorías seleccionadas
                if (document.getElementById('any-cb').checked) selectedCategories.push('Any%');
                if (document.getElementById('all-minigames-cb').checked) selectedCategories.push('All Minigames');
                if (document.getElementById('hundred-cb').checked) selectedCategories.push('100%');

                // Recoger rutas seleccionadas
                if (document.getElementById('oob-cb').checked) selectedRoutes.push('Out of Bounds');
                if (document.getElementById('ib-cb').checked) selectedRoutes.push('Inbounds');
                if (document.getElementById('nmg-cb').checked) selectedRoutes.push('No Major Glitches');
                if (document.getElementById('nms-cb').checked) selectedRoutes.push('No Major Skips');

                // Recoger versiones seleccionadas
                const versionCheckboxes = document.querySelectorAll('#filters-container input[type="checkbox"][data-version]');
                versionCheckboxes.forEach(cb => {
                    if (cb.checked) selectedVersions.push(cb.dataset.version);
                });

                // Si no hay filtros seleccionados
                if (selectedCategories.length === 0) {
                    // Si hay un video específico seleccionado, mostrar solo ese video
                    if (selectedVideoId) {
                        filteredData = data.filter(video => video.id === selectedVideoId);
                    } else {
                        filteredData = []; // No videos should be displayed
                    }
                    currentBatch = 0; // Reiniciar el contador de batches
                    videoContainer.innerHTML = ''; // Limpiar videos existentes
                    loadNextBatch(); // Cargar el siguiente batch (que será solo el video específico)
                    return; // Salir de la función
                }

                // Filtrar los videos
                filteredData = data.filter(video => {
                    // Si hay un video seleccionado, mostrarlo sin importar los filtros
                    if (selectedVideoId && video.id === selectedVideoId) return true;

                    const categoryMatch = selectedCategories.length === 0 || selectedCategories.some(cat => {
                        if (video.category[cat]) {
                            const routeMatch = selectedRoutes.length === 0 || selectedRoutes.some(route => video.category[cat][route]);
                            const versionMatch = selectedVersions.length === 0 || selectedVersions.some(version =>
                                video.version.split(', ').includes(version.trim())
                            );

                            return routeMatch && versionMatch;
                        }
                        return false;
                    });

                    return categoryMatch;
                });

                // Aplicar filtro de búsqueda
                const searchTerm = searchInput.value.toLowerCase();
                if (searchTerm) {
                    filteredData = filteredData.filter(video => 
                        video.title.toLowerCase().includes(searchTerm) ||
                        translations[video.description_key]?.toLowerCase().includes(searchTerm)
                    );
                }

                currentBatch = 0; // Reiniciar el contador de batches
                videoContainer.innerHTML = ''; // Limpiar videos existentes
                loadNextBatch(); // Cargar el siguiente batch
            };

            const loadNextBatch = () => {
                const start = currentBatch * batchSize;
                const end = start + batchSize;
                const videosToLoad = filteredData.slice(start, end);

                videosToLoad.forEach(video => {
                    const videoDiv = document.createElement('div');
                    videoDiv.className = 'strat-div';

                    const description = translations[video.description_key] || video.description; // Obtener traducción o descripción original

                    videoDiv.innerHTML = `
                        <div id="${video.id}" class="video-title-div">
                            <h3>${video.title}</h3>
                            <div class="video-div">
                                ${isMobile 
                                    ? `<img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" alt="${video.title} Thumbnail" class="video-thumbnail">
                                       <button onclick="window.location.href='https://www.youtube.com/watch?v=${video.id}'" class="video-button">▶</button>`
                                    : `<iframe width="640" height="360" 
                                            src="https://www.youtube.com/embed/${video.id}" 
                                            frameborder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowfullscreen>
                                        </iframe>`
                                }
                            </div>
                        </div>
                        <div class="video-description-credits-div">
                            <div class="video-description-div">
                                <div>
                                    <label data-translate="version_label">Version:</label> 
                                    <label class="text-30">${video.version}</label>
                                </div>
                                <div>
                                    <label data-translate="description_label">Description:</label> 
                                    <label class="text-30">${description}</label>
                                </div>
                            </div>
                            <div>
                                <label data-translate="video_by_label">Video by:</label> 
                                <label class="text-30">${video.author}</label>
                            </div>
                        </div>
                    `;

                    videoContainer.appendChild(videoDiv);
                });

                applyTranslations(); // Aplicar traducciones después de cargar los videos

                currentBatch++; // Incrementar el batch
            };

            // Cargar el primer batch
            loadNextBatch();

            // Detectar el scroll para cargar más videos
            window.addEventListener('scroll', () => {
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300) {
                    loadNextBatch(); // Cargar el siguiente batch al hacer scroll
                }
            });

            // Cargar el estado de los checkbox desde localStorage
            const checkboxes = document.querySelectorAll('#filters-container input[type="checkbox"]');
            checkboxes.forEach(cb => {
                const isChecked = localStorage.getItem(storagePrefix + cb.id) === 'true';
                cb.checked = isChecked;
            });

            // Agregar event listeners a los checkboxes
            checkboxes.forEach(cb => {
                cb.addEventListener('change', () => {
                    localStorage.setItem(storagePrefix + cb.id, cb.checked); // Guardar estado del checkbox en localStorage
                    updateFilters(); // Actualizar filtros al cambiar el estado del checkbox
                });
            });

            // Event listener para el campo de búsqueda
            searchInput.addEventListener('input', updateFilters); // Actualizar filtros cuando el input cambia

            // Aplicar filtros automáticamente después de cargar el estado de los checkbox
            updateFilters();
        })
}

// Función para mostrar un video específico, ignorando los filtros
function showSpecificVideo(videoId) {
    selectedVideoId = videoId; // Establecer el ID del video seleccionado
    currentBatch = 0; // Reiniciar el batch
    const videoContainer = document.getElementById('strats-container-ch2');
    videoContainer.innerHTML = ''; // Limpiar videos existentes
    updateFilters(); // Volver a aplicar los filtros para mostrar el video seleccionado
}

// Load translations and then fetch the video data
loadTranslations(currentLang)
    .then(fetchVideos)
    .then(applyTranslations) // Apply translations after fetching the videos
    .catch(error => console.error('Error during initialization:', error));

// Function to apply translations to elements with data-translate attribute
function applyTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
}
