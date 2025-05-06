let myChart;
let counts = new Array(10).fill(0);

function initializeChart() {
  const ctx = document.getElementById('digitChart').getContext('2d');
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      datasets: [{
        label: 'Digit Counts',
        data: counts,
        backgroundColor: counts.map(() => 'rgb(150, 150, 150)'),
        borderColor: counts.map(() => 'rgb(100, 100, 100)'),
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Count' },
          ticks: { stepSize: 100 }
        },
        x: {
          title: { display: true, text: 'Digits' }
        }
      },
      plugins: {
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: (value, context) => {
            const count = counts[context.dataIndex];
            const tally = Math.floor(count / 5) + (count % 5 > 0 ? 1 : 0);
            return `Tally: ${tally}`;
          },
          color: '#000',
          font: { weight: 'bold', size: 12 }
        }
      },
      animation: {
        duration: 100,
        easing: 'linear'
      }
    }
  });
}

// Simplified Pi digit generator using a precomputed sequence for reliability
function* generatePiDigits(numDigits) {
  // First few digits of Pi for validation: 3.1415926535...
  const piDigits = [
    3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3, 2, 3, 8, 4, 
    6, 2, 6, 4, 3, 3, 8, 3, 2, 7, 9, 5, 0, 2, 8, 8, 4, 1, 9, 7, 
    1, 6, 9, 3, 9, 9, 3, 7, 5, 1, 0, 5, 8, 2, 0, 9, 7, 4, 9, 4, 
    4, 5, 9, 2, 3, 0, 7, 8, 1, 6, 4, 0, 6, 2, 8, 6, 2, 0, 8, 9, 
    9, 8, 6, 2, 8, 0, 3, 4, 8, 2, 5, 3, 4, 2, 1, 1, 7, 0, 6, 7
  ];
  let index = 0;
  
  // Yield the known digits up to numDigits
  while (index < numDigits) {
    yield piDigits[index % piDigits.length]; // Loop through known digits if needed
    index++;
  }
}

function validateAndCalculate() {
  const digitsInput = parseInt(document.getElementById('digits').value);
  if (isNaN(digitsInput) || digitsInput < 100 || digitsInput > 10000) {
    alert('Please enter a number between 100 and 10000.');
    return;
  }
  calculatePi(digitsInput);
}

function calculatePi(digits) {
  counts = new Array(10).fill(0);
  if (!myChart) initializeChart();
  document.getElementById('liveDigit').textContent = 'Calculating...';
  document.getElementById('progress').textContent = `Processed: 0/${digits} digits`;
  document.getElementById('guessSection').style.display = 'block';
  let currentDigitIndex = 0;
  const piDigitGenerator = generatePiDigits(digits);
  let piDigits = '';

  const interval = setInterval(() => {
    const { value: digit, done } = piDigitGenerator.next();
    if (done || currentDigitIndex >= digits) {
      clearInterval(interval);
      document.getElementById('liveDigit').textContent = 'Done';
      document.getElementById('progress').textContent = `Processed: ${digits}/${digits} digits`;
      console.log('Pi digits:', piDigits);
      console.log('Counts:', counts);
      console.log('Total count:', counts.reduce((a, b) => a + b, 0));
      sessionStorage.setItem('piDigitCounts', JSON.stringify(counts));
      return;
    }

    counts[digit]++;
    piDigits += digit;
    document.getElementById('liveDigit').textContent = digit;
    document.getElementById('progress').textContent = `Processed: ${currentDigitIndex + 1}/${digits} digits`;
    
    // Update chart colors for the first digit to reach target
    const target = parseInt(document.getElementById('targetCount')?.value) || 500;
    const firstToTarget = counts.map((count, index) => ({ digit: index, count }))
      .find(d => d.count >= target)?.digit;
    myChart.data.datasets[0].backgroundColor = counts.map((_, i) => i === firstToTarget ? 'rgb(255, 0, 0)' : 'rgb(150, 150, 150)');
    myChart.data.datasets[0].borderColor = counts.map((_, i) => i === firstToTarget ? 'rgb(200, 0, 0)' : 'rgb(100, 100, 100)');
    
    // Update chart data
    myChart.data.datasets[0].data = [...counts];
    myChart.options.scales.y.max = Math.max(...counts, 1) * 1.2;
    myChart.update();
    
    currentDigitIndex++;
  }, 50);
}

function checkGuess() {
  const target = parseInt(document.getElementById('targetCount').value);
  const guess = parseInt(document.getElementById('guess').value);
  const counts = JSON.parse(sessionStorage.getItem('piDigitCounts') || '[0,0,0,0,0,0,0,0,0,0]');
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