const ctxBar = document.getElementById("barChart").getContext("2d");
const ctxLine = document.getElementById("lineChart").getContext("2d");
const ctxLead = document.getElementById("leadChart").getContext("2d"); // NEW

const labels = [...Array(10).keys()];

const barChart = new Chart(ctxBar, {
  type: "bar",
  data: {
    labels,
    datasets: [{
      label: "Frequency",
      data: counts,
      borderWidth: 1
    }]
  },
  options: {
    animation: false,
    scales: {
      y: { beginAtZero: true }
    }
  }
});

const lineChart = new Chart(ctxLine, {
  type: "line",
  data: {
    labels,
    datasets: [{
      label: "Distribution Trend",
      data: counts,
      fill: false,
      tension: 0.1
    }]
  },
  options: {
    animation: false,
    scales: {
      y: { beginAtZero: true }
    }
  }
});

// -------- NEW LEAD CHART --------
const leadChart = new Chart(ctxLead, {
  type: "bar",
  data: {
    labels,
    datasets: [{
      label: "Time in Lead",
      data: leadCounts,
      borderWidth: 1
    }]
  },
  options: {
    animation: false,
    scales: {
      y: { beginAtZero: true }
    }
  }
});
// --------------------------------

function updateCharts() {
  barChart.data.datasets[0].data = counts;
  barChart.update();

  lineChart.data.datasets[0].data = counts;
  lineChart.update();

  leadChart.data.datasets[0].data = leadCounts; // NEW
  leadChart.update();
}
