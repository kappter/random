// Global state
let myChart = null;
let currentBase = 10;
let counts = [];
let digitLabels = [];
let digitColors = [];
let submittedGuess = null;
let isCalculating = false;
let isPaused = false;
let digitGenerator = null;
let currentDigitIndex = 0;

// Base system names
const BaseNames = {
  2: 'Binary', 3: 'Ternary', 4: 'Quaternary', 5: 'Quinary',
  6: 'Senary', 7: 'Septenary', 8: 'Octal', 9: 'Nonary',
  10: 'Decimal', 11: 'Undecimal', 12: 'Duodecimal'
};

// Algorithm metadata
const AlgorithmMetadata = {
  pi: {
    name: 'Pi Digits',
    type: 'Deterministic',
    distribution: 'Uniform (Expected)',
    description: 'Uses the digits of Pi. While deterministic, Pi digits are expected to be uniformly distributed across all bases.',
    compatibleBases: [10], // Pi precomputed only for base 10
    fallbackDescription: 'Computed algorithmically for non-base-10 systems.'
  },
  gaussian: {
    name: 'Gaussian Distribution',
    type: 'Pseudo-random',
    distribution: 'Normal (Bell Curve)',
    description: 'Generates digits using Box-Muller transform. Creates a bell curve centered at the middle digit.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  perlin: {
    name: 'Perlin Noise',
    type: 'Pseudo-random',
    distribution: 'Smooth Random',
    description: 'Uses Perlin noise for natural-looking randomness with smooth transitions between values.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  lcg: {
    name: 'Linear Congruential Generator',
    type: 'Pseudo-random',
    distribution: 'Uniform',
    description: 'Classic PRNG using linear recurrence. Fast but has known statistical weaknesses.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  mersenne: {
    name: 'Mersenne Twister',
    type: 'Pseudo-random',
    distribution: 'Uniform',
    description: 'High-quality PRNG with very long period. Widely used in scientific computing.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  logistic: {
    name: 'Logistic Map',
    type: 'Chaotic',
    distribution: 'Non-uniform (Chaotic)',
    description: 'Generates digits from chaotic dynamics. Deterministic but highly sensitive to initial conditions.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  middleSquare: {
    name: 'Middle-Square Method',
    type: 'Pseudo-random',
    distribution: 'Uniform (with cycles)',
    description: 'Von Neumann\'s classic method. May enter short cycles, requiring reseeding.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  xorshift: {
    name: 'Xorshift',
    type: 'Pseudo-random',
    distribution: 'Uniform',
    description: 'Fast PRNG using bitwise XOR operations. Good statistical properties.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  quantum: {
    name: 'Quantum Random (API)',
    type: 'True Random',
    distribution: 'Uniform',
    description: 'Fetches true random numbers from quantum measurements. Falls back to LCG if API unavailable.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  rule30: {
    name: 'Cellular Automaton Rule 30',
    type: 'Chaotic',
    distribution: 'Complex',
    description: 'Generates digits from Rule 30 cellular automaton evolution. Shows complex, random-like patterns.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  }
};

// Base configuration
function initializeBase(base) {
  currentBase = base;
  digitLabels = generateLabels(base);
  digitColors = generateColors(base);
  counts = new Array(base).fill(0);
  
  // Update base info display
  document.getElementById('baseInfo').textContent = `Base ${base} (${BaseNames[base]})`;
  
  // Update algorithm dropdown compatibility
  updateAlgorithmCompatibility();
}

function generateLabels(base) {
  const labels = [];
  for (let i = 0; i < base; i++) {
    if (i < 10) {
      labels.push(String(i));
    } else if (i === 10) {
      labels.push('A');
    } else if (i === 11) {
      labels.push('B');
    }
  }
  return labels;
}

function generateColors(base) {
  return Array.from({ length: base }, (_, i) => {
    const lightness = 80 - (i / (base - 1)) * 60;
    return `hsl(240, 100%, ${lightness}%)`;
  });
}

function digitToString(digit) {
  return digitLabels[digit];
}

function stringToDigit(str) {
  const upper = str.toUpperCase();
  const index = digitLabels.indexOf(upper);
  return index !== -1 ? index : null;
}

// Update algorithm dropdown based on base compatibility
function updateAlgorithmCompatibility() {
  const select = document.getElementById('calcType');
  const options = select.options;
  
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    const algoKey = option.value;
    const metadata = AlgorithmMetadata[algoKey];
    
    if (metadata && metadata.compatibleBases) {
      const isCompatible = metadata.compatibleBases.includes(currentBase);
      option.disabled = !isCompatible;
      
      if (!isCompatible) {
        option.text = `${metadata.name} (Not available for base ${currentBase})`;
      } else {
        option.text = metadata.name;
      }
    }
  }
  
  // If current selection is incompatible, switch to first compatible
  const currentAlgo = select.value;
  if (AlgorithmMetadata[currentAlgo] && 
      !AlgorithmMetadata[currentAlgo].compatibleBases.includes(currentBase)) {
    for (let i = 0; i < options.length; i++) {
      if (!options[i].disabled) {
        select.value = options[i].value;
        break;
      }
    }
  }
  
  updateAlgorithmInfo();
}

