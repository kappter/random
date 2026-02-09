# Live Random Calculator

> **Choose your algorithm wisely.**

The Live Random Calculator is an interactive visualization tool that lets you explore, compare, and analyze how different random number generation algorithms behave over time.

From classic methods like Middle-Square and RANDU to modern generators like PCG and Xoshiro, this tool reveals why "random" is not a one-size-fits-all solution.

🔗 **Live Demo**: [https://kappter.github.io/random/](https://kappter.github.io/random/)

---

## 🎯 Overview

Designed for computer science education, game development, and anyone curious about algorithmic randomness, this tool provides real-time visualization, statistical analysis, and comprehensive educational information across 14 algorithms and 15 number bases (binary through hexadecimal).

### Key Features

- **14 Random Number Generation Algorithms** spanning classic, modern, mathematical, quasi-random, and cryptographic approaches
- **15 Number Bases** (2-16): Binary, Ternary, Quaternary, Quinary, Senary, Septenary, Octal, Nonary, Decimal, Undecimal, Duodecimal, Tridecimal, Tetradecimal, Pentadecimal, and Hexadecimal
- **Three Visualization Modes**:
  - **Bar Chart**: Real-time frequency distribution with actual counts displayed on bars
  - **Time Series**: Multi-line chart showing how each digit's count evolves over time
  - **Spiral**: Beautiful geometric visualization with color-coded digits spiraling outward from center
- **Statistical Analysis** including Mean, Standard Deviation, and Chi-Square goodness-of-fit test with explanatory tooltips
- **Speed Control** slider (10ms to 1000ms per digit) for classroom demonstrations
- **Step Mode** for single-digit generation and detailed analysis
- **Educational Content** with detailed information about each algorithm's theory, implementation, programming language usage, and real-world use cases
- **Interactive Guessing Game** to predict which digit will appear most frequently

---

## 🧮 Algorithms

### Classic Algorithms

**1. Pi Digits**
- **Type**: Deterministic, Uniform (Expected)
- **Description**: Uses the digits of Pi (π) converted to any base. While deterministic, Pi digits are expected to be uniformly distributed.
- **Use Cases**: Educational demonstrations, testing statistical analysis software, mathematical research on normal numbers

**2. Middle-Square Method** (von Neumann, 1949)
- **Type**: Pseudo-Random, Uniform
- **Description**: Historical PRNG that squares a number and extracts middle digits. Simple but has short cycles.
- **Use Cases**: Historical interest, teaching PRNG concepts, demonstrating algorithm limitations

**3. Linear Congruential Generator (LCG)**
- **Type**: Pseudo-Random, Uniform
- **Description**: Classic PRNG using formula: X(n+1) = (a·X(n) + c) mod m. Fast but has known statistical weaknesses.
- **Use Cases**: Legacy systems, teaching basic PRNG concepts, simple simulations

**4. RANDU** ⚠️
- **Type**: Pseudo-Random (Flawed), Uniform (Intended)
- **Description**: IBM's infamous 1960s PRNG with severe flaws. Points fall on 15 hyperplanes in 3D space!
- **Use Cases**: Educational cautionary tale, demonstrating importance of PRNG testing

### Modern PRNGs

**5. PCG (Permuted Congruential Generator)** (O'Neill, 2014)
- **Type**: Pseudo-Random, Uniform
- **Description**: Modern PRNG with excellent statistical properties. Superior to traditional LCGs.
- **Use Cases**: General-purpose random generation, simulations, games, Monte Carlo methods

**6. Xoshiro256++** (Blackman & Vigna, 2018)
- **Type**: Pseudo-Random, Uniform
- **Description**: State-of-the-art PRNG, currently considered the gold standard for general-purpose use.
- **Use Cases**: Default PRNG for new projects, high-performance simulations, game engines

**7. Mersenne Twister** (Matsumoto & Nishimura, 1997)
- **Type**: Pseudo-Random, Uniform
- **Description**: Very long period (2^19937-1), widely used PRNG. Industry standard for many years.
- **Use Cases**: Scientific computing, simulations, default in Python, R, MATLAB

**8. Xorshift** (Marsaglia, 2003)
- **Type**: Pseudo-Random, Uniform
- **Description**: Extremely fast PRNG using XOR and bit-shift operations. Good quality for its simplicity.
- **Use Cases**: Real-time systems, embedded devices, games, high-frequency trading

### Mathematical/Chaotic

**9. Gaussian Distribution** (Box-Muller Transform)
- **Type**: Pseudo-Random, Normal Distribution
- **Description**: Generates normally distributed values, then maps to uniform digits. Shows bell curve distribution.
- **Use Cases**: Statistical simulations, noise generation, testing distribution analysis

**10. Logistic Map** (May, 1976)
- **Type**: Chaotic, Uniform
- **Description**: Simple chaotic system: X(n+1) = r·X(n)·(1-X(n)). Demonstrates chaos theory.
- **Use Cases**: Chaos theory education, demonstrating sensitive dependence on initial conditions

**11. Perlin Noise** (Perlin, 1983)
- **Type**: Pseudo-Random, Smooth/Coherent
- **Description**: Gradient noise function creating smooth, natural-looking patterns. Not uniformly random.
- **Use Cases**: Procedural generation, terrain generation, texture synthesis, computer graphics

### Quasi-Random

**12. Sobol Sequence** (Sobol, 1967)
- **Type**: Quasi-Random (Low-Discrepancy)
- **Description**: Fills space more evenly than true random. Better coverage for numerical integration.
- **Use Cases**: Monte Carlo integration, optimization, financial modeling, ray tracing

### Cryptographic/True Random

**13. Quantum Random** (API-based)
- **Type**: True Random (Quantum)
- **Description**: Uses quantum phenomena for true randomness via ANU Quantum Random Numbers API.
- **Use Cases**: Cryptographic key generation, gambling, scientific experiments requiring true randomness

**14. Cellular Automaton Rule 30** (Wolfram, 1983)
- **Type**: Chaotic, Complex
- **Description**: Generates digits from Rule 30 cellular automaton evolution. Shows complex, random-like patterns.
- **Use Cases**: Random number generation in Mathematica, studying emergence of complexity

---

## 📊 Number Bases

The calculator supports 15 different number bases:

| Base | Name | Digits | Example |
|------|------|--------|---------|
| 2 | Binary | 0-1 | 1010110 |
| 3 | Ternary | 0-2 | 1201022 |
| 4 | Quaternary | 0-3 | 2130312 |
| 5 | Quinary | 0-4 | 3241403 |
| 6 | Senary | 0-5 | 4352514 |
| 7 | Septenary | 0-6 | 5463625 |
| 8 | Octal | 0-7 | 6574736 |
| 9 | Nonary | 0-8 | 7685847 |
| 10 | Decimal | 0-9 | 8796958 |
| 11 | Undecimal | 0-9, A | 98A7A69 |
| 12 | Duodecimal | 0-9, A-B | A9B8B7A |
| 13 | Tridecimal | 0-9, A-C | BAC9C8B |
| 14 | Tetradecimal | 0-9, A-D | CBDAD9C |
| 15 | Pentadecimal | 0-9, A-E | DCEBEAD |
| 16 | Hexadecimal | 0-9, A-F | EDFCFBE |

---

## 📈 Statistical Analysis

### Mean (Average)

The average value of generated digits.

**Expected value for uniform distribution in base b:**
```
μ = (b - 1) / 2
```

**Examples:**
- Base 2: μ = 0.5
- Base 10: μ = 4.5
- Base 16: μ = 7.5

### Standard Deviation

Measures the spread of digit values around the mean.

**Expected value for uniform distribution in base b:**
```
σ = √[(b² - 1) / 12]
```

**Examples:**
- Base 2: σ ≈ 0.50
- Base 10: σ ≈ 2.87
- Base 16: σ ≈ 4.61

### Chi-Square Test (χ²)

Tests how well the observed distribution matches the expected uniform distribution.

**Formula:**
```
χ² = Σ[(Observed_i - Expected)² / Expected]
```

where Expected = n / b (n = total digits, b = base)

**Interpretation:**
- **χ² < 10**: Excellent uniformity ⭐⭐⭐⭐⭐
- **χ² < 20**: Good uniformity ⭐⭐⭐⭐
- **χ² < 30**: Acceptable uniformity ⭐⭐⭐
- **χ² > 30**: Possible bias (investigate further)

---

## 🎓 Educational Use Cases

### Computer Science Classes

- **Algorithms**: Compare efficiency and quality of different PRNGs
- **Number Systems**: Visualize how algorithms behave in different bases
- **Statistics**: Understand uniform distribution and statistical testing
- **Chaos Theory**: Explore deterministic chaos with Logistic Map and Rule 30
- **Cryptography**: Discuss differences between pseudo-random and true random

### Mathematics Classes

- **Probability**: Empirical vs. theoretical probability
- **Statistics**: Chi-square test, hypothesis testing
- **Number Theory**: Properties of different number bases
- **Discrete Mathematics**: Modular arithmetic, bit operations

### Demonstrations

- Use **Speed Control** slider to slow down generation for step-by-step explanation
- Show **algorithm information cards** to explain theory and applications
- Compare **different algorithms** side-by-side to show quality differences
- Test in **hexadecimal** (base 16) to connect to computer memory and programming

---

## 🚀 Usage

### Basic Operation

1. **Select Base**: Choose a number base from 2 to 16
2. **Click "Apply Base"**: Activate the selected base
3. **Choose Algorithm**: Select from 14 different algorithms
4. **Set Parameters**:
   - Number of digits (100-10000)
   - Update frequency (10, 50, 100, or 500 digits)
   - Generation speed (10ms to 1000ms per digit)
5. **Click "Calculate"**: Start generation
6. **Observe**: Watch the bar chart update in real-time

### Advanced Features

- **Pause/Resume**: Pause generation at any point and resume later
- **Step Mode**: Generate one digit at a time (for detailed analysis)
- **Reset**: Clear all data and start fresh
- **Guessing Game**: Predict which digit will appear most frequently
- **Copy Digits**: Export the generated sequence for further analysis

### Tips for Educators

1. **Start with Pi in Base 10**: Familiar and shows expected uniform distribution
2. **Show RANDU**: Demonstrate why testing PRNGs is important
3. **Compare Bases**: Run the same algorithm in binary, decimal, and hexadecimal
4. **Use Slow Speed**: Set speed to 500-1000ms for classroom demonstrations
5. **Discuss Statistics**: Use chi-square values to discuss randomness quality

---

## 🔬 Technical Details

### Implementation

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charting**: Chart.js for real-time visualization
- **No Dependencies**: Pure JavaScript implementation of all algorithms
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Algorithm Compatibility

All algorithms work with all bases (2-16) except:
- **Quantum Random**: Requires internet connection for API access

### Performance

- Optimized for smooth real-time visualization
- Handles up to 10,000 digits efficiently
- Adjustable update frequency to balance smoothness vs. performance

---

## 📚 Mathematical Foundations

### Rejection Sampling

For bases that are not powers of 2, we use **rejection sampling** to ensure uniform distribution:

```javascript
const bitsNeeded = Math.ceil(Math.log2(base));
const maxValue = (1 << bitsNeeded) - 1;
const digit = bitBuffer & maxValue;

if (digit < base) {
  yield digit;  // Accept
} else {
  // Reject and try again
}
```

This ensures each digit has exactly probability 1/base.

### Cellular Automaton Rule 30

Rule 30 is defined by the update rule:

```
cell[i](t+1) = cell[i-1](t) XOR (cell[i](t) OR cell[i+1](t))
```

We use:
- **Toroidal boundaries** (wrap-around) to prevent stabilization
- **Center cell extraction** for maximum entropy
- **Random initialization** for different results on each run

See `RULE30_MATHEMATICAL_DOCUMENTATION.md` for complete mathematical analysis.

---

## 🐛 Known Limitations

1. **Quantum Random**: Requires internet connection; may be slow or unavailable
2. **Large Digit Counts**: Generating 10,000 digits may take time depending on speed setting
3. **Mobile Performance**: Very fast speeds (< 50ms) may lag on mobile devices
4. **Perlin Noise**: Not uniformly random by design (creates smooth patterns)
5. **Gaussian Distribution**: Shows bell curve, not uniform distribution

---

## 🔄 Version History

### Version 2.0 (February 2026)
- ✨ Added base system support (2-16)
- ✨ Added 4 new algorithms (PCG, Xoshiro256++, RANDU, Sobol)
- ✨ Added speed control slider
- ✨ Added detailed algorithm information cards
- ✨ Added statistical tooltips
- 🐛 Fixed Rule 30 bias issue (rejection sampling)
- 🐛 Fixed Rule 30 determinism (random initialization)
- 🐛 Fixed Pi Digits to work in all bases
- 🐛 Fixed Middle-Square Method base 2 bug
- 🐛 Fixed PCG base 2 bug
- 📚 Added comprehensive mathematical documentation

### Version 1.0 (Initial Release)
- 🎉 Initial release with 10 algorithms
- 📊 Base 10 (decimal) only
- 📈 Real-time bar chart visualization
- 🎮 Guessing game feature

---

## 📖 References

1. **Knuth, D. E. (1997)**. *The Art of Computer Programming, Volume 2: Seminumerical Algorithms*. Addison-Wesley.

2. **Matsumoto, M., & Nishimura, T. (1998)**. "Mersenne twister: a 623-dimensionally equidistributed uniform pseudo-random number generator". *ACM Transactions on Modeling and Computer Simulation*, 8(1), 3-30.

3. **O'Neill, M. E. (2014)**. "PCG: A Family of Simple Fast Space-Efficient Statistically Good Algorithms for Random Number Generation". *Harvey Mudd College Technical Report*.

4. **Blackman, D., & Vigna, S. (2018)**. "Scrambled Linear Pseudorandom Number Generators". *arXiv preprint arXiv:1805.01407*.

5. **Wolfram, S. (1983)**. "Statistical mechanics of cellular automata". *Reviews of Modern Physics*, 55(3), 601-644.

6. **Sobol, I. M. (1967)**. "On the distribution of points in a cube and the approximate evaluation of integrals". *USSR Computational Mathematics and Mathematical Physics*, 7(4), 86-112.

7. **L'Ecuyer, P. (2012)**. "Random number generation". In *Handbook of Computational Statistics* (pp. 35-71). Springer.

---

## 👨‍🏫 For Educators

### Lesson Plan Ideas

**Lesson 1: Introduction to Random Numbers**
- Start with Pi Digits in base 10
- Discuss deterministic vs. random
- Show chi-square test interpretation

**Lesson 2: Number Bases**
- Compare same algorithm in binary, octal, decimal, hexadecimal
- Discuss why hexadecimal is used in computing
- Show how digit labels change (0-9, A-F)

**Lesson 3: PRNG Quality**
- Compare LCG, Mersenne Twister, Xoshiro256++
- Show RANDU as a cautionary tale
- Discuss importance of statistical testing

**Lesson 4: Chaos Theory**
- Explore Logistic Map and Rule 30
- Discuss deterministic chaos
- Show sensitive dependence on initial conditions

**Lesson 5: Applications**
- Discuss when to use each algorithm
- Cryptographic vs. non-cryptographic uses
- Monte Carlo methods with Sobol Sequence

### Assessment Ideas

- Have students predict which algorithm will have the lowest chi-square
- Ask students to explain why RANDU is flawed
- Have students calculate expected mean and standard deviation for different bases
- Challenge students to implement their own PRNG

---

## 🤝 Contributing

This project is open for educational use. Suggestions for improvements, additional algorithms, or bug reports are welcome!

---

## 📄 License

This project is created for educational purposes. Free to use in academic settings.

---

## 👤 Author

Created by Kappter with assistance from Manus AI

**For questions or feedback**: Submit issues on GitHub

---

## 🙏 Acknowledgments

- Stephen Wolfram for Rule 30 and cellular automaton research
- Donald Knuth for foundational work on PRNGs
- Melissa O'Neill for PCG algorithm
- David Blackman and Sebastiano Vigna for Xoshiro
- All the mathematicians and computer scientists who developed these algorithms

---

**🎲 Happy Random Number Generating! ✨**
