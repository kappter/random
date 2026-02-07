// Visualization Module for Random Calculator
// Handles multiple visualization modes: 3D Scatter, Time Series, Spiral, Waterfall

// Global visualization state
let currentVizMode = 'bar';
let vizHistoryData = []; // Stores {position, digit, timestamp} for each generated digit
let scene, camera, renderer, controls;
let scatterPoints = [];

// Initialize visualization system
function initializeVisualizations() {
  // Set up 3D scene (will be shown/hidden as needed)
  setup3DScene();
}

// Switch between visualization modes
function switchVisualizationMode() {
  const mode = document.getElementById('vizMode').value;
  currentVizMode = mode;
  
  // Hide all canvases/containers
  document.getElementById('digitChart').style.display = 'none';
  document.getElementById('spiralCanvas').style.display = 'none';
  document.getElementById('threeDContainer').style.display = 'none';
  
  // Show the selected visualization
  switch(mode) {
    case 'bar':
      document.getElementById('digitChart').style.display = 'block';
      updateBarChart();
      break;
    case 'timeseries':
      document.getElementById('digitChart').style.display = 'block';
      updateTimeSeriesChart();
      break;
    case '3d':
      document.getElementById('threeDContainer').style.display = 'block';
      update3DScatter();
      break;
    case 'spiral':
      document.getElementById('spiralCanvas').style.display = 'block';
      updateSpiralVisualization();
      break;
    case 'waterfall':
      document.getElementById('digitChart').style.display = 'block';
      updateWaterfallChart();
      break;
  }
}

// ===== 3D SCATTER PLOT =====
function setup3DScene() {
  const container = document.getElementById('threeDContainer');
  
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a2e);
  
  // Camera
  camera = new THREE.PerspectiveCamera(75, container.clientWidth / 600, 0.1, 1000);
  camera.position.set(currentBase * 1.5, 50, currentBase * 1.5);
  
  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, 600);
  container.appendChild(renderer.domElement);
  
  // Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);
  
  // Add grid
  const gridHelper = new THREE.GridHelper(currentBase * 2, currentBase);
  gridHelper.material.opacity = 0.2;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);
  
  // Add axes
  const axesHelper = new THREE.AxesHelper(currentBase * 1.5);
  scene.add(axesHelper);
  
  // Add axis labels (simplified)
  addAxisLabels();
  
  // Animation loop
  animate3D();
}

function animate3D() {
  requestAnimationFrame(animate3D);
  if (controls) controls.update();
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

function addAxisLabels() {
  // Create text sprites for axis labels
  const loader = new THREE.FontLoader();
  
  // For now, use simple geometry to indicate axes
  // X-axis label (Digit Value)
  const xGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const xMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const xMarker = new THREE.Mesh(xGeometry, xMaterial);
  xMarker.position.set(currentBase, 0, 0);
  scene.add(xMarker);
  
  // Y-axis label (Time/Position)
  const yGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const yMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const yMarker = new THREE.Mesh(yGeometry, yMaterial);
  yMarker.position.set(0, 50, 0);
  scene.add(yMarker);
  
  // Z-axis label (Frequency)
  const zGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const zMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const zMarker = new THREE.Mesh(zGeometry, zMaterial);
  zMarker.position.set(0, 0, currentBase);
  scene.add(zMarker);
}

function update3DScatter() {
  if (!scene) setup3DScene();
  
  // Clear existing points
  scatterPoints.forEach(point => scene.remove(point));
  scatterPoints = [];
  
  // Create frequency map over time windows
  const windowSize = 100; // Group by 100 digits
  const windows = Math.ceil(vizHistoryData.length / windowSize);
  
  for (let w = 0; w < windows; w++) {
    const windowStart = w * windowSize;
    const windowEnd = Math.min((w + 1) * windowSize, vizHistoryData.length);
    const windowData = vizHistoryData.slice(windowStart, windowEnd);
    
    // Count digits in this window
    const windowCounts = new Array(currentBase).fill(0);
    windowData.forEach(item => {
      if (item.digit >= 0 && item.digit < currentBase) {
        windowCounts[item.digit]++;
      }
    });
    
    // Create spheres for each digit in this window
    for (let digit = 0; digit < currentBase; digit++) {
      if (windowCounts[digit] > 0) {
        const geometry = new THREE.SphereGeometry(0.3, 16, 16);
        const color = new THREE.Color(`hsl(${(digit / currentBase) * 360}, 70%, 60%)`);
        const material = new THREE.MeshPhongMaterial({ color: color });
        const sphere = new THREE.Mesh(geometry, material);
        
        // Position: X = digit value, Y = time window, Z = frequency
        sphere.position.set(
          digit - currentBase / 2,  // Center around 0
          w * 2,  // Stack windows vertically
          windowCounts[digit] / 5  // Scale frequency for visibility
        );
        
        scene.add(sphere);
        scatterPoints.push(sphere);
      }
    }
  }
  
  // Adjust camera to fit data
  if (windows > 0) {
    camera.position.set(currentBase, windows, currentBase);
    controls.target.set(0, windows / 2, 0);
    controls.update();
  }
}

// ===== TIME SERIES LINE CHART =====
function updateTimeSeriesChart() {
  // Calculate cumulative counts over time
  const timeWindows = 20; // Number of time slices
  const windowSize = Math.ceil(vizHistoryData.length / timeWindows);
  
  const datasets = [];
  const labels = [];
  
  // Create labels for time windows
  for (let i = 0; i < timeWindows; i++) {
    labels.push(`${i * windowSize}-${(i + 1) * windowSize}`);
  }
  
  // Create a dataset for each digit
  for (let digit = 0; digit < currentBase; digit++) {
    const data = [];
    let cumulativeCount = 0;
    
    for (let w = 0; w < timeWindows; w++) {
      const windowStart = w * windowSize;
      const windowEnd = Math.min((w + 1) * windowSize, vizHistoryData.length);
      const windowData = vizHistoryData.slice(windowStart, windowEnd);
      
      // Count this digit in this window
      const count = windowData.filter(item => item.digit === digit).length;
      cumulativeCount += count;
      data.push(cumulativeCount);
    }
    
    const color = `hsl(${(digit / currentBase) * 360}, 70%, 60%)`;
    datasets.push({
      label: digitLabels[digit],
      data: data,
      borderColor: color,
      backgroundColor: color + '20',
      borderWidth: 2,
      fill: false,
      tension: 0.1
    });
  }
  
  // Update or create chart
  const ctx = document.getElementById('digitChart').getContext('2d');
  
  if (myChart) {
    myChart.destroy();
  }
  
  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Time Series: Cumulative Digit Counts',
          color: '#fff',
          font: { size: 18 }
        },
        legend: {
          display: true,
          labels: { color: '#fff' }
        },
        datalabels: {
          display: false
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time Window (digit range)',
            color: '#fff'
          },
          ticks: { color: '#fff' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        y: {
          title: {
            display: true,
            text: 'Cumulative Count',
            color: '#fff'
          },
          ticks: { color: '#fff' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        }
      }
    }
  });
}

