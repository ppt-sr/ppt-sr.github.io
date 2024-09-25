// Cargar el JSON y mostrar los videos
fetch('/jsons/ch1/guides.json')
    .then(response => response.json())
    .then(data => {
        const videoContainer = document.getElementById('guides-container-ch1');

        data.forEach(video => {
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
                <div class="video-description-div">
                    <div>
                        <label>Version:</label> <label class="text-30">${video.version}</label>
                    </div>
                    <div>
                        <label>Description:</label> <label class="text-30">${video.description}</label>
                    </div>
                </div>
            `;

            videoContainer.appendChild(videoDiv);
        });
    })
    .catch(error => console.error('Error loading the JSON:', error));
