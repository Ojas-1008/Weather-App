### Step 1: Project Initialization & Selectors
*Goal: Connect your files and grab all HTML elements so JavaScript can control them.*

1.  **Link the Script:**
    *   In `index.html`, add `<script src="script.js" defer></script>` right before the closing `</body>` tag. The `defer` attribute ensures the HTML loads completely before the script runs, preventing "null element" errors.
2.  **Create a Selector Object:**
    *   Instead of scattered variables, create a single object (e.g., `const elements = {}`) to store all your DOM selections.
    *   **Action:** Use `document.getElementById()` to select these specific IDs from your HTML:
        *   `searchInput` → `#search-input`
        *   `searchBtn` → `#search-btn`
        *   `locationBtn` → `#location-btn`
        *   `weatherContainer` → `#weather-container`
        *   `errorContainer` → `#error-container`
        *   `errorMessage` → `#error-message`
        *   `welcomePopup` → `#welcome-popup`
        *   `historyList` → `#history-list`
        *   `unitRadios` → Select both radio inputs inside `#unit-toggle-container`
        *   `clock` → `#clock`
3.  **Define API Constants:**
    *   Create a constant for your API Base URL (e.g., OpenWeatherMap).
    *   Create a constant for your API Key.
    *   *Best Practice:* Add a comment above the key reminding yourself never to commit this to public repositories (like GitHub).

### Step 2: Core Data Logic (The Engine)
*Goal: Create reusable functions to fetch and process data.*

1.  **Create `fetchWeatherData(query, type)`:**
    *   This function should accept a `query` (city name or coordinates) and a `type` (e.g., 'city' or 'coords').
    *   **Logic:**
        *   Construct the API URL dynamically based on the `type`.
        *   Use `fetch()` inside a `try...catch` block.
        *   **Check Status:** Before parsing JSON, check `if (!response.ok)`. If false, throw a new Error with a specific message (e.g., "City not found").
        *   **Parse:** Use `await response.json()` to get the data object.
        *   **Return:** Return the processed data to be used by the UI function.
2.  **Create `updateWeatherUI(data)`:**
    *   This function takes the JSON data and updates the HTML.
    *   **Logic:**
        *   Select the elements inside `#weather-container` (City, Temp, Description, etc.).
        *   Update their `.textContent` or `.innerText`.
        *   **Unit Conversion:** Check which radio button is checked. If Fahrenheit, convert the temperature from the API (usually Celsius) before displaying.
        *   **Visibility:** Remove the `.hidden` class from `#weather-container` and add it to `#error-container` to ensure only one shows at a time.
3.  **Create `showError(message)`:**
    *   **Logic:**
        *   Set `#error-message` text to the provided message.
        *   Remove `.hidden` from `#error-container`.
        *   Add `.hidden` to `#weather-container`.
        *   **Auto-Hide:** Use `setTimeout()` to hide the error after 5 seconds automatically.

### Step 3: Event Listeners (User Interaction)
*Goal: Make the buttons and inputs work.*

