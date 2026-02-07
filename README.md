# Live Random Calculator

**Choose your algorithm wisely.**

An interactive, educational web application for **visualizing, comparing, and understanding random number generation algorithms** across multiple number bases.

🔗 **Live Demo**: [https://kappter.github.io/random/](https://kappter.github.io/random/)

---

## Why this exists

“Random” is not a single thing.

Different algorithms produce very different patterns, biases, and behaviors—even when they *look* random at first glance. In games, simulations, statistics, and cryptography, choosing the wrong random number generator can quietly undermine results.

The **Live Random Calculator** makes those differences visible. It lets you watch randomness unfold in real time, compare algorithms side-by-side, and evaluate their statistical behavior across number bases from **binary to hexadecimal**.

---

## What you can do

* Visualize digit frequency **live**
* Compare classic, modern, chaotic, quasi-random, and true random sources
* Switch instantly between **15 number bases (2–16)**
* Observe statistical convergence—or failure
* Teach (or learn) why algorithm choice matters

---

## Features

* **14 Random Number Generation Algorithms**

  * Classic, modern, mathematical, chaotic, quasi-random, and quantum
* **15 Number Bases**

  * Binary → Hexadecimal (including rarely explored bases)
* **Real-Time Visualization**

  * Dynamic bar charts of digit frequency
* **Statistical Analysis**

  * Mean, standard deviation, chi-square goodness-of-fit
* **Speed Control**

  * From step-by-step classroom demos to fast convergence
* **Algorithm Info Cards**

  * History, theory, strengths, and weaknesses
* **Interactive Guessing Game**

  * Predict which digit will dominate
* **Pure JavaScript**

  * No frameworks, no build step, runs anywhere

---

## Algorithms included

### Classic & Historical

* **Pi Digits** — deterministic digits expected to behave uniformly
* **Middle-Square Method** — von Neumann’s famously fragile PRNG
* **Linear Congruential Generator (LCG)** — fast, simple, statistically weak
* **RANDU ⚠️** — a legendary cautionary tale in bad randomness

### Modern PRNGs

* **PCG** — compact, statistically strong modern generator
* **Xoshiro256++** — state-of-the-art general-purpose PRNG
* **Mersenne Twister** — long-period industry standard
* **Xorshift** — extremely fast and surprisingly effective

### Mathematical & Chaotic

* **Gaussian Distribution** — normal (bell-curve) behavior
* **Logistic Map** — deterministic chaos in action
* **Perlin Noise** — smooth, coherent randomness

### Quasi-Random

* **Sobol Sequence** — low-discrepancy sampling for even coverage

### True / Complex Sources

* **Quantum Random** — API-based quantum entropy
* **Cellular Automaton Rule 30** — emergent complexity from simple rules

---

## Number bases (2–16)

Explore how the *same* algorithm behaves differently across bases:

Binary, ternary, quaternary, quinary, senary, septenary, octal, nonary, decimal, undecimal, duodecimal, tridecimal, tetradecimal, pentadecimal, and hexadecimal.

Seeing bias appear (or disappear) across bases is often the moment everything clicks.

---

## Statistics you can see

* **Mean** — expected value for a uniform distribution
* **Standard Deviation** — spread of digit values
* **Chi-Square (χ²)** — how closely results match uniform randomness

These metrics update live as digits are generated, making abstract statistics concrete.

---

## Educational use cases

### Computer Science

* Algorithm quality and tradeoffs
* PRNG testing and failure modes
* Number systems and representations
* Chaos vs. randomness
* Cryptographic vs. non-cryptographic use

### Mathematics & Statistics

* Empirical vs. theoretical probability
* Hypothesis testing (χ²)
* Distribution behavior
* Discrete math and modular arithmetic

### Demonstrations

* Slow generation for step-by-step explanation
* Compare algorithms under identical conditions
* Show why **RANDU should never be used**
* Connect hexadecimal output to real computing systems

---

## How to use

1. Select a **number base** (2–16)
2. Choose a **random algorithm**
3. Set digit count, update frequency, and speed
4. Click **Calculate**
5. Watch the distribution evolve in real time

Optional tools include pause/resume, step mode, guessing game, and digit export.

---

## Technical notes

* **Frontend**: HTML5, CSS3, JavaScript (ES6+)
* **Visualization**: Chart.js
* **Uniformity**: Rejection sampling for non-power-of-two bases
* **Performance**: Tuned for up to 10,000 digits
* **Connectivity**: Quantum RNG requires internet access

---

## Known limitations

* Quantum RNG availability depends on external API
* Very fast speeds may lag on mobile devices
* Perlin and Gaussian outputs are *not* uniform by design

---

## For educators

This tool is designed to provoke discussion:

* *Which algorithm converges fastest?*
* *Why does RANDU fail so badly?*
* *Does base choice matter?*
* *Is chaos the same as randomness?*

Students quickly learn that **randomness is a design decision, not a checkbox**.

---

## Contributing

Suggestions, issues, and additional algorithms are welcome. This project is intended for educational exploration and discussion.

---

## License

Free for educational and academic use.

---

## Author

Created by **Kappter**

Questions or feedback? Open an issue on GitHub.

---

🎲 *Random is easy. Good randomness takes thought.*
