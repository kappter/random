let myChart;
let counts = new Array(10).fill(0);

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
          display: true,
          anchor: 'end',
          align: 'top',
          offset: 5,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 4,
          padding: 6,
          formatter: (value) => {
            const tally = Math.floor(value / 5) + (value % 5 > 0 ? 1 : 0);
            return `Count: ${value}\nTally: ${tally}`;
          },
          color: '#000',
          font: { weight: 'bold', size: 14 },
          textAlign: 'center'
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
  const firstToTarget = data.map((count, index) => ({ digit: index, count }))
    .find(d => d.count >= target)?.digit;
  chart.data.datasets[0].backgroundColor = data.map((_, i) => 
    i === firstToTarget ? 'rgb(255, 0, 0)' : digitColors[i]
  );
  chart.data.datasets[0].borderColor = data.map((_, i) => 
    i === firstToTarget ? 'rgb(200, 0, 0)' : digitBorderColors[i]
  );
  chart.data.datasets[0].data = [...data];
  chart.options.scales.y.suggestedMax = Math.max(...data, 1) * 1.2;
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

function validateAndCalculate() {
  const digitsInput = parseInt(document.getElementById('digits').value);
  const calcType = document.getElementById('calcType').value;
  if (isNaN(digitsInput) || digitsInput < 100 || digitsInput > 10000) {
    alert('Please enter a number between 100 and 10000.');
    return;
  }
  calculateDigits(digitsInput, calcType);
}

function calculateDigits(digits, calcType) {
  counts = new Array(10).fill(0);
  if (!myChart) {
    myChart = initializeChart();
  }
  document.getElementById('liveDigit').textContent = 'Calculating...';
  document.getElementById('progress').textContent = `Processed: 0/${digits} digits`;
  document.getElementById('guessSection').style.display = 'block';
  document.getElementById('summaryReport').innerHTML = ''; // Clear previous report
  let currentDigitIndex = 0;
  let updateCounter = 0;
  const updateInterval = 50;
  const digitGenerator = calcType === 'pi' ? generatePiDigits(digits) :
                         calcType === 'gaussian' ? generateGaussianDigits(digits) :
                         calcType === 'perlin' ? generatePerlinDigits(digits) :
                         generateLCGDigits(digits);
  let digitSequence = '';

  function updateLoop() {
    const result = digitGenerator.next();
    if (result.done || currentDigitIndex >= digits) {
      console.log('Final chart update');
      const target = parseInt(document.getElementById('targetCount')?.value) || 500;
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
      return;
    }

    const digit = result.value;
    counts[digit]++;
    digitSequence += digit;
    document.getElementById('liveDigit').textContent = digit;
    document.getElementById('progress').textContent = `Processed: ${currentDigitIndex + 1}/${digits} digits`;

    updateCounter++;
    if (updateCounter >= updateInterval) {
      const target = parseInt(document.getElementById('targetCount')?.value) || 500;
      updateChartData(myChart, counts, target);
      updateCounter = 0;
    }

    currentDigitIndex++;
    requestAnimationFrame(updateLoop);
  }

  requestAnimationFrame(updateLoop);
}

function checkGuess() {
  const target = parseInt(document.getElementById('targetCount').value);
  const guess = parseInt(document.getElementById('guess').value);
  const counts = JSON.parse(sessionStorage.getItem('digitCounts') || '[0,0,0,0,0,0,0,0,0,0]');
  const result = counts.map((count, index) => ({ digit: index, count })).sort((a, b) => b.count - a.count);
  const firstToTarget = result.find(d => d.count >= target);
  if (firstToTarget) {
    const message = guess === firstToTarget.digit 
      ? `Correct! The first digit to reach ${target} is ${firstToTarget.digit} with ${firstToTarget.count} occurrences.`
      : `Wrong! The first digit to reach ${target} is ${firstToTarget.digit} with ${firstToTarget.count} occurrences.`;
    document.getElementById('guessResult').textContent = message;
  } else {
    document.getElementById('guessResult').textContent = 'Not enough digits calculated yet.';
  }
}

function toggleGuessSection() {
  const section = document.getElementById('guessSection');
  section.style.display = section.style.display === 'none' ? 'block' : 'none';
}