# Live Random Calculator

## Overview
The Live Random Calculator is a web application that generates and visualizes random digit sequences using different methods (Pi digits, Gaussian distribution, and Perlin noise). It displays the frequency of each digit (0-9) in a bar chart, allowing users to observe the distribution in real-time. The app also includes a guessing game where users predict which digit will reach a target count first.

## Features
- **Multiple Generation Methods**: Choose between three digit generation methods:
  - **Pi Digits**: Uses a precomputed array of Pi digits (repeating as needed).
  - **Gaussian Digits**: Generates digits using a Gaussian distribution (Box-Muller transform).
  - **Perlin Noise Digits**: Generates digits using Perlin noise for a natural, smooth distribution.
- **Real-Time Visualization**: 
  - A bar chart updates every 50 digits during calculation, showing the growing frequency of each digit.
  - Each bar includes a text overlay displaying the exact count (e.g., "Count: 42") and the tally (e.g., "Tally: 9", where tally is the count divided by 5, rounded up).
- **Interactive Feedback**:
  - Live display of the current digit being processed and the total digits processed.
  - The digit reaching the target count first is highlighted in red.
- **Guessing Game**:
  - Users can guess which digit will reach a specified target count first.
  - Results are stored in `sessionStorage` for post-calculation analysis.
- **Responsive Design**: The chart and UI are styled for clarity and usability, with fixed dimensions to prevent flickering.

## Setup
1. **Clone or Download the Files**:
   - Ensure you have the following files:
     - `index.html`: The main HTML file.
     - `styles.css`: Styles for the application.
     - `script.js`: JavaScript logic for digit generation, chart updates, and interactivity.
2. **Serve the Files**:
   - Due to CORS restrictions, you cannot run the app by opening `index.html` directly in a browser.
   - Use a local server, such as:
     ```bash
     npx http-server
     ```
   - Access the app at `http://localhost:8080` (or the port provided by your server).
3. **Dependencies**:
   - The app uses Chart.js and the Chart.js Datalabels plugin, loaded via CDN:
     - Chart.js: `https://cdn.jsdelivr.net/npm/chart.js`
     - Datalabels Plugin: `https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels`

## Usage
1. **Open the App**:
   - Navigate to the app URL in a modern browser (e.g., Chrome, Firefox, Edge).
2. **Configure the Calculation**:
   - Enter the number of digits to generate (between 100 and 10,000) in the "Number of Digits" input.
   - Select a calculation type from the dropdown: "Pi Digits", "Gaussian Digits", or "Perlin Noise Digits".
3. **Start the Calculation**:
   - Click the "Calculate" button to begin generating digits.
   - Watch the chart update in real-time as digits are processed:
     - Bars grow every 50 digits, reflecting the frequency of each digit.
     - Text overlays above each bar show the current count and tally.
   - The "Live Digit" display shows the current digit being processed.
   - The "Processed" counter shows progress (e.g., "Processed: 500/1000 digits").
4. **Play the Guessing Game**:
   - Expand the "Guess the First Digit to Reach Target" section.
   - Set a target count (e.g., 500) and guess a digit (0-9).
   - After the calculation completes, click "Check Guess" to see if your guess was correct.
   - The first digit to reach the target count will be highlighted in red on the chart.

## Debugging Tips
- **Chart Not Updating**:
  - Check the browser console for errors.
  - Ensure you're using a local server to avoid CORS issues.
- **Flickering**:
  - The chart uses fixed dimensions and disabled animations to minimize flicker. If flickering occurs, note the browser and version, and share console logs.
- **Console Logs**:
  - "Initializing chart": Logged once when the chart is created.
  - "Updating chart data with counts": Logged every 50 digits, showing the current counts.
  - "Final chart update": Logged at the end of the calculation.

## Future Improvements
- Add more digit generation methods (e.g., chaotic maps).
- Allow users to adjust the update frequency for the chart.
- Enhance the UI with additional styling options or themes.

## License
This project is open-source and available under the MIT License.