// Update algorithm info panel
function updateAlgorithmInfo() {
  const calcType = document.getElementById('calcType').value;
  const metadata = AlgorithmMetadata[calcType];
  
  if (metadata) {
    document.getElementById('algoName').textContent = `Algorithm: ${metadata.name}`;
    document.getElementById('algoType').textContent = metadata.type;
    document.getElementById('algoDistribution').textContent = metadata.distribution;
    
    let description = metadata.description;
    if (metadata.fallbackDescription && !metadata.compatibleBases.includes(currentBase)) {
      description += ' ' + metadata.fallbackDescription;
    }
    document.getElementById('algoDescription').textContent = description;
  }
}

// Update base system
function updateBase() {
  const baseInput = parseInt(document.getElementById('baseSystem').value);
  
  if (isNaN(baseInput) || baseInput < 2 || baseInput > 12) {
    alert('Please enter a base between 2 and 12.');
    return;
  }
  
  if (isCalculating) {
    alert('Cannot change base during calculation. Please reset first.');
    return;
  }
  
  initializeBase(baseInput);
  
  if (myChart) {
    myChart.destroy();
    myChart = null;
  }
  
  myChart = initializeChart();
  resetCalculation();
}

// Initialize chart
function initializeChart() {
  const ctx = document.getElementById('digitChart').getContext('2d');
  
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: digitLabels,
      datasets: [{
        label: 'Digit Counts',
        data: new Array(currentBase).fill(0),
        backgroundColor: digitColors,
        borderColor: digitColors.map(c => c.replace('hsl', 'hsla').replace(')', ', 0.8)')),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Count', font: { size: 14, weight: 'bold' } },
          ticks: { stepSize: Math.max(1, Math.ceil(100 / currentBase)) },
          suggestedMax: 100
        },
        x: {
          title: { display: true, text: `Digits (Base ${currentBase})`, font: { size: 14, weight: 'bold' } }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          display: true,
          anchor: 'center',
          align: 'center',
          formatter: (value) => {
            const tally = Math.ceil(value / 5);
            return tally > 0 ? `${tally}` : '';
          },
          color: '#fff',
          font: { weight: 'bold', size: 14 }
        }
      },
      animation: {
        duration: 200,
        easing: 'easeInOutQuad'
      }
    }
  });
  
  return chart;
}

// Update chart data
function updateChartData(chart, data) {
  const maxCount = Math.max(...data);
  const winningDigits = data.reduce((winners, count, index) => {
    if (count === maxCount && maxCount > 0) winners.push(index);
    return winners;
  }, []);
  
  chart.data.datasets[0].backgroundColor = data.map((_, i) => 
    winningDigits.includes(i) ? 'rgb(139, 0, 0)' : digitColors[i]
  );
  chart.data.datasets[0].borderColor = data.map((_, i) => 
    winningDigits.includes(i) ? 'rgba(139, 0, 0, 0.8)' : digitColors[i].replace('hsl', 'hsla').replace(')', ', 0.8)')
  );
  chart.data.datasets[0].data = [...data];
  chart.options.scales.y.suggestedMax = Math.max(...data, 1) * 1.2;
  
  chart.update();
  
  // Update statistics
  updateStatistics(data);
}

