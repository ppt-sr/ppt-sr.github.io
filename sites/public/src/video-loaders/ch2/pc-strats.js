let currentBatch = 0;
const batchSize = 5;
let filteredData = [];

const storagePrefix = 'pc-ch2-';

// Cargar el JSON y mostrar los videos en lotes
fetch('/jsons/ch2/strats.json')
    .then(response => response.json())
    .then(data => {
        const videoContainer = document.getElementById('strats-container-ch2');

        const updateFilters = () => {
            // Get the selected filters
            const selectedCategories = [];
            const selectedRoutes = [];
            const selectedVersions = [];

            // Gather selected categories
            if (document.getElementById('any-cb').checked) selectedCategories.push('Any%');
            if (document.getElementById('all-minigames-cb').checked) selectedCategories.push('All Minigames');
            if (document.getElementById('hundred-cb').checked) selectedCategories.push('100%');

            // Gather selected routes
            if (document.getElementById('oob-cb').checked) selectedRoutes.push('Out of Bounds');
            if (document.getElementById('ib-cb').checked) selectedRoutes.push('Inbounds');
            if (document.getElementById('nmg-cb').checked) selectedRoutes.push('No Major Glitches');
            if (document.getElementById('nms-cb').checked) selectedRoutes.push('No Major Skips');

            // Gather selected versions
            const versionCheckboxes = document.querySelectorAll('#filters-container input[type="checkbox"][data-version]');
            versionCheckboxes.forEach(cb => {
                if (cb.checked) selectedVersions.push(cb.dataset.version);
            });

            // If no main categories are selected, set filteredData to an empty array
            if (selectedCategories.length === 0) {
                filteredData = []; // No videos should be displayed
                currentBatch = 0; // Reset batch count
                videoContainer.innerHTML = ''; // Clear existing videos
                return; // Exit the function early
            }

            // Filter the videos based on selected categories, routes, and versions
            filteredData = data.filter(video => {
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
                
                videoDiv.innerHTML = `
                    <div class="video-title-div">
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
                                <label>Version:</label> <label class="text-30">${video.version}</label>
                            </div>
                            <div>
                                <label>Description:</label> <label class="text-30">${video.description}</label>
                            </div>
                        </div>
                        <div>
                            <label>Video by:</label> <label class="text-30">${video.author}</label>
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
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                loadNextBatch();
            }
        });

        // Load checkbox states from localStorage
        const checkboxes = document.querySelectorAll('#filters-container input[type="checkbox"]');
        checkboxes.forEach(cb => {
            const isChecked = localStorage.getItem(storagePrefix+cb.id) === 'true';
            cb.checked = isChecked;
        });

        // Add event listeners to checkboxes
        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                localStorage.setItem(storagePrefix+cb.id, cb.checked); // Save checkbox state to localStorage
                updateFilters(); // Update filters when checkbox state changes
            });
        });

        // Automatically apply filters after loading checkbox states
        updateFilters();
    })
    .catch(error => console.error('Error loading the JSON:', error));
