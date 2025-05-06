let myChart;
let counts = new Array(10).fill(0);
let submittedGuess = null;

// Monochromatic color palette: brightest from digit 0 to deep dark blue (0, 0, 139) at digit 9
const baseBlue = [0, 0, 139]; // Deep dark blue
const digitColors = Array.from({ length: 10 }, (_, i) => {
  const lightness = (9 - i) * 20; // Decrease lightness from 180 (brightest) to 0 (base blue)
  return `rgb(${Math.min(baseBlue[0] + lightness, 255)}, ${Math.min(baseBlue[1] + lightness, 255)}, ${baseBlue[2] + lightness})`;
});
const digitBorderColors = digitColors.map(color => color.replace('rgb', 'rgba').replace(')', ', 0.8)'));

function initializeChart() {
  console.log('Initializing chart');
  const ctx = document.getElementById('digitChart').getContext('2d');
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      datasets: [{
        label: 'Digit Counts',
        data: new Array(10).fill(0),
        backgroundColor: digitColors,
        borderColor: digitBorderColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Count' },
          ticks: { stepSize: 100 },
          suggestedMax: 600
        },
        x: {
          title: { display: true, text: 'Digits' }
        }
      },
      plugins: {
        datalabels: {
          display: true, // Always show labels
          anchor: 'center',
          align: 'center',
          offset: 0,
          formatter: (value, context) => {
            const tally = Math.floor(value / 5) + (value % 5 > 0 ? 1 : 0);
            return `${tally}`; // Superimposed tally
          },
          color: '#fff',
          font: { weight: 'bold', size: 16 },
          textAlign: 'center'
        },
        annotation: {
          annotations: []
        }
      },
      animation: {
        duration: 200,
        easing: 'easeInOutQuad'
      }
    }
  });
  return myChart;
}

function updateChartData(chart, data, target) {
  console.log('Updating chart data with counts:', data);
  // Find all digits with the highest count for highlighting
  const maxCount = Math.max(...data);
  const winningDigits = data.reduce((winners, count, index) => {
    if (count === maxCount) winners.push(index);
    return winners;
  }, []);

  // Update colors: dark red for all winners, original colors for others
  chart.data.datasets[0].backgroundColor = data.map((_, i) => 
    winningDigits.includes(i) ? 'rgb(139, 0, 0)' : digitColors[i]
  );
  chart.data.datasets[0].borderColor = data.map((_, i) => 
    winningDigits.includes(i) ? 'rgba(139, 0, 0, 0.8)' : digitBorderColors[i]
  );
  chart.data.datasets[0].data = [...data];
  chart.options.scales.y.suggestedMax = Math.max(...data, 1) * 1.2;

  // Add count labels as a secondary annotation (superimposed above tally)
  chart.options.plugins.annotation.annotations = data.map((value, index) => ({
    type: 'label',
    xValue: index,
    yValue: value + 5, // Offset above the bar
    content: [`Count: ${value}`],
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 4,
    padding: 6,
    color: '#000',
    font: { weight: 'bold', size: 14 },
    textAlign: 'center'
  }));

  chart.update();
}

// Pi digit generator (precomputed array)
function* generatePiDigits(numDigits) {
  const piDigits = [
    3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4,
    6, 2, 6, 4, 3, 3, 8, 3, 2, 7, 9, 5, 0, 2, 8, 8, 4, 1, 9, 7,
    1, 6, 9, 3, 9, 9, 3, 7, 5, 1, 0, 5, 8, 2, 0, 9, 7, 4, 9, 4,
    4, 5, 9, 2, 3, 0, 7, 8, 1, 6, 4, 0, 6, 2, 8, 6, 2, 0, 8, 9,
    9, 8, 6, 2, 8, 0, 3, 4, 8, 2, 5, 3, 4, 2, 1, 1, 7, 0, 6, 7
  ];
  let index = 0;
  while (index < numDigits) {
    const digit = piDigits[index % piDigits.length];
    yield digit;
    index++;
  }
}

// Gaussian digit generator (Box-Muller transform)
function* generateGaussianDigits(numDigits) {
  let index = 0;
  while (index < numDigits) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const digit = Math.round(4.5 + 1.5 * z);
    const clampedDigit = Math.max(0, Math.min(9, digit));
    yield clampedDigit;
    index++;
  }
}

