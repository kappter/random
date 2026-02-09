  const ctx = document.getElementById('digitChart').getContext('2d');
  
  if (myChart) {
    myChart.destroy();
  }
  
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: digitLabels,
      datasets: [{
        label: 'Count',
        data: counts,
        backgroundColor: digitColors,
        borderColor: digitColors.map(c => c.replace('60%', '40%')),
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: `Digit Frequency - ${getAlgorithmName()} (Base ${currentBase})`,
          font: { size: 16, weight: 'bold' }
        },
        datalabels: {
          anchor: 'center',
          align: 'center',
          formatter: (value) => {
            return value > 0 ? value : '';
          },
          color: '#fff',
          font: { size: 14, weight: 'bold' }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Count' }
        },
        x: {
          title: { display: true, text: `Digits (Base ${currentBase})` }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}

// Create time series chart
function createTimeSeriesChart() {
  const ctx = document.getElementById('timeSeriesChart').getContext('2d');
  
  if (timeSeriesChart) {
    timeSeriesChart.destroy();
  }
  
  // Prepare datasets - one line per digit
  const datasets = [];
  for (let digit = 0; digit < currentBase; digit++) {