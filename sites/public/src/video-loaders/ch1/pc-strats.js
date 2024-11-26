let currentBatch = 0;
const batchSize = 5;
let filteredData = [];
let selectedVideoId = null;
const storagePrefix = 'pc-ch1-';
let translations = {}; // Object to store translations
let currentLang = localStorage.getItem('selectedLanguage') || 'en'; // Get stored language or default to 'en'

const hash = window.location.hash.substring(1);
if (hash) {
    selectedVideoId = hash;
}

// Fetch and store the translations for the selected language
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
    return fetch('/jsons/ch1/strats.json')
        .then(response => response.json())
        .then(data => {
            const videoContainer = document.getElementById('strats-container-ch1');
            const searchInput = document.getElementById('search-bar-input');

            const updateFilters = () => {
                const selectedCategories = [];
                const selectedRoutes = [];
                const selectedVersions = [];

                if (document.getElementById('any-cb').checked) selectedCategories.push('Any%');
                if (document.getElementById('no-major-glitches-cb').checked) selectedCategories.push('No Major Glitches');
                if (document.getElementById('all-tapes-cb').checked) selectedRoutes.push('All Tapes');
                if (document.getElementById('no-tapes-cb').checked) selectedRoutes.push('No Tapes');

                const versionCheckboxes = document.querySelectorAll('#filters-container input[type="checkbox"][data-version]');
                versionCheckboxes.forEach(cb => {
                    if (cb.checked) selectedVersions.push(cb.dataset.version);
                });

                if (selectedCategories.length === 0 && selectedVideoId) {
                    filteredData = data.filter(video => video.id === selectedVideoId);
                    currentBatch = 0;
                    videoContainer.innerHTML = '';
                    loadNextBatch();
                    return;
                }

                filteredData = data.filter(video => {
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

                const searchTerm = searchInput.value.toLowerCase();
                if (searchTerm) {
                    filteredData = filteredData.filter(video => 
                        video.title.toLowerCase().includes(searchTerm) ||
                        translations[video.description_key]?.toLowerCase().includes(searchTerm)
                    );
                }

                currentBatch = 0;
                videoContainer.innerHTML = '';
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

                currentBatch++;
                applyTranslations(); // Apply translations after loading the next batch of videos
            };

            loadNextBatch();

            window.addEventListener('scroll', () => {
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300) {
                    loadNextBatch();
                }
            });

            const checkboxes = document.querySelectorAll('#filters-container input[type="checkbox"]');
            checkboxes.forEach(cb => {
                const isChecked = localStorage.getItem(storagePrefix + cb.id) === 'true';
                cb.checked = isChecked;
            });

            checkboxes.forEach(cb => {
                cb.addEventListener('change', () => {
                    localStorage.setItem(storagePrefix + cb.id, cb.checked);
                    updateFilters();
                });
            });

            searchInput.addEventListener('input', updateFilters);
            updateFilters();
        })
        .catch(error => console.error('Error loading the JSON:', error));
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