1.  **Search Button Click:**
    *   Add a `click` listener to `#search-btn`.
    *   **Logic:** Get the value from `#search-input`. Validate it (ensure it's not empty). Call `fetchWeatherData()`.
2.  **Enter Key Support:**
    *   Add a `keydown` listener to `#search-input`.
    *   **Logic:** Check if `event.key === 'Enter'`. If yes, trigger the same logic as the Search Button.
3.  **Geolocation Button:**
    *   Add a `click` listener to `#location-btn`.
    *   **Logic:** Call `navigator.geolocation.getCurrentPosition()`.
        *   **Success:** Pass `position.coords.latitude` and `longitude` to `fetchWeatherData()`.
        *   **Error:** Catch permission denied errors and call `showError("Location access denied. Please search manually.")`.
4.  **Unit Toggle:**
    *   Add `change` listeners to the radio buttons in `#unit-toggle-container`.
    *   **Logic:** When changed, save the preference to LocalStorage (see Step 4) and re-render the current temperature if data exists.
5.  **Refresh Button:**
    *   Add a `click` listener to `#refresh-btn`.
    *   **Logic:** Simply call `location.reload()` to reset the page.

### Step 4: Storage & Persistence (Memory)
*Goal: Save user preferences and history.*

1.  **Cookies (Welcome Popup):**
    *   **On Load:** Create a helper function `getCookie(name)`. Check for a cookie named `visited`.
    *   **Logic:** If the cookie is missing, remove the `.hidden` class from `#welcome-popup`.
    *   **On Close:** Add a click listener to the close button inside the popup. When clicked, set the `visited` cookie with an expiration date of 30 days and add `.hidden` to the popup.
2.  **Local Storage (Units):**
    *   **On Load:** Check `localStorage.getItem('tempUnit')`. If it exists, programmatically check the corresponding radio button.
    *   **On Change:** When the user toggles units, save the value ('C' or 'F') using `localStorage.setItem()`.
3.  **Session Storage (History):**
    *   **On Search Success:** After a successful fetch, get the current city name.
    *   **Logic:**
        *   Retrieve the existing array from `sessionStorage` (parse it from JSON).
        *   Add the new city to the array (avoid duplicates if you want).
        *   Save back to `sessionStorage` (stringify the array).
        *   **Render:** Create a function `renderHistory()` that loops through this array and creates `<li>` elements inside `#history-list`.
        *   **Interaction:** Add click listeners to these new `<li>` elements to re-trigger the search for that city.

### Step 5: Optimization (Debouncing)
*Goal: Stop the API from being flooded while typing.*

1.  **Create `debounce(func, delay)`:**
    *   This is a helper function. It returns a new function that delays execution.
    *   **Logic:**
        *   Inside, declare a `timeout` variable.
        *   Return a function that clears the existing `timeout` and sets a new one using `setTimeout()`.
2.  **Apply to Input:**
    *   Instead of attaching the search logic directly to the `input` event on `#search-input`, wrap your search function in `debounce(searchFunction, 800)`.
    *   **Result:** The API only calls 800ms after the user *stops* typing.

### Step 6: BOM & Timing (Dynamic Features)
*Goal: Make the app feel alive.*

1.  **Real-Time Clock:**
    *   Create a function `updateClock()`.
    *   **Logic:** Create a new `Date()` object, format the time string (HH:MM:SS), and update `#clock`.
    *   **Interval:** Use `setInterval(updateClock, 1000)` to run this every second.
2.  **Window Resize Check:**
    *   Add a `resize` event listener to `window`.
    *   **Logic:** Use `window.innerWidth` to check if the screen is mobile-sized. You can use this to toggle specific CSS classes if needed (though your CSS media queries handle most of this).
3.  **Console Info:**
    *   On load, log `window.history.length` to the console. This is a safe way to practice BOM without affecting the UI.

### Step 7: Error Handling & Edge Cases
*Goal: Ensure the app doesn't crash.*

1.  **Network Errors:**
    *   In your `fetch` catch block, check specifically for `TypeError` (which usually means offline). Show a specific "Check your internet connection" message.
2.  **Invalid Input:**
    *   Before fetching, check if the input contains only numbers or special characters. If so, show a validation error immediately without calling the API.
3.  **Empty Storage:**
    *   When reading from Local/Session storage, always check if the result is `null` before trying to `JSON.parse()` it.
4.  **Long City Names:**
    *   Your CSS (`#city-name`) already has `overflow-wrap: break-word`. Ensure your JS doesn't inject any HTML tags into the city name to prevent XSS attacks (stick to `.textContent` instead of `.innerHTML`).

### Step 8: Final Code Organization
*Goal: Keep `script.js` clean.*

1.  **Structure:** Organize your file in this order:
    *   **Constants & Selectors** (Top)
    *   **Helper Functions** (Cookie helpers, Debounce, Formatters)
    *   **Core Logic** (Fetch, Update UI)
    *   **Event Listeners** (Bottom)
    *   **Initialization** (Call initial functions like `updateClock()` and `checkCookies()` at the very bottom)
2.  **Comments:** Add comments above each function block explaining *what* it does, not just *how*.
3.  **Cleanup:** Remove any `console.log()` statements that were used for debugging before sharing the project.