// Fetch the JSON and display the videos
fetch('/jsons/ch1/guides.json')
    .then(response => response.json())
    .then(data => {
        const videoContainer = document.getElementById('guides-container-ch1');

        // Load all videos
        data.forEach(video => {
            const videoDiv = document.createElement('div');
            videoDiv.className = 'strat-div';

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

        addCopyButtonListeners();
        scrollToHash(); // Scroll to the video specified in the hash after loading all videos
    })
    .catch(error => console.error('Error loading the JSON:', error));

// Function to scroll to the element based on the hash in the URL
const scrollToHash = () => {
    const targetHash = window.location.hash;
    if (targetHash) {
        const targetId = targetHash.substring(1); // Remove the '#' to get the ID
        const scrollToElement = () => {
            const targetElement = document.getElementById(targetId); // Select the element by ID

            if (targetElement) {
                // If the element is found, scroll to it smoothly
                targetElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                // If the element is not found, scroll down and check again
                window.scrollBy(0, window.innerHeight); // Scroll down by the height of the window

                // Retry checking if the element is now in view
                setTimeout(scrollToElement, 500); // Retry after 500 ms
            }
        };

        // Start the scrolling process
        scrollToElement();
    }
};

// Wait for the page to fully load before starting the hash check
window.addEventListener('load', () => {
    scrollToHash();
});
