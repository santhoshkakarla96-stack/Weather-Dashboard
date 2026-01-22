const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const unitToggle = document.getElementById('unit-toggle');
const themeToggle = document.getElementById('theme-toggle');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const currentWeatherSection = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast');
const forecastCards = document.getElementById('forecast-cards');

let currentCity = '';
let currentUnits = 'celsius';

function init() {
    const prefs = loadPreferences();
    currentUnits = prefs.units;
    currentCity = prefs.defaultCity;

    unitToggle.value = prefs.units;
    themeToggle.value = prefs.theme;
    applyTheme(prefs.theme);

    setupEventListeners();

    if (currentCity) {
        getWeather(currentCity);
    }
}

function setupEventListeners() {
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        }
    });

    unitToggle.addEventListener('change', function () {
        currentUnits = this.value;
        updatePreference('units', currentUnits);

        if (currentCity) {
            getWeather(currentCity);
        }
    });

    themeToggle.addEventListener('change', function () {
        applyTheme(this.value);
        updatePreference('theme', this.value);
    });
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

async function getWeather(city) {
    showLoading();
    hideError();
    currentWeatherSection.classList.add('hidden');
    forecastSection.classList.add('hidden');

    try {
        const weatherData = await fetchCurrentWeather(city, currentUnits);
        const forecastData = await fetchForecast(city, currentUnits);

        currentCity = city;
        updatePreference('defaultCity', city);

        displayCurrentWeather(weatherData);
        displayForecast(forecastData);

        cityInput.value = '';
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function displayCurrentWeather(data) {
    const unitSymbol = currentUnits === 'celsius' ? '°C' : '°F';
    const windUnit = currentUnits === 'celsius' ? 'km/h' : 'mph';
    const weatherInfo = getWeatherInfo(data.weatherCode);

    document.getElementById('city-name').textContent = `${data.city}, ${data.country}`;
    document.getElementById('weather-icon').textContent = weatherInfo.emoji;
    document.getElementById('temperature').textContent = `${data.temperature}${unitSymbol}`;
    document.getElementById('description').textContent = weatherInfo.desc;
    document.getElementById('humidity').textContent = `${data.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.windSpeed} ${windUnit}`;
    document.getElementById('feels-like').textContent = `${data.feelsLike}${unitSymbol}`;

    currentWeatherSection.classList.remove('hidden');
}

function displayForecast(data) {
    const unitSymbol = currentUnits === 'celsius' ? '°C' : '°F';

    forecastCards.innerHTML = '';

    data.forEach(function (day) {
        const card = document.createElement('div');
        card.className = 'forecast-card';

        const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
        const formattedDate = day.date.toLocaleDateString('en-US', dateOptions);
        const weatherInfo = getWeatherInfo(day.weatherCode);

        card.innerHTML = `
            <p class="date">${formattedDate}</p>
            <span class="weather-emoji">${weatherInfo.emoji}</span>
            <p class="temp">${day.tempMax}${unitSymbol}</p>
            <p class="desc">${weatherInfo.desc}</p>
        `;

        forecastCards.appendChild(card);
    });

    forecastSection.classList.remove('hidden');
}

function showLoading() {
    loadingDiv.classList.remove('hidden');
}

function hideLoading() {
    loadingDiv.classList.add('hidden');
}

function showError(message) {
    errorText.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    errorDiv.classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', init);