// ===== SPIRAL VISUALIZATION =====
function updateSpiralVisualization() {
  const canvas = document.getElementById('spiralCanvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = 600;
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const maxRadius = Math.min(centerX, centerY) - 20;
  
  // Clear canvas
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw spiral
  const totalDigits = vizHistoryData.length;
  const angleIncrement = 0.5; // Radians per digit
  const radiusIncrement = maxRadius / (totalDigits * angleIncrement / (2 * Math.PI));
  
  vizHistoryData.forEach((item, index) => {
    const angle = index * angleIncrement;
    const radius = (angle / (2 * Math.PI)) * radiusIncrement;
    
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    // Color based on digit value
    const hue = (item.digit / currentBase) * 360;
    ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fill();
  });
  
  // Draw legend
  ctx.fillStyle = '#fff';
  ctx.font = '14px Arial';
  ctx.fillText('Spiral Visualization: Each dot is a digit, colored by value', 10, 20);
  ctx.fillText('Time flows outward from center', 10, 40);
}

// ===== WATERFALL CHART =====
function updateWaterfallChart() {
  // Calculate changes between time windows
  const timeWindows = 10;
  const windowSize = Math.ceil(vizHistoryData.length / timeWindows);
  
  const labels = [];
  const datasets = [];
  
  // Calculate counts for each window
  const windowCounts = [];
  for (let w = 0; w < timeWindows; w++) {
    const windowStart = w * windowSize;
    const windowEnd = Math.min((w + 1) * windowSize, vizHistoryData.length);
    const windowData = vizHistoryData.slice(windowStart, windowEnd);
    
    const counts = new Array(currentBase).fill(0);
    windowData.forEach(item => {
      if (item.digit >= 0 && item.digit < currentBase) {
        counts[item.digit]++;
      }
    });
    windowCounts.push(counts);
    labels.push(`Window ${w + 1}`);
  }
  
  // Create stacked bar chart showing changes
  for (let digit = 0; digit < currentBase; digit++) {
    const data = windowCounts.map(counts => counts[digit]);
    const color = `hsl(${(digit / currentBase) * 360}, 70%, 60%)`;
    
    datasets.push({
      label: digitLabels[digit],
      data: data,
      backgroundColor: color,
      borderColor: color,
      borderWidth: 1
    });
  }
  
  // Update or create chart
  const ctx = document.getElementById('digitChart').getContext('2d');
  
  if (myChart) {
    myChart.destroy();
  }
  
  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Waterfall Chart: Digit Distribution Over Time Windows',
          color: '#fff',
          font: { size: 18 }
        },
        legend: {
          display: true,
          labels: { color: '#fff' }
        },
        datalabels: {
          display: false
        }
      },
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: 'Time Window',
            color: '#fff'
          },
          ticks: { color: '#fff' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: 'Count',
            color: '#fff'
          },
          ticks: { color: '#fff' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        }
      }
    }
  });
}

// Update bar chart (existing functionality)
function updateBarChart() {
  if (!myChart) return;
  
  myChart.data.datasets[0].data = counts;
  myChart.data.labels = digitLabels;
  myChart.update();
}

// Add digit to history (called during generation)
function addDigitToHistory(digit, position) {
  vizHistoryData.push({
    digit: digit,
    position: position,
    timestamp: Date.now()
  });
  
  // Update current visualization if needed
  if (currentVizMode !== 'bar' && position % 10 === 0) {
    // Update every 10 digits for performance
    switchVisualizationMode();
  }
}

// Clear history (called on reset)
function clearVisualizationHistory() {
  vizHistoryData = [];
  if (scene) {
    scatterPoints.forEach(point => scene.remove(point));
    scatterPoints = [];
  }
}

// Initialize on page load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initializeVisualizations();
  });
}
