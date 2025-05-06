let myChart;
let counts = new Array(10).fill(0);

// Vibrant color palette for digits 0-9
const digitColors = [
  'rgb(31, 119, 180)',   // 0: Blue
  'rgb(255, 127, 14)',   // 1: Orange
  'rgb(44, 160, 44)',    // 2: Green
  'rgb(214, 39, 40)',    // 3: Red
  'rgb(148, 103, 189)',  // 4: Purple
  'rgb(140, 86, 75)',    // 5: Brown
  'rgb(227, 119, 194)',  // 6: Pink
  'rgb(127, 127, 127)',  // 7: Gray
  'rgb(188, 189, 34)',   // 8: Olive
  'rgb(23, 190, 207)'    // 9: Cyan
];
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
        data: counts,
        backgroundColor: digitColors,
        borderColor: digitBorderColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
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
            return `Tally: ${tally}`;
          },
          color: '#000',
          font: { weight: 'bold', size: 14 },
          textAlign: 'center'
        }
      },
      animation: {
        duration: 0 // Disable animations for instant updates
      }
    }
  });
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
  if (!myChart) initializeChart();
  document.getElementById('liveDigit').textContent = 'Calculating...';
  document.getElementById('progress').textContent = `Processed: 0/${digits} digits`;
  document.getElementById('guessSection').style.display = 'block';
  let currentDigitIndex = 0;
  const digitGenerator = calcType === 'pi' ? generatePiDigits(digits) :
                         calcType === 'gaussian' ? generateGaussianDigits(digits) :
                         generatePerlinDigits(digits);
  let digitSequence = '';

  function updateLoop() {
    const result = digitGenerator.next();
    if (result.done || currentDigitIndex >= digits) {
      // Single chart update at the end
      console.log('Updating chart at end');
      const target = parseInt(document.getElementById('targetCount')?.value) || 500;
      const firstToTarget = counts.map((count, index) => ({ digit: index, count }))
        .find(d => d.count >= target)?.digit;
      myChart.data.datasets[0].backgroundColor = counts.map((_, i) => 
        i === firstToTarget ? 'rgb(255, 0, 0)' : digitColors[i]
      );
      myChart.data.datasets[0].borderColor = counts.map((_, i) => 
        i === firstToTarget ? 'rgb(200, 0, 0)' : digitBorderColors[i]
      );
      myChart.data.datasets[0].data = [...counts];
      myChart.options.scales.y.suggestedMax = Math.max(...counts, 1) * 1.2;
      myChart.update();
      document.getElementById('liveDigit').textContent = 'Done';
      document.getElementById('progress').textContent = `Processed: ${digits}/${digits} digits`;
      console.log('Digit sequence:', digitSequence);
      console.log('Counts:', counts);
      console.log('Total count:', counts.reduce((a, b) => a + b, 0));
      sessionStorage.setItem('digitCounts', JSON.stringify(counts));
      return;
    }

    const digit = result.value;
    counts[digit]++;
    digitSequence += digit;
    document.getElementById('liveDigit').textContent = digit;
    document.getElementById('progress').textContent = `Processed: ${currentDigitIndex + 1}/${digits} digits`;
    
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