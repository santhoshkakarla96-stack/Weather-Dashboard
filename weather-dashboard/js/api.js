const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

async function getCityCoordinates(city) {
    try {
        const url = `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to search for city.');
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error('City not found. Please check the city name.');
        }

        const result = data.results[0];
        return {
            name: result.name,
            country: result.country,
            latitude: result.latitude,
            longitude: result.longitude
        };
    } catch (error) {
        console.error('Error getting city coordinates:', error);
        throw error;
    }
}

async function fetchWeatherData(lat, lon, units = 'celsius') {
    try {
        const tempUnit = units === 'fahrenheit' ? 'fahrenheit' : 'celsius';
        const windUnit = units === 'fahrenheit' ? 'mph' : 'kmh';

        const url = `${WEATHER_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&timezone=auto&forecast_days=6`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch weather data.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

async function fetchCurrentWeather(city, units = 'celsius') {
    const cityData = await getCityCoordinates(city);
    const weatherData = await fetchWeatherData(
        cityData.latitude,
        cityData.longitude,
        units
    );

    const current = weatherData.current;

    return {
        city: cityData.name,
        country: cityData.country,
        temperature: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        weatherCode: current.weather_code
    };
}

async function fetchForecast(city, units = 'celsius') {
    const cityData = await getCityCoordinates(city);
    const weatherData = await fetchWeatherData(
        cityData.latitude,
        cityData.longitude,
        units
    );

    const daily = weatherData.daily;
    const forecasts = [];

    for (let i = 1; i <= 5; i++) {
        forecasts.push({
            date: new Date(daily.time[i]),
            tempMax: Math.round(daily.temperature_2m_max[i]),
            tempMin: Math.round(daily.temperature_2m_min[i]),
            weatherCode: daily.weather_code[i]
        });
    }

    return forecasts;
}

function getWeatherInfo(code) {
    const weatherCodes = {
        0: { desc: 'Clear sky', emoji: '☀️' },
        1: { desc: 'Mainly clear', emoji: '🌤️' },
        2: { desc: 'Partly cloudy', emoji: '⛅' },
        3: { desc: 'Overcast', emoji: '☁️' },
        45: { desc: 'Foggy', emoji: '🌫️' },
        48: { desc: 'Icy fog', emoji: '🌫️' },
        51: { desc: 'Light drizzle', emoji: '🌧️' },
        53: { desc: 'Drizzle', emoji: '🌧️' },
        55: { desc: 'Heavy drizzle', emoji: '🌧️' },
        61: { desc: 'Light rain', emoji: '🌧️' },
        63: { desc: 'Rain', emoji: '🌧️' },
        65: { desc: 'Heavy rain', emoji: '🌧️' },
        71: { desc: 'Light snow', emoji: '🌨️' },
        73: { desc: 'Snow', emoji: '🌨️' },
        75: { desc: 'Heavy snow', emoji: '❄️' },
        77: { desc: 'Snow grains', emoji: '🌨️' },
        80: { desc: 'Light showers', emoji: '🌦️' },
        81: { desc: 'Showers', emoji: '🌦️' },
        82: { desc: 'Heavy showers', emoji: '🌧️' },
        85: { desc: 'Snow showers', emoji: '🌨️' },
        86: { desc: 'Heavy snow showers', emoji: '🌨️' },
        95: { desc: 'Thunderstorm', emoji: '⛈️' },
        96: { desc: 'Thunderstorm with hail', emoji: '⛈️' },
        99: { desc: 'Thunderstorm with hail', emoji: '⛈️' }
    };

    return weatherCodes[code] || { desc: 'Unknown', emoji: '🌡️' };
}
