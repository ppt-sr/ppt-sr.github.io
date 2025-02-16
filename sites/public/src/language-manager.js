// Function to load available languages based on existing JSON files
function loadAvailableLanguages() {
    const languages = [
        { code: 'en', name: 'English', flag: '/flags/4x3/gb.svg' },
        { code: 'es', name: 'Español', flag: '/flags/4x3/es.svg' },
        { code: 'pt-BR', name: 'Português', flag: '/flags/4x3/br.svg' }
    ];

    const langList = document.getElementById('lang-list');
    const langListMobile = document.getElementById('lang-list-mobile'); // For mobile
    langList.innerHTML = ''; // Clear existing list
    langListMobile.innerHTML = ''; // Clear mobile list

    languages.forEach(language => {
        fetch(`/lang/${language.code}.json`)
            .then(response => {
                if (response.ok) {
                    addLanguageToList(language); // Add language if the JSON file exists
                    addLanguageToMobileList(language); // Add to mobile list as well
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
                updateCurrentLanguageButtonMobile(); // Mobile button update
            });
    });
}

// Function to add a language to the desktop list
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

// Function to add a language to the mobile list
function addLanguageToMobileList(language) {
    const langListMobile = document.getElementById('lang-list-mobile');
    const liMobile = document.createElement('li');
    const aMobile = document.createElement('a');
    aMobile.href = `?${language.code}`;
    aMobile.dataset.icon = language.flag;
    aMobile.innerHTML = `<img src="${language.flag}" alt="${language.code.toUpperCase()} flag"/> ${language.name}`;
    liMobile.appendChild(aMobile);
    langListMobile.appendChild(liMobile);
}

// Function to update the current language button based on stored language (Desktop)
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

// Function to update the current language button based on stored language (Mobile)
function updateCurrentLanguageButtonMobile() {
    const storedLang = localStorage.getItem('selectedLanguage') || 'en'; // Default to 'en' if no language is stored
    const currentLangBtnMobile = document.getElementById('current-lang-mobile'); // Renamed for mobile
    const selectedLangElementMobile = document.querySelector(`a[href="?${storedLang}"]`);
    
    if (selectedLangElementMobile) {
        const newLangTextMobile = selectedLangElementMobile.innerText;
        const newIconSrcMobile = selectedLangElementMobile.querySelector('img').src;
        const currentLangIconMobile = document.getElementById('current-lang-icon-mobile');
        currentLangIconMobile.src = newIconSrcMobile; // Update icon
        currentLangBtnMobile.lastChild.nodeValue = ` ${newLangTextMobile}`; // Update button text
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
const currentLangBtnMobile = document.getElementById('current-lang-mobile'); // For mobile

if (currentLangBtn || currentLangBtnMobile) {
    // Load available languages on page load
    loadAvailableLanguages();

    // Event listener for the desktop language picker button
    if (currentLangBtn) {
        currentLangBtn.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevents the event from closing the popup immediately
            const popup = document.getElementById('lang-popup');
            popup.classList.toggle('hidden');
        });
    }

    // Event listener for the mobile language picker button
    if (currentLangBtnMobile) {
        currentLangBtnMobile.addEventListener('click', function (event) {
            event.stopPropagation(); // Prevents the event from closing the popup immediately
            const popupMobile = document.getElementById('lang-popup-mobile');
            popupMobile.classList.toggle('hidden');
        });
    }

    // Event listener for language selection (Desktop)
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

    // Event listener for language selection (Mobile)
    const langListMobile = document.getElementById('lang-list-mobile');
    langListMobile.addEventListener('click', function (event) {
        const selectedLangMobile = event.target.closest('a'); // Selects the clicked link
        if (!selectedLangMobile) return; // Exit if no link is clicked

        const newLangTextMobile = selectedLangMobile.innerText;
        const newIconSrcMobile = selectedLangMobile.querySelector('img').src;
        const langCodeMobile = selectedLangMobile.getAttribute('href').substring(1); // Extract lang code from href

        // Update the text and icon of the mobile language button
        const currentLangIconMobile = document.getElementById('current-lang-icon-mobile');
        currentLangIconMobile.src = newIconSrcMobile;
        currentLangBtnMobile.lastChild.nodeValue = ` ${newLangTextMobile}`; // Update button text

        // Move the selected language to the top of the list
        langListMobile.prepend(selectedLangMobile.parentElement);

        // Store the selected language in localStorage
        localStorage.setItem('selectedLanguage', langCodeMobile);

        // Load the corresponding language JSON and update the page
        loadLanguage(langCodeMobile);

        // Hide the mobile popup
        document.getElementById('lang-popup-mobile').classList.add('hidden');
    });
}

// Close the popups when clicking outside of them
document.addEventListener('click', function (event) {
    const popup = document.getElementById('lang-popup');
    const popupMobile = document.getElementById('lang-popup-mobile');
    if (popup && !popup.contains(event.target) && event.target !== currentLangBtn) {
        popup.classList.add('hidden');
    }
    if (popupMobile && !popupMobile.contains(event.target) && event.target !== currentLangBtnMobile) {
        popupMobile.classList.add('hidden');
    }
});

// Apply stored language on page load
document.addEventListener('DOMContentLoaded', function () {
    const storedLang = localStorage.getItem('selectedLanguage') || 'en'; // Default to 'en' if no language is stored
    loadLanguage(storedLang); // Load language data
    updateCurrentLanguageButton(); // Update button on load
    updateCurrentLanguageButtonMobile(); // Update mobile button on load
});
