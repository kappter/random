# Live Random Calculator - Enhanced Edition

A web application that generates and visualizes random digit sequences using various algorithms across different number bases (2-12). Features real-time statistics, algorithm comparison, and an optional guessing game.

## 🎯 Key Features

### Base System Support (NEW!)
- **Multiple Number Bases**: Choose from binary (base 2) to duodecimal (base 12)
- **Dynamic Visualization**: Chart automatically adjusts to show the correct number of digits
- **Base-Specific Labels**: Uses 0-9 for standard digits, A-B for bases 11-12
- **Algorithm Compatibility**: Automatically disables algorithms that don't work with selected base

### Enhanced Algorithm Visualization (NEW!)
- **Algorithm Information Panel**: Displays algorithm type, distribution, and description
- **Real-Time Statistics**: Shows mean, standard deviation, and chi-square test results
- **Dynamic Highlighting**: Winning digits highlighted in dark red
- **Adjustable Update Frequency**: Choose update intervals (10, 50, 100, or 500 digits)

### 10 Random Generation Algorithms

#### Classic Algorithms
1. **Pi Digits** - Uses precomputed digits of Pi (base 10 only)
2. **Middle-Square** - Von Neumann's classic method with cycle detection
3. **LCG (Linear Congruential Generator)** - Classic PRNG with known parameters

#### Modern PRNGs
4. **Mersenne Twister** - High-quality PRNG with very long period (2^19937 - 1)
5. **Xorshift** - Fast PRNG using bitwise XOR operations

#### Mathematical/Chaotic
6. **Gaussian Distribution** - Box-Muller transform creating bell curve
7. **Logistic Map** - Chaotic dynamics (x_{n+1} = r * x_n * (1 - x_n))
8. **Perlin Noise** - Smooth, natural-looking randomness

#### Cryptographic/True Random
9. **Quantum Random (API)** - True random from ANU Quantum RNG API
10. **Cellular Automaton Rule 30** - Complex patterns from simple rules

### Interactive Features
- **Optional Guessing Game**: Predict which digit will appear most frequently
- **Live Digit Display**: Watch each digit as it's generated
- **Progress Tracking**: Real-time count of processed digits
- **Pause/Resume**: Control calculation flow
- **Copy to Clipboard**: Export generated digit sequences
- **Summary Report**: Detailed tally and count for each digit

## 🚀 Quick Start

### Option 1: Local Server (Recommended)
```bash
# Clone or download the repository
cd random-enhanced

# Start a local server (Python 3)
python3 -m http.server 8080

# Or use Node.js
npx http-server -p 8080

# Open in browser
# Navigate to http://localhost:8080
```

### Option 2: GitHub Pages
Deploy to GitHub Pages for instant hosting without a local server.

## 📖 Usage Guide

### Basic Usage
1. **Select Number Base**: Choose base 2-12 (default: 10)
2. **Click "Apply Base"**: Chart updates to show correct number of digits
3. **Choose Algorithm**: Select from dropdown (incompatible algorithms are grayed out)
4. **Set Digit Count**: Enter 100-10,000 digits to generate
5. **Click "Calculate"**: Watch the visualization in real-time!

### Advanced Features

#### Guessing Game
1. Enter a digit in the guess field (e.g., "5" for decimal, "A" for base 11+)
2. Click "Submit Guess" before calculation
3. Results appear automatically after completion

#### Pause/Resume
- Click "Pause" during calculation to freeze
- Click "Resume" to continue from where you left off

#### Update Frequency
- Adjust how often the chart updates (10, 50, 100, or 500 digits)
- Lower values = smoother animation but slightly slower
- Higher values = faster calculation but choppier updates

#### Statistics Panel
Watch real-time statistics update:
- **Mean**: Average digit value (expected: (base-1)/2 for uniform distribution)
- **Std Dev**: Standard deviation (measures spread)
- **Chi-Square**: Statistical test for uniformity (lower = more uniform)

## 🎓 Educational Value

### Understanding Number Bases
- **Binary (Base 2)**: Only 0 and 1 - foundation of computing
- **Octal (Base 8)**: Used in Unix file permissions
- **Decimal (Base 10)**: Standard human counting system
- **Duodecimal (Base 12)**: Proposed alternative with better divisibility

### Comparing Algorithms
Different algorithms show different characteristics:
- **Uniform Distribution**: LCG, Mersenne Twister, Xorshift, Quantum
- **Gaussian (Bell Curve)**: Gaussian Distribution
- **Chaotic**: Logistic Map, Rule 30
- **Smooth**: Perlin Noise
- **Deterministic**: Pi Digits

