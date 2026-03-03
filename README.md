# Weather App

A modern, responsive weather application built with vanilla JavaScript, HTML5, and CSS3. Fetches real-time weather data from the OpenWeatherMap API with a beautiful glassmorphism UI design.

![Weather App](https://img.shields.io/badge/Weather-App-blue?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow?style=for-the-badge&logo=javascript)
![API](https://img.shields.io/badge/API-OpenWeatherMap-green?style=for-the-badge)

## ✨ Features

- 🌍 **City Search** - Search weather for any city worldwide
- 📍 **Geolocation** - Get weather for your current location with one click
- 🌡️ **Unit Toggle** - Switch between Celsius and Fahrenheit
- 📜 **Search History** - Quick access to your last 5 searched cities
- 🎨 **Glassmorphism UI** - Modern, translucent design with gradient backgrounds
- 🎭 **Smooth Animations** - Powered by Animate.css and AOS library
- 🍪 **Welcome Popup** - First-time visitor greeting with cookie persistence
- ⏰ **Real-Time Clock** - Live clock display
- 🔄 **Auto-Refresh** - Refresh weather data with a single click
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- 🔒 **Secure API Keys** - Environment variable support for production

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- An OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weather-app.git
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your API key**
   
   Create a `.env` file in the root directory:
   ```bash
   echo "OPENWEATHER_API_KEY=your_api_key_here" > .env
   ```
   
   Or manually create `.env` and add:
   ```
   OPENWEATHER_API_KEY=your_api_key_here
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   
   Navigate to `http://localhost:3000` (or the port shown in terminal)

## 📁 Project Structure

```
Weather/
├── index.html          # Main HTML file
├── style.css           # Styles with CSS custom properties
├── script.js           # Source JavaScript (template)
├── build.js            # Build script that injects API key
├── .env                # Environment variables (NOT committed)
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies and scripts
└── dist/
    └── script.js       # Built JavaScript with API key
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Builds the project and injects API key |
| `npm run dev` | Build and serve locally |

## 🌐 Deploy to Netlify

### Option 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub** (you've already done this!)

2. **Get an API key** from [OpenWeatherMap](https://openweathermap.org/api) (free)

3. **Go to [Netlify](https://app.netlify.com/)** and sign in

4. **Click "Add new site" → "Import an existing project"**

5. **Connect to GitHub** and select your `Weather-App` repository

6. **Configure build settings:**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

7. **Add Environment Variable:**
   - Click **"Environment variables"** (or go to Site Settings → Environment Variables)
   - Click **"Add a variable"**
   - Key: `OPENWEATHER_API_KEY`
   - Value: `your_actual_api_key_here`
   - Click **"Save"**

8. **Click "Deploy site"**

That's it! Netlify will build and deploy your app. 🎉

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link to your site (or create new)
netlify link

# Set environment variable
netlify env:set OPENWEATHER_API_KEY your_api_key_here

# Deploy
netlify deploy --prod
```

## 🎨 UI Libraries Used

- **[Animate.css](https://animate.style/)** - CSS animation library
- **[AOS (Animate On Scroll)](https://michalsnik.github.io/aos/)** - Scroll animation library

## 🔐 Security Note

This project uses a build-time injection system to keep API keys secure:

- ✅ `.env` file is **never** committed to Git
- ✅ API key is injected during build into `dist/script.js`
- ✅ Source `script.js` contains only a placeholder

**For production deployment:**
1. Set your API key in `.env`
2. Run `npm run build`
3. Deploy the `dist/` folder contents

## 🌐 API Reference

This app uses the [OpenWeatherMap Current Weather API](https://openweathermap.org/current):

```
GET https://api.openweathermap.org/data/2.5/weather
```

**Parameters:**
- `q` - City name (for text search)
- `lat, lon` - Coordinates (for geolocation)
- `appid` - API key
- `units=metric` - Temperature in Celsius (converted to Fahrenheit if selected)

## 📱 Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Latest |
| Firefox | Latest |
| Safari | Latest |
| Edge | Latest |
| Mobile Safari | iOS 12+ |
| Chrome Mobile | Android 5+ |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Code Structure

The JavaScript is organized into clear sections:

1. **DOM Selection** - Centralized element references
2. **API Configuration** - Constants and endpoints
3. **Weather Data Fetching** - Async API calls
4. **UI Updates** - Dynamic DOM manipulation
5. **Error Handling** - User-friendly error messages
6. **Event Handlers** - User interaction logic
7. **Event Listeners** - Wiring UI to functions
8. **Helper Functions** - Cookies, history, utilities
9. **Performance** - Debounced search input

## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons and animations from community libraries
- Inspired by modern glassmorphism design trends

---

<div align="center">

**Built with ❤️ using Vanilla JavaScript**

[⬆ Back to Top](#weather-app)

</div>