// Calculate and update statistics
function updateStatistics(counts) {
  const total = counts.reduce((sum, count) => sum + count, 0);
  if (total === 0) return;
  
  // Calculate mean
  let weightedSum = 0;
  for (let i = 0; i < currentBase; i++) {
    weightedSum += i * counts[i];
  }
  const mean = weightedSum / total;
  
  // Calculate standard deviation
  let variance = 0;
  for (let i = 0; i < currentBase; i++) {
    variance += counts[i] * Math.pow(i - mean, 2);
  }
  const stdDev = Math.sqrt(variance / total);
  
  // Calculate chi-square
  const expected = total / currentBase;
  let chiSquare = 0;
  for (let i = 0; i < currentBase; i++) {
    chiSquare += Math.pow(counts[i] - expected, 2) / expected;
  }
  
  document.getElementById('statMean').textContent = mean.toFixed(2);
  document.getElementById('statStdDev').textContent = stdDev.toFixed(2);
  document.getElementById('statChiSquare').textContent = chiSquare.toFixed(2);
}

// Algorithm generators adapted for arbitrary bases

function* generatePiDigitsInBase(numDigits, base) {
  if (base === 10) {
    const piDigits = [
      3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4,
      6, 2, 6, 4, 3, 3, 8, 3, 2, 7, 9, 5, 0, 2, 8, 8, 4, 1, 9, 7,
      1, 6, 9, 3, 9, 9, 3, 7, 5, 1, 0, 5, 8, 2, 0, 9, 7, 4, 9, 4,
      4, 5, 9, 2, 3, 0, 7, 8, 1, 6, 4, 0, 6, 2, 8, 6, 2, 0, 8, 9,
      9, 8, 6, 2, 8, 0, 3, 4, 8, 2, 5, 3, 4, 2, 1, 1, 7, 0, 6, 7
    ];
    let index = 0;
    while (index < numDigits) {
      yield piDigits[index % piDigits.length];
      index++;
    }
  } else {
    // Compute Pi digits in arbitrary base
    let piValue = Math.PI;
    let fractionalPart = piValue - Math.floor(piValue);
    
    for (let i = 0; i < numDigits; i++) {
      fractionalPart *= base;
      const digit = Math.floor(fractionalPart);
      yield digit % base;
      fractionalPart -= Math.floor(fractionalPart);
    }
  }
}

function* generateGaussianDigits(numDigits, base) {
  const mean = (base - 1) / 2;
  const stdDev = base / 6;
  
  let index = 0;
  while (index < numDigits) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const digit = Math.round(mean + stdDev * z);
    const clampedDigit = Math.max(0, Math.min(base - 1, digit));
    yield clampedDigit;
    index++;
  }
}

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

function* generatePerlinDigits(numDigits, base) {
  let index = 0;
  const seed = Math.random() * 1000;
  while (index < numDigits) {
    const noise = perlinNoise(index * 0.1, seed);
    const digit = Math.floor(((noise + 1) / 2) * base);
    const clampedDigit = Math.max(0, Math.min(base - 1, digit));
    yield clampedDigit;
    index++;
  }
}

function* generateLCGDigits(numDigits, base) {
  let index = 0;
  let seed = Date.now() % 4294967296;
  const a = 1664525;
  const c = 1013904223;
  const m = 2**32;
  while (index < numDigits) {
    seed = (a * seed + c) % m;
    const value = seed / m;
    const digit = Math.floor(value * base);
    yield digit;
    index++;
  }
}

function* generateMersenneDigits(numDigits, base) {
  let index = 0;
  const seed = Date.now();
  let mt = new Array(624);
  let mtIndex = 0;

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
    const value = extractNumber() / 0xffffffff;
    const digit = Math.floor(value * base);
    yield digit;
    index++;
  }
}

function* generateLogisticDigits(numDigits, base) {
  let index = 0;
  let x = 0.1;
  const r = 3.9;
  while (index < numDigits) {
    x = r * x * (1 - x);
    const digit = Math.floor(x * base);
    yield Math.min(digit, base - 1);
    index++;
  }
}

function* generateMiddleSquareDigits(numDigits, base) {
  let index = 0;
  let seed = (Date.now() % 9000) + 1000;
  const seen = new Set();
  while (index < numDigits) {
    const squared = seed * seed;
    const squaredStr = squared.toString().padStart(8, '0');
    seed = parseInt(squaredStr.slice(2, 6));
    if (seed === 0 || seen.has(seed)) {
      seed = (Date.now() % 9000) + 1000;
      seen.clear();
    }
    seen.add(seed);
    const digit = Math.floor((seed / 10000) * base);
    yield digit;
    index++;
  }
}

function* generateXorshiftDigits(numDigits, base) {
  let index = 0;
  let x = Date.now() % 4294967296;
  while (index < numDigits) {
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    const value = (x & 0xffffffff) / 0xffffffff;
    const digit = Math.floor(value * base);
    yield digit;
    index++;
  }
}

