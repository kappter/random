/*
==================================================
  WORKSHEET QUESTION BANK
==================================================
*/

const QUESTION_BANK = {
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
        question: "Using the app, generate 100 digits of Pi. Which digit (0-9) appears the most frequently in your result?",
        answer: "(Varies) Student must run the app and record their observation."
      },
      {
        type: "short-answer",
        question: "The app's timeline shows that ancient civilizations knew about Pi. Name one of them.",
        answer: "Ancient Egyptians or Babylonians."
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
        question: "Is Pi a rational or irrational number? Explain what that means.",
        answer: "Pi is an irrational number, meaning its decimal representation goes on forever without repeating."
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
        answer: "(Varies) Student must run the app. The counts should be close to equal, demonstrating normality."
      },
      {
        type: "short-answer",
        question: "The app mentions that Pi is 'expected to be uniformly distributed'. What does this concept, also known as 'normality', mean?",
        answer: "It means that every digit and every sequence of digits is expected to appear with the same frequency. It has been conjectured but not yet proven for Pi."
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
        answer: "They are rapidly converging series (based on the arctangent function) that were used to break Pi calculation records for centuries before the computer age."
      },
      {
        type: "mcq",
        question: "The Chudnovsky algorithm, used for modern record-breaking calculations of Pi, is an example of what type of algorithm?",
        options: ["A spigot algorithm", "A Monte Carlo method", "A rapidly converging series based on elliptic integrals", "A Fourier analysis method"],
        answer: 2
      },
      {
        type: "hands-on",
        question: "Using the app, run the Benford's Law analysis on a text file of the first 10,000 digits of Pi. Does it conform to Benford's Law? Explain why or why not.",
        answer: "(Varies) It should show non-conformance. While Pi's digits are uniform, the *leading digits* of numbers in a random sequence do not follow Benford's law, which applies to naturally occurring datasets."
      },
      {
        type: "short-answer",
        question: "What is the 'spigot algorithm' for computing Pi, and how does it differ from methods that compute all digits up to a point?",
        answer: "A spigot algorithm can produce single digits of Pi without calculating all the preceding ones. It's like turning a tap (spigot) to get one drop (digit) at a time."
      }
    ]
  },
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
        options: ["1 x 10^0", "1 x 10^1", "1 x 10^2", "1 x 10^3"],
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
        answer: "Place value means a digit's value depends on its position. In Base-8, the rightmost digit is the 8^0 (1s) place, the next is 8^1 (8s), then 8^2 (64s), etc."
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
        options: ["It uses fewer digits than binary", "Each hexadecimal digit corresponds to exactly four binary digits (a nibble)", "It is easier for computers to process", "It was invented by IBM"],
        answer: 1
      },
      {
        type: "hands-on",
        question: "Using the app, generate 500 digits of the RANDU algorithm in Base-10. Now switch to the 'Pairs Heatmap' view. Describe the pattern you see and explain what it implies about the algorithm's quality.",
        answer: "(Varies) Student should see diagonal bands or clusters, indicating a strong serial correlation between consecutive numbers, a major flaw in RANDU."
      },
      {
        type: "short-answer",
        question: "Discuss the trade-offs between using a small base (like 2) versus a large base (like 16) for representing numerical data in a computer system.",
        answer: "Small bases are simple for hardware but require long strings of digits. Large bases are more compact and human-readable but require more complex hardware/software to handle the larger set of symbols."
      }
    ]
  },
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
            question: "Using the app, run the Middle-Square algorithm for 100 digits. Watch the sequence. Does it ever get stuck in a short loop? Describe what happens.",
            answer: "(Varies) Yes, the Middle-Square method often degenerates into a short repeating cycle, like getting stuck on 0000."
        },
        {
            type: "fill-in",
            question: "A good random number generator should produce numbers that are ____ distributed.",
            answer: "uniformly"
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
            question: "Which of these is a common statistical test for randomness, mentioned in the app?",
            options: ["The Turing Test", "The Chi-Square Test", "The Litmus Test", "The Stress Test"],
            answer: 1
        },
        {
            type: "hands-on",
            question: "Using the app, compare the 'Pairs Heatmap' for 1000 digits of LCG vs. PCG. Which one looks more uniform (less structured)? What does this tell you?",
            answer: "(Varies) The PCG heatmap should look more uniform (lower CV score), indicating it has better statistical properties and less correlation between consecutive numbers than a simple LCG."
        },
        {
            type: "short-answer",
            question: "Why is cryptographic security an important consideration for PRNGs used in applications like online banking?",
            answer: "If a PRNG is predictable, an attacker could guess the 'random' numbers used to create encryption keys, passwords, or session tokens, compromising security."
        }
    ],
    "college": [
        {
            type: "mcq",
            question: "The Linear Congruential Generator (LCG) is defined by the recurrence relation X_n+1 = (a * X_n + c) mod m. What is 'm' called?",
            options: ["The multiplier", "The increment", "The modulus", "The seed"],
            answer: 2
        },
        {
            type: "short-answer",
            question: "Explain the concept of 'spectral tests' for evaluating the quality of a PRNG.",
            answer: "Spectral tests measure the uniformity of PRNG outputs by checking how points fall on k-dimensional hyperplanes. A bad generator like RANDU fails this test badly, showing points clustered on a few planes."
        },
        {
            type: "mcq",
            question: "The PCG (Permuted Congruential Generator) family improves upon LCGs by adding what main feature?",
            options: ["A larger modulus", "A non-linear output transformation (permutation function)", "A floating-point calculation", "A connection to the internet for true randomness"],
            answer: 1
        },
        {
            type: "hands-on",
            question: "Using the app, find the Chi-Square value for 1000 digits of Pi (Base 10) and 1000 digits of RANDU (Base 10). Which is lower, and what does a lower Chi-Square value generally signify?",
            answer: "(Varies) The value for Pi should be lower. A lower Chi-Square value signifies that the observed distribution is closer to the expected uniform distribution, indicating better statistical randomness."
        },
        {
            type: "short-answer",
            question: "What are the Hull-Dobell conditions for a Linear Congruential Generator to achieve its maximum possible period length of 'm'?",
            answer: "1. 'c' and 'm' are relatively prime. 2. 'a-1' is divisible by every prime factor of 'm'. 3. 'a-1' is a multiple of 4 if 'm' is a multiple of 4."
        }
    ]
  }
  // ... other topics to be filled in
}
