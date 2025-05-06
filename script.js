let myChart;
let counts = new Array(10).fill(0);

function calculatePi() {
  const digits = parseInt(document.getElementById('digits').value);
  let pi = '';
  let q = 1, r = 0, t = 1, k = 1, n = 3, l = 3;
  counts = new Array(10).fill(0);
  updateChart(counts);
  document.getElementById('piResult').textContent = 'Calculating...';
  let currentDigitIndex = 0;

  const interval = setInterval(() => {
    if (4 * q + r - t < n * t) {
      const digit = n;
      pi += digit;
      counts[digit]++;
      document.getElementById('piResult').textContent = `Current digit: ${digit}`;
      updateChart(counts);
      const nr = 10 * (r - n * t);
      n = ((10 * (3 * q + r)) / t) - (10 * n);
      q *= 10;
      r = nr;
    } else {
      const nr = (2 * q + r) * l;
      const nn = (q * (7 * k) + 2 + (r * l)) / (t * l);
      q *= k;
      t *= l;
      l += 2;
      k += 1;
      n = nn;
      r = nr;
    }
    currentDigitIndex++;
    if (currentDigitIndex >= digits) {
      clearInterval(interval);
      document.getElementById('piResult').textContent = 'Calculation complete.';
      sessionStorage.setItem('piDigitCounts', JSON.stringify(counts));
    }
  }, 50);
}

function updateChart(counts) {
  const ctx = document.getElementById('digitChart').getContext('2d');
  const maxCount = Math.max(...counts, 1);
  const firstTo500 = counts.map((count, index) => ({ digit: index, count }))
    .find(d => d.count >= 500)?.digit;

  if (myChart) myChart.destroy();
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      datasets: [{
        label: 'Digit Counts',
        data: counts,
        backgroundColor: counts.map((_, i) => i === firstTo500 ? 'rgb(255, 0, 0)' : 'rgb(150, 150, 150)'),
        borderColor: counts.map((_, i) => i === firstTo500 ? 'rgb(200, 0, 0)' : 'rgb(100, 100, 100)'),
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: maxCount * 1.2,
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
            return `${context.chart.data.labels[context.dataIndex]}=${count}`;
          },
          color: '#000',
          font: { weight: 'bold', size: 12 }
        }
      },
      animation: {
        duration: 300,
        easing: 'linear'
      }
    },
    plugins: [{
      afterDatasetsDraw: chart => {
        const ctx = chart.ctx;
        chart.data.datasets[0].data.forEach((value, index) => {
          const meta = chart.getDatasetMeta(0);
          const x = meta.data[index].x;
          const y = meta.data[index].y;
          const count = counts[index];
          const tally = Math.floor(count / 5) + (count % 5 > 0 ? 1 : 0);
          ctx.fillStyle = '#000';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`Tally: ${tally}`, x, y - 35);
        });
      }
    }]
  });
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