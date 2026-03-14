/*
==================================================
  WORKSHEET QUESTION BANK
  Live Random Calculator — Educational Worksheets
  6 Focus Areas × 3 Grade Levels = 18 question sets
==================================================
*/

const QUESTION_BANK = {

  /* ============================================================
     FOCUS 1: PI DAY EXPLORER
  ============================================================ */
  "pi-day": {
    "middle-school": [
      {
        type: "mcq",
        question: "What is the definition of Pi (π)?",
        options: [
          "The area of a circle",
          "The ratio of a circle's circumference to its radius",
          "The ratio of a circle's circumference to its diameter",
          "A type of dessert"
        ],
        answer: 2
      },
      {
        type: "fill-in",
        question: "To two decimal places, the value of Pi is ____.",
        answer: "3.14"
      },
      {
        type: "mcq",
        question: "Which ancient Greek mathematician was the first to rigorously calculate an approximation of Pi?",
        options: ["Pythagoras", "Euclid", "Plato", "Archimedes"],
        answer: 3
      },
      {
        type: "hands-on",
        question: "Using the app, generate 100 digits of Pi. Which digit (0–9) appears the most frequently in your result?",
        answer: "(Varies) Student must run the app and record their observation."
      },
      {
        type: "short-answer",
        question: "The app's timeline shows that ancient civilizations knew about Pi. Name one of them and their approximate estimate.",
        answer: "Ancient Egyptians (~2000 BC) used 3.1605; Babylonians used 3.125."
      },
      {
        type: "mcq",
        question: "Pi Day is celebrated on which date?",
        options: ["January 4", "March 14", "July 22", "December 3"],
        answer: 1
      },
      {
        type: "fill-in",
        question: "Pi is an ____ number, meaning its decimal expansion never ends and never repeats.",
        answer: "irrational"
      },
      {
        type: "short-answer",
        question: "What is the formula for the circumference of a circle using Pi?",
        answer: "C = 2πr (or C = πd), where r is the radius and d is the diameter."
      }
    ],
    "high-school": [
      {
        type: "mcq",
        question: "A number that cannot be expressed as a simple fraction (a/b) is called...",
        options: ["An integer", "A rational number", "An irrational number", "A transcendental number"],
        answer: 2
      },
      {
        type: "short-answer",
        question: "Is Pi a rational or irrational number? Explain what that means for its decimal expansion.",
        answer: "Pi is an irrational number, meaning its decimal representation goes on forever without repeating or terminating."
      },
      {
        type: "mcq",
        question: "Who is credited with first using the Greek letter 'π' to represent the constant in 1706?",
        options: ["Isaac Newton", "Leonhard Euler", "William Jones", "Gottfried Leibniz"],
        answer: 2
      },
      {
        type: "hands-on",
        question: "Using the app, generate 200 digits of Pi in Base 2 (Binary). Do the digits 0 and 1 appear roughly the same number of times? Record the counts.",
        answer: "(Varies) The counts should be close to equal, demonstrating the expected normality of Pi."
      },
      {
        type: "short-answer",
        question: "The app mentions that Pi is 'expected to be uniformly distributed'. What does this concept, also known as 'normality', mean?",
        answer: "It means every digit and every sequence of digits appears with equal frequency. It has been conjectured but not yet proven for Pi."
      },
      {
        type: "mcq",
        question: "Zu Chongzhi (480 AD) computed Pi to 7 decimal places using the fraction 355/113. How long did this record stand?",
        options: ["About 10 years", "About 100 years", "About 900 years", "About 50 years"],
        answer: 2
      },
      {
        type: "fill-in",
        question: "The first electronic computer to calculate Pi was the ____.",
        answer: "ENIAC"
      },
      {
        type: "short-answer",
        question: "Explain why computing more digits of Pi is scientifically useful today.",
        answer: "It tests the limits of computing hardware and algorithms, verifies the correctness of new supercomputers, and advances research in number theory."
      }
    ],
    "college": [
      {
        type: "mcq",
        question: "Pi is not just irrational, it is also a...",
        options: ["Transcendental number", "Algebraic number", "Complex number", "Imaginary number"],
        answer: 0
      },
      {
        type: "short-answer",
        question: "Explain the significance of Machin-like formulas in the history of calculating Pi.",
        answer: "They are rapidly converging series based on the arctangent function that were used to break Pi calculation records for centuries before the computer age."
      },
      {
        type: "mcq",
        question: "The Chudnovsky algorithm, used for modern record-breaking calculations of Pi, is an example of what type of algorithm?",
        options: ["A spigot algorithm", "A Monte Carlo method", "A rapidly converging series based on elliptic integrals", "A Fourier analysis method"],
        answer: 2
      },
      {
        type: "hands-on",
        question: "Using the app, run the Benford's Law analysis on a text file of Pi digits. Does it conform to Benford's Law? Explain why or why not.",
        answer: "(Varies) It should show non-conformance. Pi's digits are uniform, but Benford's Law applies to leading digits of naturally occurring numbers, not uniform sequences."
      },
      {
        type: "short-answer",
        question: "What is the 'spigot algorithm' for computing Pi, and how does it differ from methods that compute all digits up to a point?",
        answer: "A spigot algorithm can produce single digits of Pi without calculating all preceding ones. It's like turning a tap to get one drop at a time."
      },
      {
        type: "mcq",
        question: "The BBP (Bailey–Borwein–Plouffe) formula is significant because it allows computation of...",
        options: [
          "Pi to any number of digits in O(n) time",
          "Any individual hexadecimal digit of Pi without computing preceding digits",
          "Pi using only integer arithmetic",
          "Pi in any base using a single formula"
        ],
        answer: 1
      },
      {
        type: "short-answer",
        question: "What does it mean for Pi to be a 'normal' number, and has this been proven?",
        answer: "A normal number has every digit and sequence of digits appearing with equal frequency in every base. This has NOT been proven for Pi; it remains an open conjecture."
      },
      {
        type: "fill-in",
        question: "The current world record for digits of Pi (as of 2025) stands at approximately ____ trillion digits.",
        answer: "314"
      }
    ]
  },

  /* ============================================================
     FOCUS 2: NUMBER BASES
  ============================================================ */
  "number-bases": {
    "middle-school": [
      {
        type: "mcq",
        question: "Our everyday number system is Base-10, also called...",
        options: ["Binary", "Decimal", "Hexadecimal", "Octal"],
        answer: 1
      },
      {
        type: "fill-in",
        question: "The number 101 in Base-2 (Binary) is equal to the number ____ in Base-10.",
        answer: "5"
      },
      {
        type: "mcq",
        question: "Which base system uses only the digits 0 and 1?",
        options: ["Base-10", "Base-16", "Base-2", "Base-8"],
        answer: 2
      },
      {
        type: "hands-on",
        question: "Using the app, set the base to 16 (Hexadecimal). What letters are used for the digits after 9?",
        answer: "A, B, C, D, E, F"
      },
      {
        type: "short-answer",
        question: "Why do computers often use Base-2 (Binary)?",
        answer: "Because computer circuits have two states: on or off, which can be represented by 1 and 0."
      },
      {
        type: "mcq",
        question: "What is the value of the binary number 1111 in Base-10?",
        options: ["8", "14", "15", "16"],
        answer: 2
      },
      {
        type: "fill-in",
        question: "In Base-8 (Octal), the digits used are 0 through ____.",
        answer: "7"
      },
      {
        type: "short-answer",
        question: "Convert the Base-10 number 8 to Base-2 (Binary). Show your work.",
        answer: "8 = 1×8 + 0×4 + 0×2 + 0×1 = 1000 in binary."
      }
    ],
    "high-school": [
      {
        type: "mcq",
        question: "What is the value of the number 2B in Base-16 (Hexadecimal) when converted to Base-10?",
        options: ["33", "43", "211", "42"],
        answer: 3
      },
      {
        type: "fill-in",
        question: "The Base-10 number 20 is written as ____ in Base-8 (Octal).",
        answer: "24"
      },
      {
        type: "mcq",
        question: "In the number 123 (Base-10), the '1' represents...",
        options: ["1 × 10⁰", "1 × 10¹", "1 × 10²", "1 × 10³"],
        answer: 2
      },
      {
        type: "hands-on",
        question: "Using the app, generate 100 digits using the LCG algorithm in Base-4. Look at the Ulam Spiral. Do you see any obvious patterns? Describe them.",
        answer: "(Varies) Student should observe and describe any visual patterns, which may indicate non-randomness in the LCG algorithm."
      },
      {
        type: "short-answer",
        question: "Explain the concept of 'place value' and how it applies to a number system other than Base-10.",
        answer: "Place value means a digit's value depends on its position. In Base-8, the rightmost digit is 8⁰ (1s), the next is 8¹ (8s), then 8² (64s), etc."
      },
      {
        type: "mcq",
        question: "How many unique symbols are needed to represent numbers in Base-12?",
        options: ["10", "11", "12", "16"],
        answer: 2
      },
      {
        type: "fill-in",
        question: "The hexadecimal number FF in Base-10 is ____.",
        answer: "255"
      },
      {
        type: "short-answer",
        question: "Why is Base-16 (Hexadecimal) often used by programmers when working with binary data?",
        answer: "Each hex digit represents exactly 4 binary bits (a nibble), making it a compact, human-readable shorthand for binary values."
      }
    ],
    "college": [
      {
        type: "mcq",
        question: "To convert a number from Base-10 to another base 'b', you can use the method of...",
        options: ["Repeated multiplication by b", "Repeated division by b and recording the remainders", "Taking the logarithm base b", "Finding the Fourier transform"],
        answer: 1
      },
      {
        type: "fill-in",
        question: "The fractional number 0.5 in Base-10 is written as ____ in Base-2.",
        answer: "0.1"
      },
      {
        type: "mcq",
        question: "Why is Base-16 (Hexadecimal) commonly used in computer science as a more human-readable representation of binary data?",
        options: [
          "It uses fewer digits than binary",
          "Each hexadecimal digit corresponds to exactly four binary digits (a nibble)",
          "It is easier for computers to process",
          "It was invented by IBM"
        ],
        answer: 1
      },
      {
        type: "hands-on",
        question: "Using the app, generate 500 digits of the RANDU algorithm in Base-10. Switch to the 'Pairs Heatmap' view. Describe the pattern and explain what it implies about RANDU's quality.",
        answer: "(Varies) Student should see diagonal bands or clusters, indicating strong serial correlation between consecutive numbers — a major flaw in RANDU."
      },
      {
        type: "short-answer",
        question: "Discuss the trade-offs between using a small base (like 2) versus a large base (like 16) for representing numerical data in a computer system.",
        answer: "Small bases are simple for hardware but require long digit strings. Large bases are compact and human-readable but require more complex hardware/software to handle the larger symbol set."
      },
      {
        type: "mcq",
        question: "A floating-point number in IEEE 754 single precision uses 32 bits. In hexadecimal, this requires how many digits?",
        options: ["4", "6", "8", "16"],
        answer: 2
      },
      {
        type: "short-answer",
        question: "Explain why some fractions that terminate in Base-10 (like 0.1) are infinitely repeating in Base-2.",
        answer: "A fraction terminates in base b only if its denominator has no prime factors other than those of b. Since 10 = 2×5 but 2 = 2, fractions with a factor of 5 in the denominator (like 1/10) cannot terminate in binary."
      },
      {
        type: "fill-in",
        question: "The number of digits required to represent a Base-10 number N in Base-b is approximately ____.",
        answer: "⌈log_b(N+1)⌉ or log_b(N) + 1"
      }
    ]
  },

  /* ============================================================
     FOCUS 3: RANDOMNESS & PRNGs
  ============================================================ */
  "randomness-prngs": {
    "middle-school": [
      {
        type: "mcq",
        question: "What does PRNG stand for?",
        options: ["Pretty Random Number Generator", "Pseudo-Random Number Generator", "Perfectly Random Number Generator", "Programmable Random Number Generator"],
        answer: 1
      },
      {
        type: "short-answer",
        question: "What is the difference between a truly random number (like from a coin flip) and a pseudo-random number from a computer?",
        answer: "A truly random number is unpredictable. A pseudo-random number is generated by a formula and will eventually repeat, but it looks random."
      },
      {
        type: "mcq",
        question: "In a PRNG, what is a 'seed'?",
        options: ["The final number generated", "The formula used", "The starting value for the sequence", "The length of the sequence"],
        answer: 2
      },
      {
        type: "hands-on",
        question: "Using the app, run the Middle-Square algorithm for 100 digits. Does it ever get stuck in a short loop? Describe what happens.",
        answer: "(Varies) Yes, the Middle-Square method often degenerates into a short repeating cycle, like getting stuck on 0000."
      },
      {
        type: "fill-in",
        question: "A good random number generator should produce numbers that are ____ distributed.",
        answer: "uniformly"
      },
      {
        type: "mcq",
        question: "If you use the same seed in a PRNG, what will happen?",
        options: [
          "You get completely different numbers each time",
          "You get the exact same sequence of numbers each time",
          "The program crashes",
          "The numbers get bigger each time"
        ],
        answer: 1
      },
      {
        type: "short-answer",
        question: "Name one real-world application where a computer needs to generate random numbers.",
        answer: "Examples: Video games (enemy AI, loot drops), shuffling music playlists, online security (passwords), lottery simulations."
      },
      {
        type: "fill-in",
        question: "The app shows the Chi-Square statistic. A value close to ____ means the digits are evenly distributed.",
        answer: "0 (or the expected value for the degrees of freedom)"
      }
    ],
    "high-school": [
      {
        type: "mcq",
        question: "What is the 'period' of a PRNG?",
        options: ["The time it takes to generate one number", "The number of digits it can produce", "The length of the sequence before it starts repeating", "The initial seed value"],
        answer: 2
      },
      {
        type: "short-answer",
        question: "The app includes the RANDU algorithm and marks it with a warning. Why was RANDU considered a bad PRNG?",
        answer: "Its numbers were not truly independent. When plotted in 3D, they fall on a small number of planes, a major flaw for scientific simulations."
      },
      {
        type: "mcq",
        question: "Which of these is a common statistical test for randomness mentioned in the app?",
        options: ["The Turing Test", "The Chi-Square Test", "The Litmus Test", "The Stress Test"],
        answer: 1
      },
      {
        type: "hands-on",
        question: "Using the app, compare the 'Pairs Heatmap' for 1000 digits of LCG vs. PCG. Which looks more uniform? What does this tell you?",
        answer: "(Varies) The PCG heatmap should look more uniform (lower CV score), indicating better statistical properties and less serial correlation than a simple LCG."
      },
      {
        type: "short-answer",
        question: "Why is cryptographic security an important consideration for PRNGs used in applications like online banking?",
        answer: "If a PRNG is predictable, an attacker could guess the 'random' numbers used to create encryption keys, passwords, or session tokens, compromising security."
      },
      {
        type: "mcq",
        question: "The Mersenne Twister PRNG has a period of 2^19937 − 1. What does this mean?",
        options: [
          "It can only generate 19,937 numbers",
          "It takes 19,937 seconds to run",
          "It generates the same sequence after 2^19937 − 1 numbers",
          "It uses 19,937 bits of memory"
        ],
        answer: 2
      },
      {
        type: "fill-in",
        question: "A PRNG that is safe for cryptographic use is called a ____ PRNG (abbreviated CSPRNG).",
        answer: "Cryptographically Secure"
      },
      {
        type: "short-answer",
        question: "Explain what the 'Lead Time' chart in the app shows and what it tells you about a PRNG's quality.",
        answer: "It shows how long each digit held the lead in the running count. For a good PRNG, all digits should lead for roughly equal amounts of time, indicating no bias."
      }
    ],
    "college": [
      {
        type: "mcq",
        question: "The Linear Congruential Generator (LCG) is defined by X_{n+1} = (a × X_n + c) mod m. What is 'm' called?",
        options: ["The multiplier", "The increment", "The modulus", "The seed"],
        answer: 2
      },
      {
        type: "short-answer",
        question: "Explain the concept of 'spectral tests' for evaluating the quality of a PRNG.",
        answer: "Spectral tests measure uniformity by checking how PRNG outputs fall on k-dimensional hyperplanes. A bad generator like RANDU fails badly, showing points clustered on a few planes."
      },
      {
        type: "mcq",
        question: "The PCG (Permuted Congruential Generator) family improves upon LCGs by adding what main feature?",
        options: [
          "A larger modulus",
          "A non-linear output transformation (permutation function)",
          "A floating-point calculation",
          "A connection to the internet for true randomness"
        ],
        answer: 1
      },
      {
        type: "hands-on",
        question: "Using the app, find the Chi-Square value for 1000 digits of Pi (Base 10) and 1000 digits of RANDU (Base 10). Which is lower, and what does a lower Chi-Square value signify?",
        answer: "(Varies) The value for Pi should be lower. A lower Chi-Square value means the observed distribution is closer to the expected uniform distribution."
      },
      {
        type: "short-answer",
        question: "What are the Hull-Dobell conditions for a Linear Congruential Generator to achieve its maximum possible period length of 'm'?",
        answer: "1. 'c' and 'm' are coprime. 2. 'a−1' is divisible by every prime factor of 'm'. 3. 'a−1' is a multiple of 4 if 'm' is a multiple of 4."
      },
      {
        type: "mcq",
        question: "The Xoshiro256** PRNG is designed for which primary use case?",
        options: [
          "Cryptographic key generation",
          "General-purpose simulation and gaming with high speed",
          "Generating digits of Pi",
          "Compressing data"
        ],
        answer: 1
      },
      {
        type: "short-answer",
        question: "Describe the difference between a PRNG and a TRNG (True Random Number Generator). Give an example of each.",
        answer: "A PRNG uses a deterministic algorithm (e.g., Mersenne Twister). A TRNG uses physical entropy sources like thermal noise, radioactive decay, or mouse movements (e.g., /dev/random on Linux)."
      },
      {
        type: "fill-in",
        question: "The NIST Statistical Test Suite contains ____ distinct tests for evaluating the randomness of binary sequences.",
        answer: "15"
      }
    ]
  },

  /* ============================================================
     FOCUS 4: BENFORD'S LAW
  ============================================================ */
  "benford": {
    "middle-school": [
      {
        type: "mcq",
        question: "Benford's Law is a prediction about which part of a number in a list of data?",
        options: [
          "The last digit",
          "The first (leading) digit",
          "The number of digits",
          "The average of the digits"
        ],
        answer: 1
      },
      {
        type: "fill-in",
        question: "According to Benford's Law, the number ____ is the most common leading digit in many real-life sets of numerical data.",
        answer: "1"
      },
      {
        type: "mcq",
        question: "Because it can spot unusual patterns, Benford's Law is often used by accountants to help find what?",
        options: [
          "The most popular product",
          "Calculation errors",
          "Financial fraud",
          "The average sale price"
        ],
        answer: 2
      },
      {
        type: "hands-on",
        question: "Using the app, upload a large text file (like a book from Project Gutenberg). Does the app say it conforms to Benford's Law?",
        answer: "(Varies) It should show 'Close Conformance' or 'Acceptable Conformance', as the leading bytes in natural text often follow the law."
      },
      {
        type: "short-answer",
        question: "Name one example of a real-world dataset that is likely to follow Benford's Law.",
        answer: "Examples: Stock prices, city populations, electricity bills, street addresses, death rates."
      },
      {
        type: "mcq",
        question: "If you made up a list of fake financial numbers, Benford's Law analysis would likely show...",
        options: [
          "Perfect conformance",
          "Non-conformance, because people tend to use digits too evenly",
          "The number 7 as the most common leading digit",
          "No result, because it only works on real data"
        ],
        answer: 1
      },
      {
        type: "fill-in",
        question: "Benford's Law is named after physicist Frank Benford, who published his findings in ____.",
        answer: "1938"
      },
      {
        type: "short-answer",
        question: "According to Benford's Law, which leading digit is the LEAST common?",
        answer: "9 — it appears as a leading digit only about 4.6% of the time."
      }
    ],
    "high-school": [
      {
        type: "mcq",
        question: "Benford's Law is a statement about the frequency distribution of what?",
        options: [
          "The digits in Pi",
          "The numbers in a lottery drawing",
          "Leading digits in many real-world numerical datasets",
          "The final scores of sports games"
        ],
        answer: 2
      },
      {
        type: "short-answer",
        question: "Explain why a list of numbers from a fair lottery drawing would NOT be expected to follow Benford's Law.",
        answer: "Lottery numbers are chosen from a uniform distribution (e.g., 1–50), where each number has an equal chance. Benford's Law applies to data spanning several orders of magnitude."
      },
      {
        type: "mcq",
        question: "The formula for Benford's Law is P(d) = log₁₀(1 + 1/d). According to this, what is the approximate probability of the leading digit being '1'?",
        options: ["11.1%", "30.1%", "17.6%", "9.7%"],
        answer: 1
      },
      {
        type: "hands-on",
        question: "Using the app, run the Benford's Law analysis on a Pi digits file. What does the MAD (Mean Absolute Deviation) score tell you about its conformance?",
        answer: "(Varies) The MAD score should be high, indicating non-conformance. Pi's digits are uniform, which violates Benford's expected leading-digit distribution."
      },
      {
        type: "fill-in",
        question: "A high ____ score in the app's Benford panel suggests the data may have been manipulated or is not naturally occurring.",
        answer: "MAD (Mean Absolute Deviation)"
      },
      {
        type: "mcq",
        question: "Benford's Law was first noted by astronomer Simon Newcomb in 1881. What observation led to his discovery?",
        options: [
          "He noticed that stars with lower numbers were more common",
          "He noticed the first pages of logarithm tables were more worn than later pages",
          "He found that Pi's digits were not uniform",
          "He observed that financial data was always fraudulent"
        ],
        answer: 1
      },
      {
        type: "short-answer",
        question: "The app shows a Chi-Square statistic for Benford's Law analysis. What does a Chi-Square value above the critical value (15.5) indicate?",
        answer: "It indicates that the deviation from Benford's expected distribution is statistically significant — the data is unlikely to be naturally occurring or may have been manipulated."
      },
      {
        type: "fill-in",
        question: "According to Benford's Law, the leading digit '2' appears approximately ____% of the time.",
        answer: "17.6"
      }
    ],
    "college": [
      {
        type: "mcq",
        question: "Benford's Law is observed in datasets that are...",
        options: [
          "Scale-invariant",
          "Normally distributed",
          "Linearly increasing",
          "Bound to a narrow range"
        ],
        answer: 0
      },
      {
        type: "short-answer",
        question: "Explain the concept of 'scale invariance' and how it relates to Benford's Law.",
        answer: "Scale invariance means the law holds regardless of units of measurement. Multiplying the entire dataset by a constant leaves the leading-digit distribution unchanged."
      },
      {
        type: "mcq",
        question: "Which of these datasets is LEAST likely to conform to Benford's Law?",
        options: [
          "The populations of all cities in the world",
          "The opening prices of all stocks on the NYSE for a year",
          "The heights of all adult humans in a country",
          "The number of Twitter followers for all verified accounts"
        ],
        answer: 2
      },
      {
        type: "hands-on",
        question: "The app's Benford panel shows a Chi-Square statistic. What is the null hypothesis that the Chi-Square test is evaluating?",
        answer: "The null hypothesis is that the observed distribution of leading digits is statistically indistinguishable from the distribution predicted by Benford's Law."
      },
      {
        type: "short-answer",
        question: "Beyond fraud detection, name another practical application of Benford's Law.",
        answer: "Examples: Designing efficient data compression algorithms, analyzing round-off errors in computer calculations, or as a quality check for scientific data."
      },
      {
        type: "mcq",
        question: "The mathematical basis for Benford's Law is rooted in which of the following?",
        options: [
          "The Central Limit Theorem",
          "The logarithmic distribution of numbers on a number line",
          "Fourier analysis of digit sequences",
          "The law of large numbers"
        ],
        answer: 1
      },
      {
        type: "short-answer",
        question: "Benford's Law has been used as evidence in court cases involving financial fraud. What are the limitations of using it as sole evidence?",
        answer: "It is a probabilistic tool, not definitive proof. Some legitimate datasets naturally deviate from Benford's Law. It should be used as a screening tool to guide further investigation, not as conclusive evidence."
      },
      {
        type: "fill-in",
        question: "Benford's Law applies most strongly to datasets that span at least ____ orders of magnitude.",
        answer: "2–3 (or several)"
      }
    ]
  },

  /* ============================================================
     FOCUS 5: ULAM SPIRAL
  ============================================================ */
  "ulam-spiral": {
    "middle-school": [
      {
        type: "mcq",
        question: "What is the Ulam Spiral?",
        options: [
          "A type of galaxy",
          "A way to cook pasta",
          "A visual way to see patterns in numbers, especially prime numbers",
          "A dance move"
        ],
        answer: 2
      },
      {
        type: "fill-in",
        question: "The Ulam Spiral starts with the number 1 in the center and spirals ____.",
        answer: "outward"
      },
      {
        type: "mcq",
        question: "In the original Ulam Spiral, what special type of numbers tended to line up on diagonals?",
        options: ["Even numbers", "Odd numbers", "Prime numbers", "Square numbers"],
        answer: 2
      },
      {
        type: "hands-on",
        question: "Using the app, generate 200 digits of Pi and look at the Ulam Spiral. Is there an obvious pattern, or does it look mostly random?",
        answer: "(Varies) It should look mostly random, as Pi's digits are expected to be uniformly distributed."
      },
      {
        type: "short-answer",
        question: "In the app's Ulam Spiral, what do the different colors of the cells represent?",
        answer: "Each color represents a different digit value (e.g., 0, 1, 2, 3...)."
      },
      {
        type: "mcq",
        question: "The Ulam Spiral was invented by Stanisław Ulam in what year?",
        options: ["1905", "1963", "1984", "2001"],
        answer: 1
      },
      {
        type: "fill-in",
        question: "In the app, the very first digit placed in the center of the Ulam Spiral is marked with a special ____.",
        answer: "border (or outline)"
      },
      {
        type: "short-answer",
        question: "If you generated 400 digits of a perfectly random sequence, what would you expect the Ulam Spiral to look like?",
        answer: "It should look like a random mix of colors with no obvious stripes, blocks, or patterns."
      }
    ],
    "high-school": [
      {
        type: "mcq",
        question: "The Ulam Spiral was discovered by mathematician Stanisław Ulam while he was...",
        options: [
          "Solving a complex equation",
          "Programming a computer",
          "Doodling during a boring lecture",
          "Observing star patterns"
        ],
        answer: 2
      },
      {
        type: "short-answer",
        question: "In the app, the Ulam Spiral is used as a visual 'fingerprint' for a digit sequence. What might a clear pattern (like stripes or blocks) indicate?",
        answer: "A clear pattern indicates the sequence is not random and has some underlying structure or bias."
      },
      {
        type: "mcq",
        question: "The path of the Ulam spiral covers all positive integers in a rectangular grid. The direction of travel changes at each corner. This type of path is sometimes called a...",
        options: ["Hilbert curve", "Sierpinski gasket", "Boustrophedon path", "Mandelbrot set"],
        answer: 2
      },
      {
        type: "hands-on",
        question: "Using the app, generate 300 digits using LCG in Base-10, then view the Ulam Spiral. Now do the same for PCG. Which spiral looks more 'random' or 'snowy'?",
        answer: "(Varies) The PCG spiral should look more random, while LCG might show subtle patterns, reflecting PCG's superior statistical quality."
      },
      {
        type: "short-answer",
        question: "Why is visualizing data, such as with the Ulam Spiral, a useful tool in mathematics and computer science?",
        answer: "Visualization can reveal patterns, structures, or anomalies not obvious from raw numbers, leading to new insights and conjectures."
      },
      {
        type: "mcq",
        question: "In the app's Ulam Spiral for Base-2, how many different colors would you expect to see?",
        options: ["1", "2", "10", "16"],
        answer: 1
      },
      {
        type: "fill-in",
        question: "The Ulam Spiral is an example of a ____ visualization, because it maps a 1D sequence onto a 2D grid.",
        answer: "spatial (or 2D)"
      },
      {
        type: "short-answer",
        question: "How does the Ulam Spiral complement the Pairs Heatmap as a visualization tool? What does each one show that the other doesn't?",
        answer: "The Ulam Spiral shows the spatial distribution of individual digit values. The Pairs Heatmap shows the frequency of consecutive digit pairs. Together they reveal both individual and sequential patterns."
      }
    ],
    "college": [
      {
        type: "mcq",
        question: "The tendency for prime numbers to appear on certain diagonals in the Ulam Spiral is related to what property of quadratic polynomials?",
        options: [
          "Their roots are always integers",
          "Certain quadratic polynomials, like Euler's f(n) = n² + n + 41, produce a high density of prime numbers",
          "They can be factored easily",
          "Their graphs are always parabolas"
        ],
        answer: 1
      },
      {
        type: "short-answer",
        question: "While visually compelling, the patterns in the Ulam Spiral are not fully understood. What does this say about the distribution of prime numbers?",
        answer: "It suggests that while the global distribution of primes follows the Prime Number Theorem, there may be local structures or biases not yet explained by current theories."
      },
      {
        type: "mcq",
        question: "A variation of the Ulam Spiral that shows even more striking patterns by centering the spiral on a different number is called the...",
        options: ["Sacks spiral", "The Prime Spiral Sieve", "The Fibonacci spiral", "A logarithmic spiral"],
        answer: 0
      },
      {
        type: "hands-on",
        question: "Using the app, generate 500 digits of RANDU and view the Ulam Spiral, then the Pairs Heatmap. How do the two visualizations combine to show RANDU's flaws?",
        answer: "(Varies) The Ulam spiral may show subtle textural patterns, while the heatmap more clearly shows strong serial correlation (diagonal patterns) — a major flaw in RANDU."
      },
      {
        type: "short-answer",
        question: "The Ulam Spiral is a discrete spiral. How does it differ from a continuous mathematical spiral like the Archimedean or logarithmic spiral?",
        answer: "A discrete spiral moves along integer grid coordinates (up, down, left, right), while a continuous spiral is defined by a smooth function in polar coordinates (r, θ)."
      },
      {
        type: "mcq",
        question: "The Ulam Spiral was featured on the cover of Scientific American in 1964. Who wrote the article that brought it to widespread attention?",
        options: ["Martin Gardner", "Richard Feynman", "John Conway", "Douglas Hofstadter"],
        answer: 0
      },
      {
        type: "short-answer",
        question: "Describe a hypothesis about why prime numbers cluster along diagonals in the Ulam Spiral.",
        answer: "Diagonal lines in the spiral correspond to quadratic polynomials of the form an² + bn + c. Some of these polynomials are known to generate unusually high densities of primes, explaining the diagonal clustering."
      },
      {
        type: "fill-in",
        question: "In the Ulam Spiral, the number at position (0,0) — the center — is ____.",
        answer: "1"
      }
    ]
  },

  /* ============================================================
     FOCUS 6: MIXED SAMPLER
  ============================================================ */
  "mixed": {
    "middle-school": [
      {
        type: "mcq",
        question: "What is the definition of Pi (π)?",
        options: [
          "The area of a circle",
          "The ratio of a circle's circumference to its radius",
          "The ratio of a circle's circumference to its diameter",
          "A type of dessert"
        ],
        answer: 2
      },
      {
        type: "fill-in",
        question: "The number 101 in Base-2 (Binary) is equal to the number ____ in Base-10.",
        answer: "5"
      },
      {
        type: "mcq",
        question: "In a PRNG, what is a 'seed'?",
        options: ["The final number generated", "The formula used", "The starting value for the sequence", "The length of the sequence"],
        answer: 2
      },
      {
        type: "short-answer",
        question: "In the app's Ulam Spiral, what do the different colors of the cells represent?",
        answer: "Each color represents a different digit value (e.g., 0, 1, 2, 3...)."
      },
      {
        type: "fill-in",
        question: "According to Benford's Law, the number ____ is the most common leading digit in many real-life sets of numerical data.",
        answer: "1"
      },
      {
        type: "mcq",
        question: "Pi Day is celebrated on which date?",
        options: ["January 4", "March 14", "July 22", "December 3"],
        answer: 1
      },
      {
        type: "hands-on",
        question: "Using the app, generate 100 digits of Pi in Base-10. Look at the Lead Time chart. Which digit leads for the longest time?",
        answer: "(Varies) Student must run the app and record their observation."
      },
      {
        type: "short-answer",
        question: "Name one real-world application where a computer needs to generate random numbers.",
        answer: "Examples: Video games (enemy AI, loot drops), shuffling music playlists, online security (passwords), lottery simulations."
      }
    ],
    "high-school": [
      {
        type: "short-answer",
        question: "Is Pi a rational or irrational number? Explain what that means for its decimal expansion.",
        answer: "Pi is an irrational number, meaning its decimal representation goes on forever without repeating or terminating."
      },
      {
        type: "mcq",
        question: "What is the value of the number 2B in Base-16 (Hexadecimal) when converted to Base-10?",
        options: ["33", "43", "211", "42"],
        answer: 3
      },
      {
        type: "short-answer",
        question: "The app includes the RANDU algorithm and marks it with a warning. Why was RANDU considered a bad PRNG?",
        answer: "Its numbers were not truly independent. When plotted in 3D, they fall on a small number of planes, a major flaw for scientific simulations."
      },
      {
        type: "short-answer",
        question: "Why is visualizing data, such as with the Ulam Spiral, a useful tool in mathematics and computer science?",
        answer: "Visualization can reveal patterns, structures, or anomalies not obvious from raw numbers, leading to new insights and conjectures."
      },
      {
        type: "mcq",
        question: "The formula for Benford's Law is P(d) = log₁₀(1 + 1/d). According to this, what is the approximate probability of the leading digit being '1'?",
        options: ["11.1%", "30.1%", "17.6%", "9.7%"],
        answer: 1
      },
      {
        type: "hands-on",
        question: "Using the app, compare the Pairs Heatmap for 500 digits of LCG vs. Xoshiro256**. Which algorithm produces a more uniform heatmap? What does this tell you?",
        answer: "(Varies) Xoshiro should produce a more uniform heatmap, indicating better statistical quality and less serial correlation between consecutive digits."
      },
      {
        type: "fill-in",
        question: "Pi is not just irrational — it is also a ____ number, meaning it is not the root of any polynomial equation with integer coefficients.",
        answer: "transcendental"
      },
      {
        type: "short-answer",
        question: "Explain the concept of 'place value' and how it applies to Base-8 (Octal).",
        answer: "In Base-8, the rightmost digit is 8⁰ (1s), the next is 8¹ (8s), then 8² (64s), etc. Each position is a power of 8."
      }
    ],
    "college": [
      {
        type: "short-answer",
        question: "Explain the significance of Machin-like formulas in the history of calculating Pi.",
        answer: "They are rapidly converging series based on the arctangent function that were used to break Pi calculation records for centuries before the computer age."
      },
      {
        type: "mcq",
        question: "Why is Base-16 (Hexadecimal) commonly used in computer science as a more human-readable representation of binary data?",
        options: [
          "It uses fewer digits than binary",
          "Each hexadecimal digit corresponds to exactly four binary digits (a nibble)",
          "It is easier for computers to process",
          "It was invented by IBM"
        ],
        answer: 1
      },
      {
        type: "short-answer",
        question: "Explain the concept of 'spectral tests' for evaluating the quality of a PRNG.",
        answer: "Spectral tests measure uniformity by checking how PRNG outputs fall on k-dimensional hyperplanes. A bad generator like RANDU fails badly, showing points clustered on a few planes."
      },
      {
        type: "short-answer",
        question: "The Ulam Spiral is a discrete spiral. How does it differ from a continuous mathematical spiral like the Archimedean or logarithmic spiral?",
        answer: "A discrete spiral moves along integer grid coordinates (up, down, left, right), while a continuous spiral is defined by a smooth function in polar coordinates (r, θ)."
      },
      {
        type: "mcq",
        question: "Which of these datasets is LEAST likely to conform to Benford's Law?",
        options: [
          "The populations of all cities in the world",
          "The opening prices of all stocks on the NYSE for a year",
          "The heights of all adult humans in a country",
          "The number of Twitter followers for all verified accounts"
        ],
        answer: 2
      },
      {
        type: "hands-on",
        question: "Using the app, generate 1000 digits of Pi in Base-10. Record the Chi-Square value. Now generate 1000 digits of Middle-Square. Which has a higher Chi-Square, and what does this mean?",
        answer: "(Varies) Middle-Square should have a higher Chi-Square, indicating its digit distribution deviates more from uniform — it is a poor quality PRNG."
      },
      {
        type: "short-answer",
        question: "What are the Hull-Dobell conditions for a Linear Congruential Generator to achieve its maximum possible period length of 'm'?",
        answer: "1. 'c' and 'm' are coprime. 2. 'a−1' is divisible by every prime factor of 'm'. 3. 'a−1' is a multiple of 4 if 'm' is a multiple of 4."
      },
      {
        type: "short-answer",
        question: "Explain the concept of 'scale invariance' in the context of Benford's Law.",
        answer: "Scale invariance means the law holds regardless of units of measurement. Multiplying the entire dataset by a constant leaves the leading-digit distribution unchanged."
      }
    ]
  }

};
