### 1. Project Setup & Structure
Before writing logic, organize your files. A clean structure helps you manage code as it grows.

*   **Folder Structure:**
    *   `index.html`: The skeleton of your app.
    *   `style.css`: All styling rules.
    *   `script.js`: All JavaScript logic.
*   **Best Practice:** Link your CSS and JS files in the HTML using relative paths. Keep your script tag at the bottom of the HTML body or use the `defer` attribute so the HTML loads before the script runs.

### 2. Phase 1: The User Interface (HTML & CSS)
Focus on creating a clean layout without worrying about functionality yet.

*   **HTML:** Create a semantic structure. You will need:
    *   A search container (Input field + Search Button).
    *   A weather display container (City name, Temperature, Description, Humidity, Wind Speed).
    *   An error message container (hidden by default).
*   **CSS:** Style the app to look modern. Use Flexbox or Grid to center elements. Ensure it looks good on mobile devices (responsive design).
*   **BOM Practice (Window):** Use `window.innerWidth` in your CSS media queries or JavaScript to detect if the user is on a mobile screen and adjust the layout class accordingly.

### 3. Phase 2: Core Logic (Fetch API & JSON)
This is the heart of the app. You will connect to a weather API (like OpenWeatherMap).

*   **API Key:** Sign up for a free API key. **Important:** Never share this key publicly.
*   **Fetch API:** Write a function that triggers when the search button is clicked. It should send a request to the weather API URL with the city name.
*   **JSON Parsing:**
    *   The API returns data in JSON format. Use `JSON.parse()` implicitly (via the `.json()` method in Fetch) to convert the response into a JavaScript object.
    *   **Practice:** When saving data to storage later, you will use `JSON.stringify()` to convert objects back into strings.
*   **DOM Manipulation:** Extract the temperature, city, and weather description from the parsed JSON object and update the HTML elements you created in Phase 1.

### 4. Phase 3: Input Optimization (Debouncing & Throttling)
To prevent sending too many requests to the API, you need to control how often the search function runs.

*   **Debouncing:** Apply this to the **Search Input field**.
    *   *Concept:* If the user is typing "London", you don't want to search for "L", then "Lo", then "Lon". You want to wait until they stop typing for a few milliseconds.
    *   *Implementation:* Create a function that resets a timer every time a key is pressed. Only execute the search function if the timer completes without interruption.
*   **Throttling (Optional Practice):** You can apply this to the **Window Resize** event. If you change layout based on screen size via JS, ensure the resize logic doesn't fire hundreds of times per second while dragging the window edge.

### 5. Phase 4: Storage & Persistence
You will implement three types of storage to understand their differences.

*   **Local Storage (User Preferences):**
    *   *Use Case:* Save the user's preferred temperature unit (Celsius or Fahrenheit).
    *   *Logic:* When the app loads, check Local Storage. If a preference exists, apply it. When the user toggles the unit, save the new preference using `JSON.stringify()` if storing an object, or a simple string.
*   **Session Storage (Search History):**
    *   *Use Case:* Keep a list of cities searched during the current tab session.
    *   *Logic:* Every time a search is successful, add the city name to an array stored in Session Storage. If the user refreshes the page, this list clears (because the session ends).
*   **Cookies (Visit Tracking):**
    *   *Use Case:* Set a cookie named `visited` when the user opens the app for the first time.
    *   *Logic:* On load, check if the cookie exists. If not, show a "Welcome to your Weather App" popup. If it does exist, do not show the popup. Set the cookie to expire in 30 days.

### 6. Phase 5: Browser Object Model (BOM) & Timing Events
This phase makes the app feel dynamic and aware of the browser environment.

*   **Navigator (Geolocation):**
    *   Add a "Use Current Location" button.
    *   Use `navigator.geolocation.getCurrentPosition()` to get latitude and longitude.
    *   Pass these coordinates to your Weather API instead of a city name.
*   **Location:**
    *   Add a "Refresh" button that uses `location.reload()` to restart the app state.
*   **History:**
    *   Log `window.history.length` to the console when the app loads. This helps you understand how many pages the user has visited in this tab.
*   **Timing Events:**
    *   **setTimeout:** When an error occurs (e.g., "City not found"), display the error message. Use `setTimeout` to automatically hide this message after 5 seconds so it doesn't clutter the screen.
    *   **setInterval:** Create a real-time clock on the app that updates every second. Alternatively, set an interval to auto-refresh the weather data every 10 minutes.
    *   **clearInterval:** Ensure you clear any active intervals if the user navigates away or closes the search modal to prevent memory leaks.

### 7. Phase 6: Error Handling (Async Code)
Network requests often fail. You must handle these gracefully.

*   **Try/Catch Blocks:** Wrap your Fetch API logic in `try...catch` blocks.
*   **HTTP Status Checks:** Check if the response `ok` property is true. If the API returns a 404 (City not found) or 401 (Unauthorized/API Key error), throw a custom error.
*   **User Feedback:** Never leave the user guessing. If the fetch fails, update the UI with a friendly message like "Could not connect to weather service" instead of leaving the screen blank.

### 8. Edge Cases to Consider
As you build, test these scenarios to ensure your app is robust:

1.  **No Internet Connection:** What happens if the user is offline? (Handle the network error gracefully).
2.  **Invalid Input:** What if the user searches for numbers only or special characters? (Validate input before sending to API).
3.  **API Rate Limits:** Free APIs have limits. If you hit the limit, display a specific message rather than a generic error.
4.  **Empty Storage:** What if Local Storage is empty when the app loads? (Ensure your code doesn't crash when trying to read null values).
5.  **Geolocation Denied:** What if the user clicks "Use Current Location" but blocks the permission in the browser? (Provide a fallback to manual search).
6.  **Long City Names:** Will the UI break if the city name is very long? (Use CSS text-overflow or wrapping).

### 9. Best Practices Checklist
*   **Variable Naming:** Use meaningful names (e.g., `fetchWeatherData` instead of `func1`).
*   **Separation of Concerns:** Keep HTML for structure, CSS for style, and JS for logic.
*   **Comments:** Comment complex logic, especially where you use Debouncing or Storage.
*   **Console Logging:** Use `console.log` during development to track data flow, but remove or minimize them in the final version.
*   **Code Reusability:** If you find yourself copying the same code (like getting an element by ID), create a helper function.

### Summary of Concept Mapping
| Concept | Where to use it in this App |
| :--- | :--- |
| **Fetch API** | Getting weather data from the server. |
| **JSON parse/stringify** | Parsing API response & saving search history to Storage. |
| **Error Handling** | Handling network failures & invalid cities. |
| **Local Storage** | Saving Temperature Unit preference. |
| **Session Storage** | Saving current session's search history. |
| **Cookies** | Tracking "First Visit" status. |
| **BOM (Navigator)** | Getting Geolocation. |
| **BOM (Window/Location)** | Checking screen size & reloading page. |
| **setTimeout** | Auto-hiding error messages. |
| **setInterval** | Updating a clock or auto-refreshing weather. |
| **Debouncing** | Limiting API calls while typing in search box. |