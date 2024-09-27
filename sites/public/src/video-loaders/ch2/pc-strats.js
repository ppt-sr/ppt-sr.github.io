let currentBatch = 0;
const batchSize = 5;

// Cargar el JSON y mostrar los videos en lotes
fetch('/jsons/ch2/strats.json')
    .then(response => response.json())
    .then(data => {
        const videoContainer = document.getElementById('strats-container-ch2');

        const loadNextBatch = () => {
            const start = currentBatch * batchSize;
            const end = start + batchSize;
            const videosToLoad = data.slice(start, end);
            
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

        // Cargar el primer lote
        loadNextBatch();

        // Detectar el scroll para cargar más videos
        window.addEventListener('scroll', () => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
                loadNextBatch();
            }
        });
    })
    .catch(error => console.error('Error loading the JSON:', error));
