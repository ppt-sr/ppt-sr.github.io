// Function to load available languages based on existing JSON files
function loadAvailableLanguages() {
    const languages = [
        { code: 'en', name: 'English', flag: '/flags/4x3/gb.svg' },
        { code: 'es', name: 'Español', flag: '/flags/4x3/es.svg' },
        { code: 'pl', name: 'Polski', flag: '/flags/4x3/pl.svg' }
    ];

    const langList = document.getElementById('lang-list');
    langList.innerHTML = ''; // Clear existing list

    languages.forEach(language => {
        fetch(`/lang/${language.code}.json`)
            .then(response => {
                if (response.ok) {
                    addLanguageToList(language); // Add language if the JSON file exists
                } else {
                    console.log(`Language file for ${language.name} not found.`);
                }
            })
            .catch(error => {
                console.log(`Error fetching language file for ${language.name}:`, error);
            })
            .finally(() => {
                // Update the current language button after all fetch attempts
                updateCurrentLanguageButton();
            });
    });
}

// Function to add a language to the list
function addLanguageToList(language) {
    const langList = document.getElementById('lang-list');
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `?${language.code}`; // Ensure there are no leading/trailing spaces
    a.dataset.icon = language.flag;
    a.innerHTML = `<img src="${language.flag}" alt="${language.code.toUpperCase()} flag"/> ${language.name}`;
    li.appendChild(a);
    langList.appendChild(li);
}

// Function to update the current language button based on stored language
function updateCurrentLanguageButton() {
    const storedLang = localStorage.getItem('selectedLanguage') || 'en'; // Default to 'en' if no language is stored
    const currentLangBtn = document.getElementById('current-lang');
    const selectedLangElement = document.querySelector(`a[href="?${storedLang}"]`);
    
    if (selectedLangElement) {
        const newLangText = selectedLangElement.innerText;
        const newIconSrc = selectedLangElement.querySelector('img').src;
        const currentLangIcon = document.getElementById('current-lang-icon');
        currentLangIcon.src = newIconSrc; // Update icon
        currentLangBtn.lastChild.nodeValue = ` ${newLangText}`; // Update button text
    }
}

// Function to load a JSON file for the selected language and apply the translations
function loadLanguage(langCode) {
    fetch(`/lang/${langCode}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error loading language file: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            // Find all elements with the data-translate attribute
            document.querySelectorAll('[data-translate]').forEach(element => {
                const translateKey = element.getAttribute('data-translate');
                
                // Check if the key exists in the translation file
                if (data[translateKey]) {
                    // If the element is an input, update its placeholder
                    if (element.tagName.toLowerCase() === 'input') {
                        element.setAttribute('placeholder', data[translateKey]);
                    } else {
                        // Otherwise, update the innerHTML
                        element.innerHTML = data[translateKey];
                    }
                } else {
                    console.warn(`Translation key "${translateKey}" not found in language data for ${langCode}`);
                }
            });
        })
        .catch(error => {
            console.error(`Error loading language file: ${error}`);
        });
}

// Initialize the current language button and language selection
const currentLangBtn = document.getElementById('current-lang');

if (currentLangBtn) {
    // Load available languages on page load
    loadAvailableLanguages();

    // Event listener for the language picker button
    currentLangBtn.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevents the event from closing the popup immediately
        const popup = document.getElementById('lang-popup');
        popup.classList.toggle('hidden');
    });

    // Event listener for language selection
    const langList = document.getElementById('lang-list');
    langList.addEventListener('click', function (event) {
        const selectedLang = event.target.closest('a'); // Selects the clicked link
        if (!selectedLang) return; // Exit if no link is clicked

        const newLangText = selectedLang.innerText;
        const newIconSrc = selectedLang.querySelector('img').src;
        const langCode = selectedLang.getAttribute('href').substring(1); // Extract lang code from href

        // Update the text and icon of the language button
        const currentLangIcon = document.getElementById('current-lang-icon');
        currentLangIcon.src = newIconSrc;
        currentLangBtn.lastChild.nodeValue = ` ${newLangText}`; // Update button text

        // Move the selected language to the top of the list
        langList.prepend(selectedLang.parentElement);

        // Store the selected language in localStorage
        localStorage.setItem('selectedLanguage', langCode);

        // Load the corresponding language JSON and update the page
        loadLanguage(langCode);

        // Hide the popup
        document.getElementById('lang-popup').classList.add('hidden');
    });
}

// Close the popup when clicking outside of it
document.addEventListener('click', function (event) {
    const popup = document.getElementById('lang-popup');
    if (popup && !popup.contains(event.target) && event.target !== currentLangBtn) {
        popup.classList.add('hidden');
    }
});

// Apply stored language on page load
document.addEventListener('DOMContentLoaded', function () {
    const storedLang = localStorage.getItem('selectedLanguage') || 'en'; // Default to 'en' if no language is stored
    loadLanguage(storedLang); // Load language data
    updateCurrentLanguageButton(); // Update button on load
});