// Perlin noise implementation
function perlinNoise(x, seed = 0) {
  const perm = Array(256).fill(0).map((_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor((seed + i) % (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  const p = new Uint8Array(512);
  for (let i = 0; i < 512; i++) p[i] = perm[i % 256];

  const xi = Math.floor(x) & 255;
  const xf = x - Math.floor(x);
  const u = xf * xf * (3 - 2 * xf);
  const a = p[xi];
  const b = p[xi + 1];
  const g1 = (p[a] % 2 ? -1 : 1) * (p[a] % 100) / 100;
  const g2 = (p[b] % 2 ? -1 : 1) * (p[b] % 100) / 100;
  return g1 + u * (g2 - g1);
}

// Perlin digit generator
function* generatePerlinDigits(numDigits) {
  let index = 0;
  const seed = Math.random() * 1000;
  while (index < numDigits) {
    const noise = perlinNoise(index * 0.1, seed);
    const digit = Math.floor(((noise + 1) / 2) * 10);
    const clampedDigit = Math.max(0, Math.min(9, digit));
    yield clampedDigit;
    index++;
  }
}

// Linear Congruential Generator (LCG) digit generator
function* generateLCGDigits(numDigits) {
  let index = 0;
  let seed = Date.now() % 4294967296; // Use current timestamp as seed
  const a = 1664525;
  const c = 1013904223;
  const m = 2**32; // Modulus
  while (index < numDigits) {
    seed = (a * seed + c) % m;
    const value = seed / m; // Normalize to [0, 1)
    const digit = Math.floor(value * 10); // Map to 0-9
    yield digit;
    index++;
  }
}

// Mersenne Twister implementation (simplified)
function* generateMersenneDigits(numDigits) {
  let index = 0;
  const seed = Date.now();
  let mt = new Array(624);
  let mtIndex = 0;

  // Initialize the MT array
  mt[0] = seed;
  for (let i = 1; i < 624; i++) {
    mt[i] = (1812433253 * (mt[i - 1] ^ (mt[i - 1] >> 30)) + i) & 0xffffffff;
  }

  function twist() {
    for (let i = 0; i < 624; i++) {
      const y = (mt[i] & 0x80000000) + (mt[(i + 1) % 624] & 0x7fffffff);
      mt[i] = mt[(i + 397) % 624] ^ (y >> 1);
      if (y % 2 !== 0) mt[i] ^= 0x9908b0df;
    }
  }

  function extractNumber() {
    if (mtIndex === 0) twist();
    let y = mt[mtIndex];
    y ^= (y >> 11);
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= (y >> 18);
    mtIndex = (mtIndex + 1) % 624;
    return y & 0xffffffff;
  }

  while (index < numDigits) {
    const value = extractNumber() / 0xffffffff; // Normalize to [0, 1)
    const digit = Math.floor(value * 10);
    yield digit;
    index++;
  }
}

// Logistic Map digit generator
function* generateLogisticDigits(numDigits) {
  let index = 0;
  let x = 0.1; // Initial value
  const r = 3.9; // Chaos parameter
  while (index < numDigits) {
    x = r * x * (1 - x);
    const digit = Math.floor(x * 10); // Map [0, 1) to 0-9
    yield digit;
    index++;
  }
}

// Middle-Square Method digit generator (with cycle detection)
function* generateMiddleSquareDigits(numDigits) {
  let index = 0;
  let seed = (Date.now() % 9000) + 1000; // 4-digit seed
  const seen = new Set();
  while (index < numDigits) {
    const squared = seed * seed;
    const squaredStr = squared.toString().padStart(8, '0');
    seed = parseInt(squaredStr.slice(2, 6)); // Take middle 4 digits
    if (seed === 0 || seen.has(seed)) {
      seed = (Date.now() % 9000) + 1000; // Reseed if cycle detected
      seen.clear();
    }
    seen.add(seed);
    const digit = Math.floor((seed / 10000) * 10); // Map to 0-9
    yield digit;
    index++;
  }
}

// Xorshift digit generator
function* generateXorshiftDigits(numDigits) {
  let index = 0;
  let x = Date.now() % 4294967296;
  while (index < numDigits) {
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    const value = (x & 0xffffffff) / 0xffffffff; // Normalize to [0, 1)
    const digit = Math.floor(value * 10);
    yield digit;
    index++;
  }
}

// Quantum Random digit generator (with LCG fallback)
async function* generateQuantumDigits(numDigits) {
  let index = 0;
  try {
    const response = await fetch('https://qrng.anu.edu.au/API/jsonI.php?length=' + Math.ceil(numDigits / 2) + '&type=uint8');
    const data = await response.json();
    if (data.success) {
      const numbers = data.data;
      for (let num of numbers) {
        // Each uint8 gives two digits
        const digit1 = Math.floor(num / 25.6); // First digit (0-9)
        const digit2 = Math.floor((num % 25.6) / 2.56); // Second digit (0-9)
        if (index < numDigits) {
          yield digit1;
          index++;
        }
        if (index < numDigits) {
          yield digit2;
          index++;
        }
      }
    }
  } catch (err) {
    console.error('Quantum API failed, falling back to LCG:', err);
    // Fallback to LCG if API fails
    for (let digit of generateLCGDigits(numDigits - index)) {
      yield digit;
      index++;
    }
  }
}

// Cellular Automaton Rule 30 digit generator
function* generateRule30Digits(numDigits) {
  let index = 0;
  const width = 100; // Width of the automaton
  let state = new Array(width).fill(0);
  state[Math.floor(width / 2)] = 1; // Start with a single 1 in the middle

  while (index < numDigits) {
    // Apply Rule 30: left XOR (center OR right)
    const newState = new Array(width).fill(0);
    for (let i = 0; i < width; i++) {
      const left = state[(i - 1 + width) % width];
      const center = state[i];
      const right = state[(i + 1) % width];
      newState[i] = left ^ (center | right);
    }
    state = newState;

    // Extract a digit from the sum of the row (mod 10)
    const sum = state.reduce((a, b) => a + b, 0);
    const digit = sum % 10;
    yield digit;
    index++;
  }
}

function validateAndCalculate() {
  const digitsInput = parseInt(document.getElementById('digits').value);
  const calcType = document.getElementById('calcType').value;
  if (isNaN(digitsInput) || digitsInput < 100 || digitsInput > 10000) {
    alert('Please enter a number between 100 and 10000.');
    return;
  }
  calculateDigits(digitsInput, calcType);
}

function submitGuess() {
  const guess = parseInt(document.getElementById('guess').value);
  if (isNaN(guess) || guess < 0 || guess > 9) {
    alert('Please enter a valid digit (0-9) for your guess.');
    return;
  }
  submittedGuess = guess;
  document.getElementById('guessResult').textContent = `Guess submitted: Digit ${guess}`;
  document.getElementById('guess').disabled = true;
  document.getElementById('submitGuess').disabled = true;
}

function copyDigits() {
  const digitSequence = document.getElementById('digitSequence').value;
  navigator.clipboard.writeText(digitSequence)
    .then(() => {
      alert('Digits copied to clipboard!');
    })
    .catch(err => {
      console.error('Failed to copy digits:', err);
      alert('Failed to copy digits. Please copy manually from the textbox.');
    });
}

function calculateDigits(digits, calcType) {
  counts = new Array(10).fill(0);
  if (!myChart) {
    myChart = initializeChart();
  }
  document.getElementById('liveDigit').textContent = 'Calculating...';
  document.getElementById('progress').textContent = `Processed: 0/${digits} digits`;
  document.getElementById('summaryReport').innerHTML = ''; // Clear previous report
  document.getElementById('guess').disabled = true;
  document.getElementById('submitGuess').disabled = true;
  document.getElementById('digitSequence').value = ''; // Clear the textbox
  let currentDigitIndex = 0;
  let updateCounter = 0;
  const updateInterval = 50;

  // Select the appropriate generator based on calcType
  let digitGenerator;
  if (calcType === 'pi') {
    digitGenerator = generatePiDigits(digits);
  } else if (calcType === 'gaussian') {
    digitGenerator = generateGaussianDigits(digits);
  } else if (calcType === 'perlin') {
    digitGenerator = generatePerlinDigits(digits);
  } else if (calcType === 'lcg') {
    digitGenerator = generateLCGDigits(digits);
  } else if (calcType === 'mersenne') {
    digitGenerator = generateMersenneDigits(digits);
  } else if (calcType === 'logistic') {
    digitGenerator = generateLogisticDigits(digits);
  } else if (calcType === 'middleSquare') {
    digitGenerator = generateMiddleSquareDigits(digits);
  } else if (calcType === 'xorshift') {
    digitGenerator = generateXorshiftDigits(digits);
  } else if (calcType === 'quantum') {
    // Quantum generator is async, handle it differently
    return (async () => {
      const gen = await generateQuantumDigits(digits);
      let digitSequence = '';
      let result;
      while (!(result = gen.next()).done && currentDigitIndex < digits) {
        const digit = result.value;
        counts[digit]++;
        digitSequence += digit;
        document.getElementById('liveDigit').textContent = digit;
        document.getElementById('progress').textContent = `Processed: ${currentDigitIndex + 1}/${digits} digits`;
        document.getElementById('digitSequence').value = digitSequence;

        updateCounter++;
        if (updateCounter >= updateInterval) {
          const target = Math.ceil(digits / 10);
          updateChartData(myChart, counts, target);
          updateCounter = 0;
        }

        currentDigitIndex++;
      }
      finalizeCalculation(digits, digitSequence);
    })();
  } else if (calcType === 'rule30') {
    digitGenerator = generateRule30Digits(digits);
  }

  let digitSequence = '';

  function updateLoop() {
    const result = digitGenerator.next();
    if (result.done || currentDigitIndex >= digits) {
      finalizeCalculation(digits, digitSequence);
      return;
    }

    const digit = result.value;
    counts[digit]++;
    digitSequence += digit;
    document.getElementById('liveDigit').textContent = digit;
    document.getElementById('progress').textContent = `Processed: ${currentDigitIndex + 1}/${digits} digits`;
    document.getElementById('digitSequence').value = digitSequence;

    updateCounter++;
    if (updateCounter >= updateInterval) {
      const target = Math.ceil(digits / 10);
      updateChartData(myChart, counts, target);
      updateCounter = 0;
    }

    currentDigitIndex++;
    requestAnimationFrame(updateLoop);
  }

  requestAnimationFrame(updateLoop);
}

function finalizeCalculation(digits, digitSequence) {
  console.log('Final chart update');
  const target = Math.ceil(digits / 10); // Example target: 10% of digits
  updateChartData(myChart, counts, target);
  document.getElementById('liveDigit').textContent = 'Done';
  document.getElementById('progress').textContent = `Processed: ${digits}/${digits} digits`;
  console.log('Digit sequence:', digitSequence);
  console.log('Counts:', counts);
  console.log('Total count:', counts.reduce((a, b) => a + b, 0));
  sessionStorage.setItem('digitCounts', JSON.stringify(counts));
  // Generate summary report
  const summary = counts.map((count, index) => {
    const tally = Math.floor(count / 5) + (count % 5 > 0 ? 1 : 0);
    return `Digit ${index}: ${tally} ${tally === 1 ? 'tally' : 'tallies'} (Count: ${count})`;
  }).join('<br>');
  document.getElementById('summaryReport').innerHTML = `<h2>Summary Report</h2><p>${summary}</p>`;
  // Check guess automatically if submitted
  if (submittedGuess !== null) {
    checkGuess();
  }
  // Re-enable guess input for next calculation
  document.getElementById('guess').disabled = false;
  document.getElementById('submitGuess').disabled = false;
}

function checkGuess() {
  const counts = JSON.parse(sessionStorage.getItem('digitCounts') || '[0,0,0,0,0,0,0,0,0,0]');
  const maxCount = Math.max(...counts);
  const winners = counts
    .map((count, index) => ({ digit: index, count }))
    .filter(d => d.count === maxCount)
    .map(d => d.digit);
  const guess = submittedGuess;

  if (winners.length > 0) {
    const message = winners.includes(guess)
      ? `Correct! Your guess (${guess}) was one of the digits with the most instances (${maxCount} occurrences). Winning digits: ${winners.join(', ')}.`
      : `Wrong! Your guess (${guess}) had ${counts[guess]} occurrences. The winning digits were ${winners.join(', ')} with ${maxCount} occurrences.`;
    document.getElementById('guessResult').textContent = message;
  } else {
    document.getElementById('guessResult').textContent = 'No digits calculated yet.';
  }
  // Reset guess for next calculation
  submittedGuess = null;
}

function toggleGuessSection() {
  const section = document.getElementById('guessSection');
  section.style.display = section.style.display === 'none' ? 'block' : 'none';
}