async function* generateQuantumDigits(numDigits, base) {
  let index = 0;
  try {
    const response = await fetch('https://qrng.anu.edu.au/API/jsonI.php?length=' + Math.ceil(numDigits / 2) + '&type=uint8');
    const data = await response.json();
    if (data.success && Array.isArray(data.data)) {
      const numbers = data.data;
      for (let num of numbers) {
        if (index >= numDigits) break;
        const digit1 = Math.floor((num / 256) * base);
        const digit2 = Math.floor(((num % 128) / 128) * base);
        if (index < numDigits) {
          yield digit1;
          index++;
        }
        if (index < numDigits) {
          yield digit2;
          index++;
        }
      }
    } else {
      throw new Error('Invalid API response');
    }
  } catch (err) {
    console.error('Quantum API failed, falling back to LCG:', err);
    for (let digit of generateLCGDigits(numDigits - index, base)) {
      yield digit;
      index++;
    }
  }
}

function* generateRule30Digits(numDigits, base) {
  let index = 0;
  const width = 100;
  let state = new Array(width).fill(0);
  state[Math.floor(width / 2)] = 1;

  while (index < numDigits) {
    const newState = new Array(width).fill(0);
    for (let i = 0; i < width; i++) {
      const left = state[(i - 1 + width) % width];
      const center = state[i];
      const right = state[(i + 1) % width];
      newState[i] = left ^ (center | right);
    }
    state = newState;

    const sum = state.reduce((a, b) => a + b, 0);
    const digit = sum % base;
    yield digit;
    index++;
  }
}

// Main calculation functions

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
  const guessInput = document.getElementById('guess').value.toUpperCase();
  const guessDigit = stringToDigit(guessInput);
  
  if (guessDigit === null || guessDigit < 0 || guessDigit >= currentBase) {
    alert(`Please enter a valid digit for base ${currentBase}: ${digitLabels.join(', ')}`);
    return;
  }
  
  submittedGuess = guessDigit;
  document.getElementById('guessResult').textContent = `Guess submitted: Digit ${digitToString(guessDigit)}`;
  document.getElementById('guess').disabled = true;
  document.getElementById('submitGuess').disabled = true;
}

