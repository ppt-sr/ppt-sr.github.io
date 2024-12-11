const isMobile = window.matchMedia("(max-width: 1023px)").matches;
let currentBatch = 0;
const batchSize = 5;
let filteredData = [];
let translations = {}; // Object to store translations
let currentLang = localStorage.getItem('selectedLanguage') || 'en'; // Get stored language or default to 'en'

// Fetch and store translations for the selected language
function loadTranslations(langCode) {
    return fetch(`/lang/${langCode}.json`)
        .then(response => response.json())
        .then(data => {
            translations = data;
            // After loading translations, fetch the video data
            fetchVideos();
        })
        .catch(error => console.error(`Error loading translations for ${langCode}:`, error));
}

// Fetch video data and initialize
function fetchVideos() {
    fetch('/jsons/misc/iconic-runs.json')
        .then(response => response.json())
        .then(data => {
            filteredData = data; // Populate the data
            const videoContainer = document.getElementById('iconic-runs');
            
            if (!videoContainer) {
                console.error('Video container not found');
                return;
            }
            
            currentBatch = 0; // Reset batch counter
            videoContainer.innerHTML = ''; // Clear existing videos

            // Define and load the first batch
            const loadNextBatch = () => {
                const start = currentBatch * batchSize;
                const end = start + batchSize;
                const videosToLoad = filteredData.slice(start, end);

                videosToLoad.forEach(video => {
                    const videoDiv = document.createElement('div');
                    videoDiv.className = 'iconic-div';

                    const description = translations[video.description_key] || video.description;
                    const title = translations[video.title_key] || video.title;

                    // Format the date
                    const formattedDate = new Date(video.date).toLocaleDateString(`${currentLang}`, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });

                    videoDiv.innerHTML = `
                        <div id="${video.id}" class="video-title-div">
                            <h4>${video.real_title}</h4>
                            <div class="video-div">
                                ${isMobile 
                                    ? `<img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" alt="${title} Thumbnail" class="video-thumbnail">
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
                                    <h2>${title}</h2>
                                </div>
                                <div class="tags_and_strats">
                                    <div>
                                        <label>Chapter ${video.chapter} <label class="text-30">|</label> ${video.category} <label class="text-30">|</label> ${video.route} <label class="text-30">|</label> ${video.version}</label>
                                    </div>
                                    <label class="text-30"> • </label>
                                    <a href="javascript:void(0);" onclick="updateLocalStorageAndRedirect(${video.chapter}, '${video.route}', '${video.category}', '${video.version}')">SEE STRATS USED</a>
                                </div>
                                <div>
                                    <label>${formattedDate}</label>
                                </div>
                                <div>
                                    <label data-translate="description_label">Description:</label> 
                                    <label class="text-30">${description}</label>
                                </div>
                            </div>
                            <div class="bottom_record">
                                <div>
                                    <label data-translate="video_by_label">Video by:</label> 
                                    <label class="text-30">${video.author || 'Unknown'}</label>
                                </div>
                                ${video.src_id ? `<a class="see_on_src" target="_blank" href="https://speedrun.com/run/${video.src_id}">SEE ON SPEEDRUN.COM</a>` : ``}
                            </div>
                        </div>
                    `;

                    videoContainer.appendChild(videoDiv);
                });

                applyTranslations(); // Apply translations after loading videos
                currentBatch++; // Increment the batch
            };

            // Load the first batch
            loadNextBatch();

            // Scroll event to load more videos
            window.addEventListener('scroll', () => {
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 300) {
                    loadNextBatch();
                }
            });
        })
        .catch(error => console.error('Error fetching video data:', error));
}

// Function to apply translations to the page content
function applyTranslations() {
    const translateElements = document.querySelectorAll('[data-translate]');

    translateElements.forEach(el => {
        const translationKey = el.getAttribute('data-translate');
        if (translations[translationKey]) {
            el.textContent = translations[translationKey];
        }
    });
}

// Function to update local storage and redirect to the correct page
function updateLocalStorageAndRedirect(chapter, route, category, version) {
    // Reset all checkboxes for the chapter to false
    resetChapterCheckboxes(chapter);

    // Map route to checkbox keys
    const routeToCheckboxMapping = {
        "Out of Bounds": `pc-ch${chapter}-oob-cb`,
        "All Tapes": `pc-ch${chapter}-all-tapes-cb`,
        "Any Tapes": `pc-ch${chapter}-any-tapes-cb`,
        "No Major Glitches": `pc-ch${chapter}-nmg-cb`,
        "In Bounds": `pc-ch${chapter}-ib-cb`
    };

    // Set the relevant checkbox for the current video route
    if (routeToCheckboxMapping[route]) {
        localStorage.setItem(routeToCheckboxMapping[route], true);
    }

    // Map category to checkbox keys for each chapter
    if (chapter === 1) {
        const categoryToCheckboxMapping = {
            "No Major Skips": `pc-ch1-nms-cb`,
            "Any%": `pc-ch1-any-cb`,
            "100%": `pc-ch1-hundred-cb`
        };

        if (categoryToCheckboxMapping[category]) {
            localStorage.setItem(categoryToCheckboxMapping[category], true);
        }
    }

    if (chapter === 2) {
        const categoryToCheckboxMapping = {
            "All Minigames": `pc-ch2-all-minigames-cb`,
            "Any%": `pc-ch2-any-cb`,
            "100%": `pc-ch2-hundred-cb`
        };

        if (categoryToCheckboxMapping[category]) {
            localStorage.setItem(categoryToCheckboxMapping[category], true);
        }
    }

    if (chapter === 3) {
        const categoryToCheckboxMapping = {
            "All Stages": `pc-ch3-all-stages-cb`,
            "100%": `pc-ch3-hundred-cb`,
            "Any%": `pc-ch3-any-cb`
        };

        if (categoryToCheckboxMapping[category]) {
            localStorage.setItem(categoryToCheckboxMapping[category], true);
        }
    }

    // Map version to checkbox keys based on chapter and version
    const versionToCheckboxMapping = {
        1: {
            "1.1": `pc-ch1-old-patch-cb`,
            "1.2": `pc-ch1-new-patch-cb`,
            "1.3": `pc-ch1-1.3-cb`
        },
        2: {
            "1.0": `pc-ch2-v1_0-cb`,
            "1.1": `pc-ch2-v1_1-cb`,
            "1.2": `pc-ch2-v1_2-cb`
        },
        3: {
            "Restricted": `pc-ch3-restricted-cb`
        }
    };

    // Set the relevant checkbox for the version
    if (versionToCheckboxMapping[chapter] && versionToCheckboxMapping[chapter][version]) {
        localStorage.setItem(versionToCheckboxMapping[chapter][version], true);
    }

    // Redirect to the relevant page
    window.location.href = `/chapter-${chapter}/pc/strats/`;
}

// Function to reset all checkboxes for a given chapter to false
function resetChapterCheckboxes(chapter) {
    const checkboxSelectors = {
        1: [
            "pc-ch1-oob-cb", "pc-ch1-all-tapes-cb", "pc-ch1-any-tapes-cb", 
            "pc-ch1-nmg-cb", "pc-ch1-ib-cb", "pc-ch1-nms-cb", 
            "pc-ch1-any-cb", "pc-ch1-hundred-cb", "pc-ch1-old-patch-cb", 
            "pc-ch1-new-patch-cb", "pc-ch1-1.3-cb"
        ],
        2: [
            "pc-ch2-all-minigames-cb", "pc-ch2-any-cb", "pc-ch2-hundred-cb",
            "pc-ch2-v1_0-cb", "pc-ch2-v1_1-cb", "pc-ch2-v1_2-cb"
        ],
        3: [
            "pc-ch3-all-stages-cb", "pc-ch3-any-cb", "pc-ch3-hundred-cb",
            "pc-ch3-restricted-cb"
        ]
    };

    // Reset all checkboxes to false for the specified chapter
    if (checkboxSelectors[chapter]) {
        checkboxSelectors[chapter].forEach(checkboxId => {
            localStorage.setItem(checkboxId, false);
        });
    }
}

// Load translations and then fetch the video data
loadTranslations(currentLang)
    .catch(error => console.error("Failed to load translations:", error));