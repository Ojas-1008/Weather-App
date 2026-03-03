import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
    console.error('ERROR: OPENWEATHER_API_KEY not found in .env file');
    process.exit(1);
}

// Read the source script
const scriptPath = path.join(import.meta.dirname, 'script.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Replace the placeholder with actual API key
scriptContent = scriptContent.replace(
    "const API_KEY = 'YOUR_FALLBACK_KEY';",
    `const API_KEY = '${API_KEY}';`
);

// Write to dist folder
const distDir = path.join(import.meta.dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

const distScriptPath = path.join(distDir, 'script.js');
fs.writeFileSync(distScriptPath, scriptContent, 'utf8');

console.log('✓ Build complete: dist/script.js created with API key injected');