### Statistical Analysis
The chi-square test helps evaluate randomness:
- **Low values** (< 10): Good uniformity
- **High values** (> 20): Possible bias or patterns
- Expected value for base N: approximately N-1

## 🔧 Technical Details

### Technology Stack
- **Vanilla JavaScript**: No frameworks, pure JS
- **Chart.js**: Bar chart visualization
- **Chart.js Datalabels Plugin**: In-bar tally display
- **HTML5/CSS3**: Modern, responsive design

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

### Performance
- Smooth 60fps rendering using `requestAnimationFrame`
- Efficient generator functions for memory management
- Chart updates throttled to prevent flickering
- Handles up to 10,000 digits smoothly

## 📊 Algorithm Details

### Base Compatibility Matrix

| Algorithm | Base 2 | Base 3-9 | Base 10 | Base 11-12 |
|-----------|--------|----------|---------|------------|
| Pi Digits | ❌ | ❌ | ✅ | ❌ |
| Gaussian | ✅ | ✅ | ✅ | ✅ |
| Perlin | ✅ | ✅ | ✅ | ✅ |
| LCG | ✅ | ✅ | ✅ | ✅ |
| Mersenne | ✅ | ✅ | ✅ | ✅ |
| Logistic | ✅ | ✅ | ✅ | ✅ |
| Middle-Square | ✅ | ✅ | ✅ | ✅ |
| Xorshift | ✅ | ✅ | ✅ | ✅ |
| Quantum | ✅ | ✅ | ✅ | ✅ |
| Rule 30 | ✅ | ✅ | ✅ | ✅ |

**Note**: Pi Digits only works in base 10 because we use precomputed base-10 digits. Other algorithms are adapted to work with any base.

### Algorithm Adaptations for Different Bases

#### Gaussian Distribution
```javascript
// Adapts mean and standard deviation based on base
mean = (base - 1) / 2
stdDev = base / 6  // Ensures ~99.7% within range
```

#### Generic Mapping
Most algorithms generate values in [0, 1) range, then map to digits:
```javascript
digit = Math.floor(value * base) % base
```

## 🎨 UI Components

### Algorithm Info Panel
- **Gradient Background**: Purple gradient for visual appeal
- **Type Badge**: Shows algorithm category (Deterministic, Pseudo-random, etc.)
- **Distribution Badge**: Shows expected distribution pattern
- **Statistics Grid**: Real-time mean, std dev, and chi-square

### Chart Features
- **Dynamic Bar Count**: Adjusts from 2 bars (binary) to 12 bars (duodecimal)
- **Color Gradient**: Light to dark blue for visual distinction
- **Winner Highlighting**: Dark red for digits with highest count
- **Tally Display**: Shows count/5 inside each bar
- **Responsive Sizing**: Adapts to container width

## 🐛 Troubleshooting

### Chart Not Updating
- Ensure you're using a local server (not file://)
- Check browser console for errors
- Try refreshing the page

### Quantum Random Fails
- Requires internet connection for API access
- Automatically falls back to LCG if API unavailable
- Check console for API error messages

### Algorithm Grayed Out
- Some algorithms only work with specific bases
- Pi Digits requires base 10
- Select a compatible algorithm or change base

### Flickering or Lag
- Reduce update frequency (use 100 or 500 instead of 10)
- Lower digit count for smoother animation
- Close other browser tabs to free resources

## 🔮 Future Enhancements

### Potential Additions
- [ ] More algorithms (PCG, Xoshiro256++, RANDU, Sobol)
- [ ] Algorithm comparison mode (side-by-side)
- [ ] Export chart as image
- [ ] Historical guess tracking with localStorage
- [ ] Customizable color schemes
- [ ] 3D visualization for pattern detection
- [ ] Algorithm performance benchmarks
- [ ] Educational tooltips and tutorials

### Community Contributions
Feel free to suggest new algorithms or features! Particularly interested in:
- Modern PRNGs (PCG, Xoshiro)
- Quasi-random sequences (Sobol, Halton)
- Cryptographic PRNGs (ChaCha, BBS)
- Historical algorithms (RANDU as cautionary example)

## 📝 License

This project is open-source and available under the MIT License.

## 🙏 Acknowledgments

- **Chart.js**: Excellent charting library
- **ANU QRNG**: Quantum random number API
- **Algorithm Creators**: Mersenne, Perlin, Marsaglia, Wolfram, and many others
- **Community**: Thanks to all who test and provide feedback!

## 📧 Contact

For questions, suggestions, or bug reports, please open an issue on GitHub.

---

**Enjoy exploring randomness across different number bases!** 🎲
