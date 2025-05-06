# Live Random Calculator

## Overview
The Live Random Calculator is a web application that generates and visualizes random digit sequences using different methods (Pi digits, Gaussian distribution, Perlin noise, and Linear Congruential Generator). It displays the frequency of each digit (0–9) in a bar chart, updating in real-time as digits are processed. The app includes an optional interactive guessing game where users can predict which digit will have the most instances after a set number of digits, with results displayed automatically upon completion if a guess is submitted.

## Features
- **Multiple Generation Methods**: Choose between four digit generation methods:
  - **Pi Digits**: Uses a precomputed array of Pi digits (repeating as needed).
  - **Gaussian Digits**: Generates digits using a Gaussian distribution (Box-Muller transform).
  - **Perlin Noise Digits**: Generates digits using Perlin noise for a natural, smooth distribution.
  - **LCG Digits**: Generates digits using a Linear Congruential Generator for a uniform pseudo-random distribution.
- **Real-Time Visualization**: 
  - A bar chart updates every 50 digits during calculation, showing the frequency of each digit.
  - Each bar displays a persistent label above it with the exact count (e.g., "Count: 42") and tally (count divided by 5, rounded up, e.g., "Tally: 9"), visible without hovering.
  - The digit with the highest count (or the first to reach an internal target, set to 10% of total digits) is highlighted in dark red (`rgb(139, 0, 0)`) during and after calculation, updating dynamically as the lead changes.
- **Interactive Feedback**:
  - Live display of the current digit being processed and the total digits processed (e.g., "Processed: 500/1000 digits").
  - A summary report appears below the chart after calculation, listing each digit’s tally and count (e.g., "Digit 0: 21 tallies (Count: 102)").
- **Optional Guessing Game**:
  - Users can choose to guess which digit (0–9) will have the most instances after the specified number of digits are processed.
  - The guess section is visible by default above the chart, allowing users to enter and submit a guess before starting the calculation.
  - A "Submit Guess" button saves the guess, disabling further changes during calculation.
  - If a guess is submitted, the app automatically displays whether it was correct after calculation, identifying the digit(s) with the highest count (e.g., "Correct! Your guess (9) was one of the digits with the most instances (13 occurrences).").
  - If multiple digits tie for the highest count, any of them is considered a correct guess.
  - Results are stored in `sessionStorage` for analysis, and the guess input is re-enabled for the next calculation.
  - Guessing is optional; users can run calculations without submitting a guess.
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
   - Enter the number of digits to generate (between 100 and 10,000) in the "Number of Digits" input (defaults to 100).
   - Select a calculation type from the dropdown: "Pi Digits", "Gaussian Digits", "Perlin Noise Digits", or "LCG Digits".
3. **Play the Guessing Game (Optional)**:
   - In the "Guess Which Digit Will Have the Most Instances" section (visible above the chart), enter a digit (0–9).
   - Click "Submit Guess" to lock in your guess; a confirmation appears (e.g., "Guess submitted: Digit 5").
   - The guess input and submit button are disabled during calculation to prevent changes.
   - You can hide the guess section using the "Hide Guess Section" button if you don’t want to guess.
4. **Start the Calculation**:
   - Click the "Calculate" button to begin generating digits (no guess required).
   - Watch the chart update every 50 digits, with each bar showing its count and tally (e.g., "Count: 42\nTally: 9") and the leading digit highlighted in dark red.
   - The "Live Digit" display shows the current digit, and the "Processed" counter tracks progress.
   - After completion:
     - A summary report appears below the chart, listing each digit’s tally and count.
     - If a guess was submitted, the guess result is displayed automatically (e.g., "Correct! Your guess (9) was one of the digits with the most instances (13 occurrences).").
     - The guess input is re-enabled for the next calculation.

## Debugging Tips
- **Chart Not Updating**:
  - Check the browser console for errors.
  - Ensure you're using a local server to avoid CORS issues.
- **Flickering**:
  - The chart uses fixed dimensions and disabled animations to minimize flicker. If flickering occurs, note the browser and version, and share console logs.
- **Guess Issues**:
  - If the guess result is incorrect, verify the digit counts in the summary report and console logs.
  - If no guess result appears, confirm that a guess was submitted before calculation.
- **Labels Not Visible**:
  - Ensure the Chart.js Datalabels plugin is loaded correctly.
  - Check for CSS conflicts or browser-specific rendering issues.

## Future Improvements
- Add more digit generation methods (e.g., Mersenne Twister, chaotic maps).
- Allow users to adjust the chart update frequency.
- Enhance the guessing game with:
  - Historical guess accuracy tracking using `localStorage`.
  - Hints about expected maximum counts based on the number of digits.
  - A "Reset Guess" button to clear the current guess without hiding the section.
- Improve the UI with additional styling options, themes, or a downloadable summary report.
- Customize data label appearance (e.g., font size, background opacity) for better readability.

## License
This project is open-source and available under the MIT License.