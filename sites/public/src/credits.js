// Array with the paths to the JSON files
let jsonFiles = [
  '/jsons/ch1/guides.json',
  '/jsons/ch2/guides.json',
  '/jsons/ch3/guides.json',
  '/jsons/ch4/guides.json',
  '/jsons/ch1/strats.json',
  '/jsons/ch2/strats.json',
  '/jsons/ch3/strats.json',
  '/jsons/ch4/strats.json',
  '/jsons/ch2/mobile.json'
]; // Add paths to the JSON files here

// Function to fetch and load JSON data from files
async function loadJSONs(fileList) {
let allData = [];

// Fetch data from each file
for (const file of fileList) {
  try {
    const response = await fetch(file);
    const data = await response.json();
    allData.push(...data); // Assuming each file contains an array of JSON objects
  } catch (error) {
    console.error(`Error loading ${file}:`, error);
  }
}

return allData;
}

// Function to generate the credits
function generateCredits(jsonData) {
    const creditsContainer = document.getElementById('credits');
  
    // Objeto para contar videos por autor
    let authorsCount = {};

    // Contar el número de videos por autor
    jsonData.forEach(video => {
        let author = video.author;
        if (authorsCount[author]) {
            authorsCount[author]++;
        } else {
            authorsCount[author] = 1;
        }
    });

    let sortedAuthors = Object.entries(authorsCount).sort((a, b) => b[1] - a[1]);

    sortedAuthors.forEach(([author, count]) => {
        const authorDiv = document.createElement('div');
        authorDiv.classList.add('author');
        authorDiv.textContent = author;

        const countDiv = document.createElement('div');
        countDiv.classList.add('video-count');
        countDiv.innerHTML = `${count} <span data-translate="credits_videos">videos</span>`;

        creditsContainer.appendChild(authorDiv);
        creditsContainer.appendChild(countDiv);
    });

    const storedLang = localStorage.getItem('selectedLanguage') || 'en'; // Cargar idioma almacenado
    loadLanguage(storedLang);
}


loadJSONs(jsonFiles).then(data => {
  generateCredits(data);
});