function toggleGuessSection() {
  const section = document.getElementById('guessSection');
  section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

function togglePause() {
  isPaused = !isPaused;
  document.getElementById('pauseBtn').textContent = isPaused ? 'Resume' : 'Pause';
}

function resetCalculation() {
  isCalculating = false;
  isPaused = false;
  currentDigitIndex = 0;
  counts = new Array(currentBase).fill(0);
  submittedGuess = null;
  
  document.getElementById('liveDigit').textContent = 'Not started';
  document.getElementById('progress').textContent = 'Processed: 0 digits';
  document.getElementById('digitSequence').value = '';
  document.getElementById('summaryReport').innerHTML = '';
  document.getElementById('guessResult').textContent = '';
  document.getElementById('guess').value = '';
  document.getElementById('guess').disabled = false;
  document.getElementById('submitGuess').disabled = false;
  document.getElementById('pauseBtn').disabled = true;
  document.getElementById('pauseBtn').textContent = 'Pause';
  
  document.getElementById('statMean').textContent = '-';
  document.getElementById('statStdDev').textContent = '-';
  document.getElementById('statChiSquare').textContent = '-';
  
  if (myChart) {
    updateChartData(myChart, counts);
  }
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
  counts = new Array(currentBase).fill(0);
  if (!myChart) {
    myChart = initializeChart();
  }
  
  isCalculating = true;
  isPaused = false;
  currentDigitIndex = 0;
  
  document.getElementById('liveDigit').textContent = 'Calculating...';
  document.getElementById('progress').textContent = `Processed: 0/${digits} digits`;
  document.getElementById('summaryReport').innerHTML = '';
  document.getElementById('guess').disabled = true;
  document.getElementById('submitGuess').disabled = true;
  document.getElementById('pauseBtn').disabled = false;
  document.getElementById('digitSequence').value = '';
  
  const updateInterval = parseInt(document.getElementById('updateFrequency').value);
  let updateCounter = 0;
  let digitSequence = '';

  // Select appropriate generator
  if (calcType === 'pi') {
    digitGenerator = generatePiDigitsInBase(digits, currentBase);
  } else if (calcType === 'gaussian') {
    digitGenerator = generateGaussianDigits(digits, currentBase);
  } else if (calcType === 'perlin') {
    digitGenerator = generatePerlinDigits(digits, currentBase);
  } else if (calcType === 'lcg') {
    digitGenerator = generateLCGDigits(digits, currentBase);
  } else if (calcType === 'mersenne') {
    digitGenerator = generateMersenneDigits(digits, currentBase);
  } else if (calcType === 'logistic') {
    digitGenerator = generateLogisticDigits(digits, currentBase);
  } else if (calcType === 'middleSquare') {
    digitGenerator = generateMiddleSquareDigits(digits, currentBase);
  } else if (calcType === 'xorshift') {
    digitGenerator = generateXorshiftDigits(digits, currentBase);
  } else if (calcType === 'quantum') {
    (async () => {
      const gen = generateQuantumDigits(digits, currentBase);
      while (currentDigitIndex < digits) {
        if (isPaused) {
          await new Promise(resolve => setTimeout(resolve, 100));
          continue;
        }
        
        const { value, done } = await gen.next();
        if (done) break;
        const digit = value;
        counts[digit]++;
        digitSequence += digitToString(digit);
        document.getElementById('liveDigit').textContent = digitToString(digit);
        document.getElementById('progress').textContent = `Processed: ${currentDigitIndex + 1}/${digits} digits`;
        document.getElementById('digitSequence').value = digitSequence;

        updateCounter++;
        if (updateCounter >= updateInterval) {
          updateChartData(myChart, counts);
          updateCounter = 0;
        }

        currentDigitIndex++;
      }
      finalizeCalculation(digits, digitSequence);
    })();
    return;
  } else if (calcType === 'rule30') {
    digitGenerator = generateRule30Digits(digits, currentBase);
  }

  function updateLoop() {
    if (isPaused) {
      requestAnimationFrame(updateLoop);
      return;
    }
    
    const result = digitGenerator.next();
    if (result.done || currentDigitIndex >= digits) {
      finalizeCalculation(digits, digitSequence);
      return;
    }

    const digit = result.value;
    counts[digit]++;
    digitSequence += digitToString(digit);
    document.getElementById('liveDigit').textContent = digitToString(digit);
    document.getElementById('progress').textContent = `Processed: ${currentDigitIndex + 1}/${digits} digits`;
    document.getElementById('digitSequence').value = digitSequence;

    updateCounter++;
    if (updateCounter >= updateInterval) {
      updateChartData(myChart, counts);
      updateCounter = 0;
    }

    currentDigitIndex++;
    requestAnimationFrame(updateLoop);
  }

  requestAnimationFrame(updateLoop);
}

function finalizeCalculation(digits, digitSequence) {
  isCalculating = false;
  updateChartData(myChart, counts);
  document.getElementById('liveDigit').textContent = 'Done';
  document.getElementById('progress').textContent = `Processed: ${digits}/${digits} digits`;
  document.getElementById('pauseBtn').disabled = true;
  
  const summary = counts.map((count, index) => {
    const tally = Math.ceil(count / 5);
    return `Digit ${digitToString(index)}: ${tally} ${tally === 1 ? 'tally' : 'tallies'} (Count: ${count})`;
  }).join('<br>');
  document.getElementById('summaryReport').innerHTML = `<h2>Summary Report</h2><p>${summary}</p>`;
  
  if (submittedGuess !== null) {
    checkGuess();
  }
  
  document.getElementById('guess').disabled = false;
  document.getElementById('submitGuess').disabled = false;
}

function checkGuess() {
  const maxCount = Math.max(...counts);
  const winners = counts
    .map((count, index) => ({ digit: index, count }))
    .filter(d => d.count === maxCount)
    .map(d => d.digit);
  
  const winnerLabels = winners.map(d => digitToString(d)).join(', ');
  
  if (winners.includes(submittedGuess)) {
    document.getElementById('guessResult').textContent = 
      `Correct! Your guess (${digitToString(submittedGuess)}) was one of the digits with the most instances (${maxCount} occurrences). Winning digits: ${winnerLabels}.`;
  } else {
    document.getElementById('guessResult').textContent = 
      `Wrong! Your guess (${digitToString(submittedGuess)}) had ${counts[submittedGuess]} occurrences. The winning digits were ${winnerLabels} with ${maxCount} occurrences.`;
  }
  
  submittedGuess = null;
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  initializeBase(10);
  myChart = initializeChart();
  updateAlgorithmInfo();
});
