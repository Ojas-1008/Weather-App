// ------------------------------------------------------------
// 1. Centralized DOM Selection
// Stores references to all frequently used DOM elements
// ------------------------------------------------------------
const elements = {
    // Input and button elements for user interaction
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    locationBtn: document.getElementById('location-btn'),
    refreshBtn: document.getElementById('refresh-btn'),

    // Display containers for weather data and errors
    weatherContainer: document.getElementById('weather-container'),
    errorContainer: document.getElementById('error-container'),
    errorMessage: document.getElementById('error-message'),

    // Weather Detail Selectors
    cityName: document.getElementById('city-name'),
    temperature: document.getElementById('temperature'),
    description: document.getElementById('description'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('wind-speed'),

    // Additional UI elements
    welcomePopup: document.getElementById('welcome-popup'),
    welcomeCloseBtn: document.getElementById('welcome-close-btn'),
    historyList: document.getElementById('history-list'),
    clock: document.getElementById('clock'),

    // Temperature unit toggle radios
    unitRadios: document.querySelectorAll('#unit-toggle-container input[type="radio"]')
};

// ------------------------------------------------------------
// 2. API Configuration
// ------------------------------------------------------------
// OpenWeatherMap API key - replace with your own key
const API_KEY = '487bf58b275238b5fa1c6e51ef5fbc79';

// Base endpoint for weather data requests
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

let currentWeatherData = null;

// ------------------------------------------------------------
// 3. Weather Data Fetching
// ------------------------------------------------------------

/**
 * Fetches weather data from OpenWeatherMap API
 * @param {string} query - City name or "lat,lon" coordinates
 * @param {string} type - Search type: 'city' or 'coords'
 * @returns {Promise<Object>} - Weather data from API
 */
async function fetchWeatherData(query, type) {
    let url = '';

    // Build API URL based on search type
    if (type === 'city') {
        // City search: encode name to handle spaces/special chars
        url = `${BASE_URL}?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric`;
    } else if (type === 'coords' && typeof query === 'object') {
    // Direct object destructuring - no split/join needed!
    const { lat, lon } = query;
    url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    } else {
        throw new Error('Invalid search type.');
    }

    try {
        // Make HTTP request to weather API
        const response = await fetch(url);

        // Check if API returned an error status
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP Error: ${response.status}`);
        }

        // Parse JSON response and return weather data
        const data = await response.json();
        return data;

    } catch (error) {
        // Log error for debugging and re-throw for UI handling
        console.error('Fetch Error:', error);
        throw error;
    }
}

// ------------------------------------------------------------
// 4. Updates the UI with weather data
// ------------------------------------------------------------

/**
 * @param {Object} data - The weather data object from API
 */
function updateWeatherUI(data) {

    currentWeatherData = data;

    // Check if user prefers Fahrenheit by examining checked radio button
    const isFahrenheit = Array.from(elements.unitRadios).some(radio =>
        radio.checked && radio.value === 'fahrenheit'
    );

    // Extract relevant fields from API response
    const city = data.name;
    let temp = data.main.temp; // API returns temperature in Celsius
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    // Convert temperature if Fahrenheit is selected
    let unitSymbol = '°C';
    if (isFahrenheit) {
        temp = (temp * 9 / 5) + 32;
        unitSymbol = '°F';
    }
    temp = Math.round(temp);

    // Populate weather information display elements
    elements.cityName.textContent = city;
    elements.temperature.textContent = `${temp}${unitSymbol}`;
    elements.description.textContent = description;
    elements.humidity.textContent = `Humidity: ${humidity}%`;
    elements.windSpeed.textContent = `Wind: ${windSpeed} m/s`;

    // Show weather container and hide error message
    elements.errorContainer.classList.add('hidden');
    elements.weatherContainer.classList.remove('hidden');
}

// ------------------------------------------------------------
// 5. Error Handling
// ------------------------------------------------------------

let errorTimeout = null; // State management for error timer

/**
 * Displays an error message and auto-hides it after 5 seconds
 * @param {string} message - The error message to display
 */
function showError(message) {
    // 1. Update Content
    elements.errorMessage.textContent = message;

    // 2. Manage Visibility (Mutually Exclusive)
    elements.errorContainer.classList.remove('hidden');
    elements.weatherContainer.classList.add('hidden');

    // 3. Reset Existing Timer (Prevent overlapping timeouts)
    if (errorTimeout) {
        clearTimeout(errorTimeout);
    }

    // 4. Trigger Animation (Shake)
    // Animate.css requires both animate__animated and animate__shakeX classes
    elements.errorContainer.classList.remove('animate__shakeX');
    elements.errorContainer.classList.add('animate__animated');
    void elements.errorContainer.offsetWidth; // Force reflow to restart animation
    elements.errorContainer.classList.add('animate__shakeX');

    // 5. Set Auto-Hide Timer
    errorTimeout = setTimeout(() => {
        elements.errorContainer.classList.add('hidden');
        errorTimeout = null; // Reset state
    }, 5000);
}

// ------------------------------------------------------------
// 6. Event Handlers
// ------------------------------------------------------------

/**
 * Centralized Search Logic
 * Called by both Click and Enter Key events
 */
async function handleSearch() {
    // 1. Get Value & Clean Whitespace
    const query = elements.searchInput.value.trim();

    // 2. Validation
    if (!query) {
        showError('Please enter a city name.');
        return;
    }

    try {
        // 3. Fetch Data (Await pauses until data arrives)
        const data = await fetchWeatherData(query, 'city');

        // 4. Update UI
        updateWeatherUI(data);

        addToHistory(data.name);

    } catch (error) {
        // 5. Error Handling
        showError(error.message);
    }
}

// ==========================================
// 7. Event Listeners (Wiring the UI)
// ==========================================

// 1. Search Button Click
elements.searchBtn.addEventListener('click', handleSearch);

// 2. Enter Key in Input Field
elements.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

/**
 * Wraps the Geolocation API in a Promise for async/await usage
 * @returns {Promise<GeolocationPosition>}
 */
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => resolve(position), // Success callback
            (error) => reject(error),        // Error callback
            {
                enableHighAccuracy: true,    // Try to get GPS level accuracy
                timeout: 5000,               // Wait max 5 seconds
                maximumAge: 0                // Don't use cached position
            }
        );
    });
}

elements.locationBtn.addEventListener('click', async () => {
    try {
        const position = await getCurrentLocation();
        const { latitude, longitude } = position.coords;

        // Pass an object directly - clean and efficient!
        const data = await fetchWeatherData(
            { lat: latitude, lon: longitude },
            'coords'
        );

        updateWeatherUI(data);
    } catch (error) {
        showError('Location access denied. Please search manually.');
    }
});

function getSavedUnitPreference() {
    const saved = localStorage.getItem('weatherApp_unitPreference');
    return saved === 'fahrenheit' ? 'fahrenheit' : 'celsius';
}

// Unit Toggle: Add change listener to each radio
elements.unitRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        // 1. Save preference to localStorage
        localStorage.setItem('weatherApp_unitPreference', event.target.value);

        // 2. Re-render if we have data
        if (currentWeatherData) {
            updateWeatherUI(currentWeatherData);
        }
    });
});

function initUnitToggle() {
    const savedUnit = getSavedUnitPreference();
    const radioToCheck = Array.from(elements.unitRadios).find(
        radio => radio.value === savedUnit
    );

    if (radioToCheck) {
        radioToCheck.checked = true;
    }
}

elements.refreshBtn.addEventListener('click', () => {
    elements.refreshBtn.textContent = 'Refreshing...';
    elements.refreshBtn.disabled = true;

    setTimeout(() => {
        location.reload();
    }, 300);
});

// ==========================================
// Cookie Helpers
// ==========================================

/**
 * Gets the value of a cookie by name
 * @param {string} name - The cookie name
 * @returns {string|null}
 */
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}

/**
 * Sets a cookie with expiration
 * @param {string} name
 * @param {string} value
 * @param {number} days - Expiration in days
 */
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/`;
}

// ==========================================
// Welcome Popup Initialization
// ==========================================

function initWelcomePopup() {
    // Check for existing 'visited' cookie
    const hasVisited = getCookie('visited');

    if (!hasVisited) {
        // First-time visitor: show popup
        elements.welcomePopup.classList.remove('hidden');
    }

    // Close button handler
    elements.welcomeCloseBtn.addEventListener('click', () => {
        // Mark as visited for 30 days
        setCookie('visited', 'true', 30);
        // Hide popup
        elements.welcomePopup.classList.add('hidden');
    });
}

const MAX_HISTORY = 5; // Limit history to 5 items
const STORAGE_KEY = 'weatherApp_history';

/**
 * Retrieves history array from sessionStorage
 * @returns {string[]}
 */
function getHistory() {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}


/**
 * Saves history array to sessionStorage
 * @param {string[]} history
 */
function saveHistory(history) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

/**
 * Adds a city to history, avoids duplicates, limits size
 * @param {string} city
 */
function addToHistory(city) {
    let history = getHistory();

    // Remove if exists (to move to top later)
    history = history.filter(item => item !== city);

    // Add to front
    history.unshift(city);

    // Limit size
    if (history.length > MAX_HISTORY) {
        history.pop();
    }

    saveHistory(history);
    renderHistory(); // Update UI
}

/**
 * Renders the history list in the UI
 */
function renderHistory() {
    const history = getHistory();
    elements.historyList.innerHTML = ''; // Clear current list

    history.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        // Store city name in data attribute for easy access later
        li.dataset.city = city;
        elements.historyList.appendChild(li);
    });
}

elements.historyList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        const city = event.target.dataset.city;
        elements.searchInput.value = city;
        handleSearch();
    }
});

// ==========================================
// 9. Performance Optimization (Debounce)
// ==========================================

/**
 * Creates a debounced version of a function
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 */
function debounce(func, delay) {
    let timeout;

    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

// Create a debounced version of handleSearch
const debouncedSearch = debounce(handleSearch, 1000);

// Add Input Event Listener (Live Search)
elements.searchInput.addEventListener('input', debouncedSearch);

// Initialize on page load
initWelcomePopup();

initUnitToggle();

renderHistory();