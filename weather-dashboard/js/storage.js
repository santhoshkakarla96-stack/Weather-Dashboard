const DEFAULT_PREFERENCES = {
    defaultCity: 'London',
    units: 'celsius',
    theme: 'light'
};

function savePreferences(prefs) {
    try {
        localStorage.setItem('weatherPreferences', JSON.stringify(prefs));
        console.log('Preferences saved:', prefs);
    } catch (error) {
        console.error('Error saving preferences:', error);
    }
}

function loadPreferences() {
    try {
        const prefs = localStorage.getItem('weatherPreferences');
        if (prefs) {
            return JSON.parse(prefs);
        }
    } catch (error) {
        console.error('Error loading preferences:', error);
    }

    return { ...DEFAULT_PREFERENCES };
}

function updatePreference(key, value) {
    const prefs = loadPreferences();
    prefs[key] = value;
    savePreferences(prefs);
}

function saveFavoriteCities(cities) {
    try {
        localStorage.setItem('favoriteCities', JSON.stringify(cities));
    } catch (error) {
        console.error('Error saving favorite cities:', error);
    }
}

function loadFavoriteCities() {
    try {
        const cities = localStorage.getItem('favoriteCities');
        if (cities) {
            return JSON.parse(cities);
        }
    } catch (error) {
        console.error('Error loading favorite cities:', error);
    }
    return [];
}
