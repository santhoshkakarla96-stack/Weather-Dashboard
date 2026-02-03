Weather Dashboard Application
A simple weather dashboard that fetches weather data and displays current weather and 5-day forecast, with user preferences saved in Local Storage.

Features
Search weather for any city worldwide
Display current weather with temperature, humidity, and wind speed
5-day weather forecast
Light/Dark theme toggle
Temperature unit toggle (Celsius/Fahrenheit)
User preferences saved in Local Storage
Responsive design for all devices
Loading states and error handling
Quick Start
No API key required! Just open index.html in your browser and start using it.

Open index.html in any web browser
Search for a city (e.g., "London", "New York", "Mumbai")
View current weather and 5-day forecast
Technologies Used
HTML5 - Semantic markup
CSS3 - Styling with CSS Variables, Flexbox, Grid
JavaScript (ES6+) - Async/await, Fetch API, DOM manipulation
Open-Meteo API - Free weather data (no API key needed)
Local Storage API - Saving user preferences
Project Structure
weather-dashboard/
├── index.html          
├── css/
│   └── styles.css      
├── js/
│   ├── api.js          
│   ├── storage.js      
│   └── app.js          
├── screenshots/        
└── README.md           
Code Structure Explanation
api.js
Contains functions to interact with Open-Meteo API using async/await:

getCityCoordinates(city) - Converts city name to coordinates
fetchWeatherData(lat, lon, units) - Gets raw weather data
fetchCurrentWeather(city, units) - Returns current weather
fetchForecast(city, units) - Returns 5-day forecast
getWeatherInfo(code) - Converts weather code to description
storage.js
Handles Local Storage operations:

savePreferences(prefs) - Saves user preferences to Local Storage
loadPreferences() - Loads saved preferences or returns defaults
updatePreference(key, value) - Updates a single preference
app.js
Main application logic:

init() - Initializes the app, loads preferences
getWeather(city) - Main function to fetch and display weather
displayCurrentWeather(data) - Renders current weather to DOM
displayForecast(data) - Renders forecast cards to DOM
Event listeners for search, theme toggle, and unit toggle
API Integration
This project uses the Open-Meteo API which is completely free and requires no API key.

Geocoding API (convert city to coordinates)
GET https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1
Weather API
GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,humidity...
Local Storage Implementation
User preferences are stored as a JSON object:

{
    defaultCity: 'London',
    units: 'celsius',      
    theme: 'light'         
}
Preferences are automatically loaded on app start and saved when changed.

Error Handling
The app handles various error scenarios:

City not found - Shows user-friendly message
Network errors - Generic error message
Empty search - Form validation prevents empty submissions
Testing
To test the application:

Open index.html in a browser
Search for a city (e.g., "London", "New York", "Mumbai")
Verify current weather displays correctly
Check that 5-day forecast shows
Toggle theme to dark mode - should persist after refresh
Change units to Fahrenheit - temperatures should update
Search for invalid city - error message should appear
Author
Created as part of learning JavaScript API integration and Local Storage.

Credits
Weather data provided by Open-Meteo (Free API)
