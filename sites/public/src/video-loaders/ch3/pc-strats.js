let currentBatch = 0;
const batchSize = 5;
let filteredData = [];
let selectedVideoId = null; // Variable para almacenar el ID del video seleccionado

const storagePrefix = 'pc-ch3-';
let translations = {}; // Objeto para almacenar las traducciones
let currentLang = localStorage.getItem('selectedLanguage') || 'en'; // Obtener el idioma almacenado o predeterminado

// Obtener el ID del video del hash en la URL
const hash = window.location.hash.substring(1); // Remover el '#' del inicio
if (hash) {
    selectedVideoId = hash; // Establecer el ID del video seleccionado basado en el hash
}

// Función para cargar las traducciones
function loadTranslations(langCode) {
    return fetch(`/lang/${langCode}.json`)
        .then(response => response.json())
        .then(data => {
            translations = data; // Almacenar las traducciones
        })
        .catch(error => console.error(`Error loading translations for ${langCode}:`, error));
}

// Función para aplicar las traducciones a los elementos con el atributo data-translate
function applyTranslations() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
}

// Cargar el archivo JSON de estrategias y manejar los datos
fetch('/jsons/ch3/strats.json')
    .then(response => response.json())
    .then(data => {
        const videoContainer = document.getElementById('strats-container-ch3');
        const searchInput = document.getElementById('search-bar-input'); // Obtener el campo de búsqueda

        const updateFilters = () => {
            const selectedCategories = [];
            const selectedRoutes = [];
            const selectedrestricted = [];

            // Recopilar las categorías seleccionadas
            if (document.getElementById('any-cb').checked) selectedCategories.push('Any%');
            if (document.getElementById('all-stages-cb').checked) selectedCategories.push('All Stages');
            if (document.getElementById('hundred-cb').checked) selectedCategories.push('100%');

            // Recopilar las rutas seleccionadas
            if (document.getElementById('oob-cb').checked) selectedRoutes.push('Out of Bounds');
            if (document.getElementById('ib-cb').checked) selectedRoutes.push('Inbounds');
            if (document.getElementById('nms-cb').checked) selectedRoutes.push('No Major Skips');

            // Recopilar los restricteds seleccionados
            const restrictedCheckboxes = document.querySelectorAll('#filters-container input[type="checkbox"][data-restricted]');
            restrictedCheckboxes.forEach(cb => {
                if (cb.checked) selectedrestricted.push(cb.dataset.restricted);
            });

            // Si no hay filtros seleccionados
            if (selectedCategories.length === 0) {
                // Si hay un video específico seleccionado, mostrar solo ese video
                if (selectedVideoId) {
                    filteredData = data.filter(video => video.id === selectedVideoId);
                } else {
                    filteredData = []; // No videos should be displayed
                }
                currentBatch = 0; // Reset batch count
                videoContainer.innerHTML = ''; // Clear existing videos
                loadNextBatch(); // Cargar el siguiente batch (que será solo el video específico)
                return; // Exit the function early
            }

            // Filtrar los videos
            filteredData = data.filter(video => {
                // Si hay un video seleccionado, mostrarlo sin importar los filtros
                if (selectedVideoId && video.id === selectedVideoId) return true;

                const categoryMatch = selectedCategories.length === 0 || selectedCategories.some(cat => {
                    if (video.category[cat]) {
                        const routeMatch = selectedRoutes.length === 0 || selectedRoutes.some(route => video.category[cat][route]);
                        const restrictedMatch = selectedrestricted.length === 0 || selectedrestricted.some(restricted => 
                            video.restricted === (restricted === 'true')
                        );                        

                        return routeMatch && restrictedMatch;
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

            currentBatch = 0; // Reset batch count after filtering
            videoContainer.innerHTML = ''; // Clear existing videos
            loadNextBatch();
        };

        const loadNextBatch = () => {
            const start = currentBatch * batchSize;
            const end = start + batchSize;
            const videosToLoad = filteredData.slice(start, end);

            videosToLoad.forEach(video => {
                const videoDiv = document.createElement('div');
                videoDiv.className = 'strat-div';

                const description = translations[video.description_key] || video.description;

                videoDiv.innerHTML = `
                <div id="${video.id}" class="video-title-div">
                    <h3>${video.title}</h3>
                    <div class="video-div">
                        <iframe width="640" height="360" 
                            src="https://www.youtube.com/embed/${video.id}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                </div>
                <div class="video-description-credits-div">
                    <div class="video-description-div">
                        <div>
                            <label ${video.restricted ? '' : 'class="primary"'}">${video.restricted ? 'Restricted' : 'Unrestricted'}</label>
                        </div>
                        <div>
                            <label data-translate="description_label">${translations['description_label']}</label> 
                            <label class="text-30">${description}</label>
                        </div>
                    </div>
                    <div>
                        <label data-translate="video_by_label">${translations['video_by_label']}</label> 
                        <label class="text-30">${video.author}</label>
                    </div>
                </div>
            `;

                videoContainer.appendChild(videoDiv);
            });

            currentBatch++;
        };

        // Load the first batch
        loadNextBatch();

        // Detect the scroll to load more videos
        window.addEventListener('scroll', () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300) {
                loadNextBatch();
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
                localStorage.setItem(storagePrefix + cb.id, cb.checked); // Save checkbox state to localStorage
                updateFilters(); // Update filters when checkbox state changes
            });
        });

        // Event listener para el campo de búsqueda
        searchInput.addEventListener('input', updateFilters); // Actualizar filtros cuando el input cambia

        // Aplicar filtros automáticamente después de cargar el estado de los checkbox
        updateFilters();
    })
    .catch(error => console.error('Error loading the JSON:', error));

// Función para mostrar un video específico, ignorando los filtros
function showSpecificVideo(videoId) {
    selectedVideoId = videoId; // Establecer el ID del video seleccionado
    currentBatch = 0; // Reiniciar el batch
    const videoContainer = document.getElementById('strats-container-ch3');
    videoContainer.innerHTML = ''; // Limpiar los videos existentes
    updateFilters(); // Volver a aplicar los filtros para mostrar el video seleccionado
}

// Cargar las traducciones y luego la información de videos
loadTranslations(currentLang).then(applyTranslations);
