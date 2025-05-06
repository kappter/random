# Live Pi Calculator

## Overview
The Live Pi Calculator is a web-based application that allows users to observe the calculation of Pi digits in real-time. As each digit is computed using an efficient algorithm, the application tallies the frequency of each digit (0-9) and displays this data in an interactive, upward-growing column chart. Users can either watch the live calculation process or engage in a guessing game to predict which digit will reach a specified count (e.g., 500 or 1000) first.

## Features
- **Live Calculation**: Watch Pi digits being calculated one by one, with the current digit displayed in real-time.
- **Dynamic Chart**: A column chart updates live, showing the frequency of each digit as it grows upward. The first digit to reach the target count is highlighted in red.
- **Progress Tracking**: A running total shows how many digits have been processed out of the total requested.
- **Guess Mode**: Optionally, users can toggle a guessing feature to predict which digit will hit a target count first, with feedback on their accuracy.
- **Customizable Input**: Users can specify the number of digits to calculate (minimum 100) and the target count for the guessing game.

## How to Use
1. **Open the App**: Load the `index.html` file in a web browser.
2. **Set Parameters**: Enter the desired number of digits to calculate in the input field and click "Start Calculation".
3. **Watch Live**: The current digit and progress will update as the calculation proceeds. The chart will reflect the tally of each digit in real-time.
4. **Toggle Guess Mode**: Click "Toggle Guess Mode" to enable or disable the guessing section. When enabled, input a target count and your guess (0-9), then click "Submit Guess" to check your prediction.
5. **Interpret Results**: The app will display whether your guess was correct or show the actual first digit to reach the target count.

## Installation
No installation is required. Simply download the following files and open `index.html` in a modern web browser:
- `index.html`
- `script.js`
- `styles.css`

The application relies on Chart.js, which is loaded via a CDN (Content Delivery Network). Ensure you have an internet connection for the chart functionality to work.

## Technical Details
- **Algorithm**: The Pi calculation uses a spigot algorithm, optimized for real-time digit generation.
- **Charting**: Powered by Chart.js, the chart displays 10 columns (one per digit) with upward growth, animated smoothly over 300ms.
- **Data Storage**: Digit frequencies are stored in `sessionStorage` for use in the guessing game after calculation completes.

## Contributing
Feel free to fork this repository and submit pull requests for enhancements or bug fixes. Suggestions for additional features (e.g., different visualization styles) are welcome.

## License
This project is open-source under the MIT License. See the `LICENSE` file for details (if included).

## Acknowledgements
- Pi calculation algorithm inspired by Rosetta Code.
- Chart.js for interactive charting capabilities.