// Global variables
let myChart = null;
let timeSeriesChart = null;
let currentBase = 10;
let counts = [];
let digitLabels = [];
let digitColors = [];
let submittedGuess = null;
let isCalculating = false;
let isPaused = false;
let digitGenerator = null;
let currentDigitIndex = 0;
let generationSpeed = 100; // milliseconds per digit
let timeSeriesData = []; // Array of snapshots: [{step: 0, counts: [0,0,0...]}, ...]
let spiralCanvas = null; // Radial polygon canvas
let spiralCtx = null;
let currentRotation = 0; // Current rotation angle in radians
let targetRotation = 0; // Target rotation angle for smooth easing
let rotationSpeed = 0.1; // Easing speed (0-1, higher = faster)

// Base system names
const BaseNames = {
  2: 'Binary', 3: 'Ternary', 4: 'Quaternary', 5: 'Quinary',
  6: 'Senary', 7: 'Septenary', 8: 'Octal', 9: 'Nonary',
  10: 'Decimal', 11: 'Undecimal', 12: 'Duodecimal',
  13: 'Tridecimal', 14: 'Tetradecimal', 15: 'Pentadecimal', 16: 'Hexadecimal'
};

// Algorithm metadata with categories
const AlgorithmMetadata = {
  // Classic Algorithms
  pi: {
    name: 'Pi Digits',
    type: 'Deterministic',
    distribution: 'Uniform (Expected)',
    description: 'Uses the digits of Pi converted to any base. While deterministic, Pi digits are expected to be uniformly distributed.',
    basicInfo: 'Pi (π) is a mathematical constant representing the ratio of a circle\'s circumference to its diameter. Its representation is infinite and non-repeating in any base, with digits that appear statistically random despite being completely deterministic.',
    technicalInfo: 'Uses precomputed decimal digits of Pi, converted on-the-fly to the target base. The digits pass many statistical randomness tests (chi-square, runs test, serial correlation) but are not cryptographically secure. Period: infinite (non-repeating).',
    useCases: 'Educational demonstrations, testing statistical analysis software, benchmarking digit extraction algorithms, mathematical research on normal numbers across different bases.',
    languageUsage: 'Not used as a default PRNG in any major programming language (impractical). Used in educational contexts and demonstrations.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    category: 'classic'
  },
  middleSquare: {
    name: 'Middle-Square Method',
    type: 'Pseudo-random',
    distribution: 'Uniform (with cycles)',
    description: 'Von Neumann\'s classic method from 1946. May enter short cycles, requiring reseeding.',
    basicInfo: 'One of the first PRNGs, invented by John von Neumann. Squares a number and extracts the middle digits as the next random number. Simple to understand but has serious flaws including short cycles.',
    technicalInfo: 'Algorithm: seed² → extract middle digits → new seed. Cycle detection implemented to reseed when stuck. Not suitable for serious applications due to poor statistical properties and short periods.',
    useCases: 'Computer science education, demonstrating PRNG concepts, historical interest. Not recommended for production use.',
    languageUsage: 'Historical: ENIAC (1946), early computers (1950s). Not used in modern programming languages. Educational purposes only.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    category: 'classic'
  },
  lcg: {
    name: 'Linear Congruential Generator',
    type: 'Pseudo-random',
    distribution: 'Uniform',
    description: 'Classic PRNG using linear recurrence. Fast but has known statistical weaknesses.',
    basicInfo: 'One of the oldest and most well-known PRNG algorithms. Uses a simple linear equation to generate the next number from the previous one. Fast and memory-efficient but has correlation issues.',
    technicalInfo: 'Formula: X(n+1) = (a × X(n) + c) mod m. Parameters: a=1103515245, c=12345, m=2³¹. Fails spectral test in higher dimensions. Not cryptographically secure.',
    useCases: 'Quick simulations, games, non-critical random number generation, embedded systems with limited resources. Replaced by better PRNGs in modern applications.',
    languageUsage: 'Java (java.util.Random until Java 8), C (rand()), C++ (rand() before C++11), Visual Basic 6. Still common in older codebases.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    category: 'classic'
  },
  randu: {
    name: 'RANDU ⚠️',
    type: 'Pseudo-random (FLAWED)',
    distribution: 'Uniform (with patterns)',
    description: 'IBM\'s infamous 1960s PRNG. Educational example of what NOT to do - shows clear patterns in 3D plots.',
    basicInfo: 'RANDU is a cautionary tale in computer science. Used by IBM in the 1960s-70s, it was later discovered to have severe flaws. When plotted in 3D, consecutive triplets fall on just 15 planes instead of filling space randomly.',
    technicalInfo: 'Formula: X(n+1) = 65539 × X(n) mod 2³¹. The multiplier 65539 = 2¹⁶ + 3 causes severe correlation. Fails spectral test catastrophically. Never use in production!',
    useCases: 'Computer science education (as a negative example), demonstrating the importance of proper PRNG testing, historical research on computational errors.',
    languageUsage: 'IBM System/360 (1960s-1970s). Widely used in the 1960s-70s. No modern use - considered one of the worst PRNGs ever designed.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    category: 'classic',
    warning: true
  },
  
  // Modern PRNGs
  pcg: {
    name: 'PCG (Permuted Congruential)',
    type: 'Pseudo-random',
    distribution: 'Uniform',
    description: 'Modern PRNG from 2014. Uses permutation functions on LCG output for excellent statistical properties.',
    basicInfo: 'PCG (Permuted Congruential Generator) was developed by Melissa O\'Neill in 2014 to address weaknesses in traditional LCGs. It applies permutation functions to LCG output, dramatically improving statistical quality while maintaining speed.',
    technicalInfo: 'Combines LCG with XOR-shift and rotation permutations. Passes TestU01 BigCrush suite. Small state size (64-128 bits). Much faster than Mersenne Twister with better statistical properties.',
    useCases: 'Modern game development, scientific simulations, general-purpose random number generation, replacing older PRNGs in new codebases.',
    languageUsage: 'NumPy (Python, default since 1.17 as PCG64), Rust (rand crate), available in Julia and C++ libraries. Increasingly popular replacement for MT19937.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    category: 'modern'
  },
  xoshiro: {
    name: 'Xoshiro256++',
    type: 'Pseudo-random',
    distribution: 'Uniform',
    description: 'State-of-the-art PRNG from 2018. Extremely fast with excellent quality. Uses XOR/shift/rotate operations.',
    basicInfo: 'Xoshiro256++ (XOR/Shift/Rotate) is currently considered the gold standard for general-purpose PRNGs. Created by David Blackman and Sebastiano Vigna in 2018, it\'s the successor to the Xorshift family.',
    technicalInfo: 'Uses 256-bit state with XOR, shift, and rotate operations. Period: 2²⁵⁶-1. Passes all known statistical tests including PractRand and TestU01. Extremely fast on modern CPUs.',
    useCases: 'Default PRNG for new projects, high-performance simulations, game engines, scientific computing, any application requiring fast, high-quality random numbers.',
    languageUsage: 'Julia (default since 1.7), available in Rust (rand crate), C++ libraries, Python (randomgen). Recommended for new projects.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    category: 'modern'
  },
  mersenne: {
    name: 'Mersenne Twister',
    type: 'Pseudo-random',
    distribution: 'Uniform',
    description: 'High-quality PRNG with very long period (2^19937-1). Widely used in scientific computing.',
    basicInfo: 'Developed in 1997 by Makoto Matsumoto and Takuji Nishimura, Mersenne Twister became the most widely used PRNG for two decades. Named after Mersenne prime numbers, it has an extraordinarily long period.',
    technicalInfo: 'Period: 2¹⁹⁹³⁷-1 (a Mersenne prime). State size: 2.5KB. Passes most statistical tests but fails some linearity tests. Not cryptographically secure. Slower than modern alternatives like Xoshiro.',
    useCases: 'Scientific computing, Monte Carlo simulations, statistical software (R, Python NumPy default until recently), legacy code requiring compatibility.',
    languageUsage: 'Python (default until NumPy 1.17), Ruby, PHP, R, MATLAB, Excel, C++ (std::mt19937 since C++11), Julia (until 1.7), Mathematica. Most widely used PRNG for 20+ years.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    category: 'modern'
  },
  xorshift: {
    name: 'Xorshift',
    type: 'Pseudo-random',
    distribution: 'Uniform',
    description: 'Fast PRNG using bitwise XOR operations. Good statistical properties with minimal state.',
    basicInfo: 'Invented by George Marsaglia in 2003, Xorshift uses only XOR and bit-shift operations, making it extremely simple and fast. It\'s the predecessor to the Xoshiro family.',
    technicalInfo: 'Uses XOR with left and right shifts. Minimal state (32-128 bits). Very fast but has some statistical weaknesses. Fails linearity tests. Superseded by Xoshiro but still useful for simple applications.',
    useCases: 'Embedded systems, games requiring fast random numbers, situations where simplicity is valued, educational purposes to understand XOR-based PRNGs.',
    languageUsage: 'JavaScript (V8 engine used Xorshift128+ in older versions), D language (std.random.Xorshift), available in Julia and Node.js libraries.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    category: 'modern'
  },
  
  // Mathematical/Chaotic
  gaussian: {
    name: 'Gaussian Distribution',
    type: 'Pseudo-random',
    distribution: 'Normal (Bell Curve)',
    description: 'Generates digits using Box-Muller transform. Creates a bell curve centered at the middle digit.',
    basicInfo: 'The Gaussian (normal) distribution is the famous "bell curve" that appears throughout nature and statistics. This implementation uses the Box-Muller transform to convert uniform random numbers into normally distributed ones.',
    technicalInfo: 'Box-Muller transform: converts two uniform random variables into two independent Gaussian variables using trigonometric functions. Mean and standard deviation adapted for each base to keep values in range.',
    useCases: 'Statistical simulations, modeling natural phenomena (heights, test scores, measurement errors), machine learning (weight initialization), financial modeling.',
    languageUsage: 'Available in all major languages: Python (random.gauss(), numpy.random.normal()), Java (Random.nextGaussian()), C++ (std::normal_distribution). Box-Muller transform is standard.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    category: 'mathematical'
  },
  logistic: {
    name: 'Logistic Map',
    type: 'Chaotic',
    distribution: 'Non-uniform (Chaotic)',
    description: 'Generates digits from chaotic dynamics. Deterministic but highly sensitive to initial conditions.',
    basicInfo: 'The logistic map is a simple mathematical equation that exhibits chaotic behavior. Despite being completely deterministic (x(n+1) = r × x(n) × (1 - x(n))), tiny changes in initial conditions lead to completely different sequences.',
    technicalInfo: 'Parameter r = 3.99 places the system in chaotic regime. Demonstrates sensitive dependence on initial conditions ("butterfly effect"). Not suitable for cryptography due to predictability from state.',
    useCases: 'Chaos theory education, demonstrating deterministic chaos, population dynamics modeling, exploring nonlinear dynamics, artistic applications.',
    languageUsage: 'Not used as a default PRNG in any language. Available in research/educational contexts. Used in chaos theory courses and demonstrations.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    category: 'mathematical'
  },
  perlin: {
    name: 'Perlin Noise',
    type: 'Pseudo-random',
    distribution: 'Smooth Random',
    description: 'Uses Perlin noise for natural-looking randomness with smooth transitions between values.',
    basicInfo: 'Invented by Ken Perlin in 1983 for the movie Tron, Perlin noise creates smooth, natural-looking randomness. Unlike white noise, it has coherent structure with smooth gradients between values.',
    technicalInfo: 'Uses gradient noise with interpolation (fade function: 6t⁵ - 15t⁴ + 10t³). Creates continuous, differentiable noise. Often used in multiple octaves for fractal-like detail.',
    useCases: 'Procedural terrain generation, texture synthesis, cloud rendering, organic-looking animations, game development (Minecraft terrain), visual effects.',
    languageUsage: 'Unity (Mathf.PerlinNoise()), Unreal Engine (plugins), Godot (built-in), Processing, Three.js. Standard in game engines but not general-purpose PRNGs.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    category: 'mathematical'
  },
  
  // Quasi-Random
  sobol: {
    name: 'Sobol Sequence',
    type: 'Quasi-random',
    distribution: 'Low-discrepancy',
    description: 'Not truly random - fills space evenly. Used in Monte Carlo simulations for better coverage than random.',
    basicInfo: 'Sobol sequences are quasi-random (low-discrepancy) sequences that fill space more uniformly than random numbers. Developed by Ilya Sobol in 1967, they avoid clustering and gaps that occur with true randomness.',
    technicalInfo: 'Based on binary van der Corput sequence with direction numbers. Achieves O((log N)^d / N) discrepancy. Deterministic but appears random. Better convergence than pseudo-random for integration.',
    useCases: 'Monte Carlo integration, quasi-Monte Carlo methods, financial modeling (option pricing), computer graphics (ray tracing), numerical optimization, sensitivity analysis.',
    languageUsage: 'MATLAB (sobolset), SciPy (Python: scipy.stats.qmc.Sobol), specialized numerical libraries. Not a general PRNG - used for specific integration tasks.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    category: 'quasi'
  },
  
  // Cryptographic/True Random
  quantum: {
    name: 'Quantum Random (API)',
    type: 'True Random',
    distribution: 'Uniform',
    description: 'Fetches true random numbers from quantum measurements. Falls back to LCG if API unavailable.',
    basicInfo: 'True random numbers generated from quantum phenomena (vacuum fluctuations) measured by the Australian National University. Unlike pseudo-random algorithms, quantum randomness is fundamentally unpredictable.',
    technicalInfo: 'Uses ANU QRNG API which measures quantum vacuum state. Truly random (not deterministic). Requires internet connection. Slower than PRNGs due to API latency. Suitable for cryptography.',
    useCases: 'Cryptographic key generation, lottery systems, scientific experiments requiring true randomness, security applications, gambling, unbiased sampling.',
    languageUsage: 'Not built into programming languages. Available through APIs (ANU QRNG API) and specialized hardware. Linux /dev/random uses hardware sources when available.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    category: 'crypto'
  },
  rule30: {
    name: 'Cellular Automaton Rule 30',
    type: 'Chaotic',
    distribution: 'Complex',
    description: 'Generates digits from Rule 30 cellular automaton evolution. Shows complex, random-like patterns.',
    basicInfo: 'Rule 30 is a one-dimensional cellular automaton discovered by Stephen Wolfram. Despite having extremely simple rules, it produces complex, seemingly random patterns. Wolfram proposed using it as a random number generator.',
    technicalInfo: 'Binary rule: 00011110 (30 in decimal). Updates each cell based on itself and two neighbors. Center column used for random bits. Passes many statistical tests but has some subtle patterns.',
    useCases: 'Random number generation in Mathematica, studying emergence of complexity from simple rules, demonstrating computational irreducibility, art and pattern generation.',
    languageUsage: 'Mathematica (used by Stephen Wolfram in early versions), research contexts. Not widely adopted in mainstream programming languages.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    category: 'crypto'
  }
};

// Category display names
const CategoryNames = {
  classic: 'Classic Algorithms',
  modern: 'Modern PRNGs',
  mathematical: 'Mathematical/Chaotic',
  quasi: 'Quasi-Random',
  crypto: 'Cryptographic/True Random'
};

// Helper function to get current algorithm name
function getAlgorithmName() {
  const calcType = document.getElementById('calcType').value;
  return AlgorithmMetadata[calcType]?.name || 'Unknown';
}

// Base configuration
function initializeBase(base) {
  currentBase = base;
  digitLabels = generateLabels(base);
  digitColors = generateColors(base);
  counts = new Array(base).fill(0);
  
  // Update base info display
  const baseInfo = document.getElementById('baseInfo');
  if (baseInfo) {
    baseInfo.textContent = `Base ${base} (${BaseNames[base]})`;
  }
  
  // Update algorithm dropdown compatibility
  updateAlgorithmCompatibility();
  
  // Recreate charts
  createChart();
  createTimeSeriesChart();
  
  // Reset time series data and spiral
  timeSeriesData = [];
  if (spiralCtx) {
    clearSpiral();
  }
  
  // Update guess placeholder
  const guessInput = document.getElementById('guess');
  if (base <= 10) {
    guessInput.placeholder = `Enter digit (0-${base-1})`;
  } else {
    const lastDigit = String.fromCharCode(65 + base - 11); // A=10, B=11, ..., F=15
    guessInput.placeholder = `Enter digit (0-9, A-${lastDigit})`;
  }
}

function generateLabels(base) {
  const labels = [];
  for (let i = 0; i < base; i++) {
    if (i < 10) {
      labels.push(i.toString());
    } else {
      // Use A, B, C, D, E, F for bases 11-16
      labels.push(String.fromCharCode(65 + i - 10));
    }
  }
  return labels;
}

function generateColors(base) {
  const colors = [];
  for (let i = 0; i < base; i++) {
    const hue = (240 - (i / (base - 1)) * 60); // Blue (240) to darker blue (180)
    colors.push(`hsl(${hue}, 70%, ${60 - i * 2}%)`);
  }
  return colors;
}

function updateAlgorithmCompatibility() {
  const calcTypeSelect = document.getElementById('calcType');
  const currentValue = calcTypeSelect.value;
  let firstCompatible = null;
  
  // Clear and rebuild options
  calcTypeSelect.innerHTML = '';
  
  // Group algorithms by category
  const categories = ['classic', 'modern', 'mathematical', 'quasi', 'crypto'];
  
  categories.forEach(category => {
    const algorithmsInCategory = Object.entries(AlgorithmMetadata)
      .filter(([_, meta]) => meta.category === category);
    
    if (algorithmsInCategory.length > 0) {
      // Add category header
      const optgroup = document.createElement('optgroup');
      optgroup.label = CategoryNames[category];
      
      algorithmsInCategory.forEach(([key, meta]) => {
        const option = document.createElement('option');
        option.value = key;
        
        const isCompatible = meta.compatibleBases.includes(currentBase);
        
        if (isCompatible) {
          option.textContent = meta.name;
          option.disabled = false;
          if (firstCompatible === null) {
            firstCompatible = key;
          }
        } else {
          option.textContent = `${meta.name} (Not available for base ${currentBase})`;
          option.disabled = true;
        }
        
        optgroup.appendChild(option);
      });
      
      calcTypeSelect.appendChild(optgroup);
    }
  });
  
  // Select appropriate algorithm
  const currentMeta = AlgorithmMetadata[currentValue];
  if (currentMeta && currentMeta.compatibleBases.includes(currentBase)) {
    calcTypeSelect.value = currentValue;
  } else if (firstCompatible) {
    calcTypeSelect.value = firstCompatible;
  }
  
  // Update algorithm info
  updateAlgorithmInfo();
}

function updateAlgorithmInfo() {
  const calcType = document.getElementById('calcType').value;
  const meta = AlgorithmMetadata[calcType];
  
  if (!meta) return;
  
  document.getElementById('algorithmName').textContent = `Algorithm: ${meta.name}`;
  document.getElementById('algorithmType').textContent = meta.type;
  document.getElementById('algorithmDistribution').textContent = meta.distribution;
  document.getElementById('algorithmDescription').textContent = meta.description;
  
  // Update detailed information sections
  document.getElementById('algorithmBasicInfo').textContent = meta.basicInfo || 'No additional information available.';
  document.getElementById('algorithmTechnicalInfo').textContent = meta.technicalInfo || 'No technical details available.';
  document.getElementById('algorithmUseCases').textContent = meta.useCases || 'General purpose random number generation.';
  document.getElementById('algorithmLanguageUsage').textContent = meta.languageUsage || 'Not commonly used in mainstream programming languages.';
  
  // Add warning styling if needed
  const infoPanel = document.querySelector('.algorithm-info');
  if (meta.warning) {
    infoPanel.style.background = 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)';
  } else {
    infoPanel.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  }
}

// Create chart
function createChart() {
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
    datasets.push({
      label: digitLabels[digit],
      data: [],
      borderColor: digitColors[digit],
      backgroundColor: digitColors[digit].replace('60%', '20%'),
      borderWidth: 2,
      fill: false,
      tension: 0.1,
      pointRadius: 0,
      pointHoverRadius: 4
    });
  }
  
  timeSeriesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { 
          display: true,
          position: 'right',
          labels: {
            boxWidth: 15,
            font: { size: 10 }
          }
        },
        title: {
          display: true,
          text: `Count Evolution Over Time - ${getAlgorithmName()} (Base ${currentBase})`,
          font: { size: 16, weight: 'bold' }
        },
        datalabels: {
          display: false // No labels on time series
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Count' }
        },
        x: {
          title: { display: true, text: 'Digits Processed' }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      }
    }
  });
}

// Update time series chart with new data
function updateTimeSeriesChart() {
  if (!timeSeriesChart) return;
  
  // Add current step to time series data
  timeSeriesData.push({
    step: currentDigitIndex,
    counts: [...counts]
  });
  
  // Update chart data
  timeSeriesChart.data.labels = timeSeriesData.map(d => d.step);
  
  for (let digit = 0; digit < currentBase; digit++) {
    timeSeriesChart.data.datasets[digit].data = timeSeriesData.map(d => d.counts[digit]);
  }
  
  timeSeriesChart.update('none'); // 'none' mode for better performance
}

// Radial Polygon Visualization Functions
function initSpiralCanvas() {
  spiralCanvas = document.getElementById('spiralCanvas');
  if (!spiralCanvas) return;
  spiralCtx = spiralCanvas.getContext('2d');
  currentRotation = 0;
  targetRotation = 0;
  drawRadialPolygon();
}

function drawRadialPolygon() {
  if (!spiralCtx) return;
  
  // Clear canvas
  spiralCtx.fillStyle = '#f8f9fa';
  spiralCtx.fillRect(0, 0, spiralCanvas.width, spiralCanvas.height);
  
  // Draw title
  spiralCtx.fillStyle = '#333';
  spiralCtx.font = 'bold 18px Arial';
  spiralCtx.textAlign = 'center';
  spiralCtx.fillText(`Radial Distribution - ${getAlgorithmName()} (Base ${currentBase})`, spiralCanvas.width / 2, 30);
  
  const centerX = spiralCanvas.width / 2;
  const centerY = spiralCanvas.height / 2 + 20; // Offset for title
  const maxRadius = Math.min(spiralCanvas.width, spiralCanvas.height) / 2 - 80;
  
  // Calculate total and max for scaling
  const total = counts.reduce((sum, c) => sum + c, 0);
  if (total === 0) {
    // Draw empty polygon with equal slices
    drawEmptyPolygon(centerX, centerY, maxRadius * 0.3);
    return;
  }
  
  const maxCount = Math.max(...counts);
  
  // Calculate which digit is winning and target rotation
  const winnerIndex = counts.indexOf(maxCount);
  updateTargetRotation(winnerIndex);
  
  // Smooth rotation easing
  if (Math.abs(targetRotation - currentRotation) > 0.01) {
    currentRotation += (targetRotation - currentRotation) * rotationSpeed;
  } else {
    currentRotation = targetRotation;
  }
  
  // Draw each slice
  const anglePerSlice = (Math.PI * 2) / currentBase;
  
  for (let i = 0; i < currentBase; i++) {
    const count = counts[i];
    const radius = maxRadius * (count / maxCount) * 0.8 + maxRadius * 0.2; // Min 20% of max radius
    
    // Calculate angle for this slice (starting at top, going clockwise)
    const startAngle = -Math.PI / 2 + (i * anglePerSlice) + currentRotation;
    const endAngle = startAngle + anglePerSlice;
    
    // Draw slice
    spiralCtx.fillStyle = digitColors[i];
    spiralCtx.beginPath();
    spiralCtx.moveTo(centerX, centerY);
    spiralCtx.arc(centerX, centerY, radius, startAngle, endAngle);
    spiralCtx.closePath();
    spiralCtx.fill();
    
    // Draw slice border
    spiralCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    spiralCtx.lineWidth = 2;
    spiralCtx.stroke();
    
    // Draw tally number on the slice
    const midAngle = (startAngle + endAngle) / 2;
    const textRadius = radius * 0.7;
    const textX = centerX + textRadius * Math.cos(midAngle);
    const textY = centerY + textRadius * Math.sin(midAngle);
    
    spiralCtx.save();
    spiralCtx.translate(textX, textY);
    spiralCtx.fillStyle = '#fff';
    spiralCtx.strokeStyle = '#333';
    spiralCtx.lineWidth = 3;
    spiralCtx.font = 'bold 16px Arial';
    spiralCtx.textAlign = 'center';
    spiralCtx.textBaseline = 'middle';
    
    // Draw digit label and count
    const label = digitLabels[i];
    const text = `${label}: ${count}`;
    spiralCtx.strokeText(text, 0, 0);
    spiralCtx.fillText(text, 0, 0);
    spiralCtx.restore();
  }
  
  // Draw center circle
  spiralCtx.fillStyle = '#fff';
  spiralCtx.beginPath();
  spiralCtx.arc(centerX, centerY, 30, 0, Math.PI * 2);
  spiralCtx.fill();
  spiralCtx.strokeStyle = '#667eea';
  spiralCtx.lineWidth = 3;
  spiralCtx.stroke();
  
  // Draw total in center
  spiralCtx.fillStyle = '#333';
  spiralCtx.font = 'bold 14px Arial';
  spiralCtx.textAlign = 'center';
  spiralCtx.textBaseline = 'middle';
  spiralCtx.fillText(total, centerX, centerY);
}

function drawEmptyPolygon(centerX, centerY, radius) {
  const anglePerSlice = (Math.PI * 2) / currentBase;
  
  for (let i = 0; i < currentBase; i++) {
    const startAngle = -Math.PI / 2 + (i * anglePerSlice);
    const endAngle = startAngle + anglePerSlice;
    
    spiralCtx.fillStyle = digitColors[i];
    spiralCtx.globalAlpha = 0.3;
    spiralCtx.beginPath();
    spiralCtx.moveTo(centerX, centerY);
    spiralCtx.arc(centerX, centerY, radius, startAngle, endAngle);
    spiralCtx.closePath();
    spiralCtx.fill();
    
    spiralCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    spiralCtx.lineWidth = 2;
    spiralCtx.stroke();
    spiralCtx.globalAlpha = 1.0;
  }
}

function updateTargetRotation(winnerIndex) {
  // Calculate the angle where the winner should be (top = -PI/2)
  const anglePerSlice = (Math.PI * 2) / currentBase;
  const winnerAngle = winnerIndex * anglePerSlice;
  
  // Target rotation to bring winner to top
  let newTarget = -winnerAngle;
  
  // Normalize to shortest rotation path
  while (newTarget - currentRotation > Math.PI) newTarget -= Math.PI * 2;
  while (newTarget - currentRotation < -Math.PI) newTarget += Math.PI * 2;
  
  targetRotation = newTarget;
}

function updateSpiral() {
  drawRadialPolygon();
}

function clearSpiral() {
  currentRotation = 0;
  targetRotation = 0;
  if (spiralCtx) {
    drawRadialPolygon();
  }
}

// View toggle functions
function showTimeSeriesView() {
  document.getElementById('timeSeriesContainer').style.display = 'block';
  document.getElementById('spiralContainer').style.display = 'none';
  document.getElementById('timeSeriesBtn').classList.add('active');
  document.getElementById('spiralBtn').classList.remove('active');
}

function showSpiralView() {
  document.getElementById('timeSeriesContainer').style.display = 'none';
  document.getElementById('spiralContainer').style.display = 'block';
  document.getElementById('timeSeriesBtn').classList.remove('active');
  document.getElementById('spiralBtn').classList.add('active');
  drawRadialPolygon(); // Redraw in case it needs updating
}

// Statistics calculation
function calculateStatistics() {
  const total = counts.reduce((sum, c) => sum + c, 0);
  if (total === 0) return { mean: 0, stdDev: 0, chiSquare: 0 };
  
  // Mean
  const mean = counts.reduce((sum, count, digit) => sum + digit * count, 0) / total;
  
  // Standard deviation
  const variance = counts.reduce((sum, count, digit) => {
    return sum + count * Math.pow(digit - mean, 2);
  }, 0) / total;
  const stdDev = Math.sqrt(variance);
  
  // Chi-square test
  const expected = total / currentBase;
  const chiSquare = counts.reduce((sum, count) => {
    return sum + Math.pow(count - expected, 2) / expected;
  }, 0);
  
  return { mean, stdDev, chiSquare };
}

function updateStatistics() {
  const stats = calculateStatistics();
  document.getElementById('statMean').textContent = stats.mean.toFixed(2);
  document.getElementById('statStdDev').textContent = stats.stdDev.toFixed(2);
  document.getElementById('statChiSquare').textContent = stats.chiSquare.toFixed(2);
}

// ============= ALGORITHM IMPLEMENTATIONS =============

// PCG (Permuted Congruential Generator)
function* pcgGenerator(base) {
  let state = (Date.now() % 0xFFFFFFFF) >>> 0;
  if (state === 0) state = 12345;
  const multiplier = 747796405;
  const increment = 2891336453;
  
  while (true) {
    // LCG step
    state = (multiplier * state + increment) >>> 0;
    
    // PCG permutation: XOR-shift-rotate
    // Use full 32-bit state for better mixing
    let word = state;
    word = ((word >>> 18) ^ word) >>> 0;
    word = (word * 277803737) >>> 0;  // Multiply by constant
    word = ((word >>> 22) ^ word) >>> 0;
    
    // Map to base using the full range
    const digit = Math.floor((word / 4294967296) * base);
    yield digit;
  }
}

// Xoshiro256++
function* xoshiroGenerator(base) {
  // Initialize state with seed
  const seed = Date.now();
  let s0 = seed >>> 0;
  let s1 = (seed * 1103515245 + 12345) >>> 0;
  let s2 = (s1 * 1103515245 + 12345) >>> 0;
  let s3 = (s2 * 1103515245 + 12345) >>> 0;
  
  const rotl = (x, k) => ((x << k) | (x >>> (32 - k))) >>> 0;
  
  while (true) {
    const result = (rotl((s0 + s3) >>> 0, 7) + s0) >>> 0;
    const t = (s1 << 9) >>> 0;
    
    s2 ^= s0;
    s3 ^= s1;
    s1 ^= s2;
    s0 ^= s3;
    s2 ^= t;
    s3 = rotl(s3, 11);
    
    const digit = result % base;
    yield digit;
  }
}

// RANDU (intentionally flawed)
function* randuGenerator(base) {
  let seed = Date.now() % 2147483647;
  if (seed === 0) seed = 1;
  
  while (true) {
    seed = (65539 * seed) % 2147483648;
    const value = seed / 2147483648;
    const digit = Math.floor(value * base) % base;
    yield digit;
  }
}

// Sobol Sequence (simplified 1D version)
function* sobolGenerator(base) {
  let index = 1;
  const directionNumbers = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
  
  while (true) {
    let value = 0;
    let i = index;
    let j = 0;
    
    while (i > 0) {
      if (i & 1) {
        value ^= directionNumbers[j];
      }
      i >>= 1;
      j++;
    }
    
    // Normalize to [0, 1)
    const normalized = value / 4096;
    const digit = Math.floor(normalized * base) % base;
    
    index++;
    yield digit;
  }
}

// Pi Digits - works in all bases by converting decimal Pi to target base
function* piGenerator(base) {
  // Pi with 100 decimal digits
  const piDigits = "31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679";
  
  if (base === 10) {
    // Fast path for base 10
    let index = 0;
    while (true) {
      yield parseInt(piDigits[index % piDigits.length]);
      index++;
    }
  } else {
    // Convert Pi digits to target base
    // We'll process Pi as a large number and extract digits in the target base
    let digitBuffer = [];
    let bufferIndex = 0;
    
    // Process chunks of decimal digits and convert to target base
    for (let chunkStart = 0; chunkStart < piDigits.length; chunkStart += 15) {
      const chunk = piDigits.substring(chunkStart, Math.min(chunkStart + 15, piDigits.length));
      let value = parseInt(chunk);
      
      // Convert this chunk to target base
      const chunkDigits = [];
      while (value > 0) {
        chunkDigits.unshift(value % base);
        value = Math.floor(value / base);
      }
      digitBuffer.push(...chunkDigits);
    }
    
    // Yield digits from buffer, looping when exhausted
    while (true) {
      yield digitBuffer[bufferIndex % digitBuffer.length];
      bufferIndex++;
    }
  }
}

// Gaussian Distribution
function* gaussianGenerator(base) {
  const mean = (base - 1) / 2;
  const stdDev = base / 6;
  
  while (true) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const value = Math.round(mean + stdDev * z0);
    const digit = Math.max(0, Math.min(base - 1, value));
    yield digit;
  }
}

// Perlin Noise
function* perlinGenerator(base) {
  let x = Math.random() * 1000;
  const fade = t => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + t * (b - a);
  
  while (true) {
    const xi = Math.floor(x) & 255;
    const xf = x - Math.floor(x);
    const u = fade(xf);
    
    const a = (xi * 2654435761) % 256;
    const b = ((xi + 1) * 2654435761) % 256;
    const value = lerp(a / 256, b / 256, u);
    
    const digit = Math.floor(value * base) % base;
    yield digit;
    
    x += 0.1;
  }
}

// LCG
function* lcgGenerator(base) {
  let seed = Date.now() % 2147483647;
  const a = 1103515245;
  const c = 12345;
  const m = 2147483648;
  
  while (true) {
    seed = (a * seed + c) % m;
    const value = seed / m;
    const digit = Math.floor(value * base) % base;
    yield digit;
  }
}

// Mersenne Twister (simplified)
function* mersenneGenerator(base) {
  const MT = new Array(624);
  let index = 0;
  
  function initializeMT(seed) {
    MT[0] = seed >>> 0;
    for (let i = 1; i < 624; i++) {
      MT[i] = (1812433253 * (MT[i-1] ^ (MT[i-1] >>> 30)) + i) >>> 0;
    }
  }
  
  function generateNumbers() {
    for (let i = 0; i < 624; i++) {
      const y = (MT[i] & 0x80000000) + (MT[(i+1) % 624] & 0x7fffffff);
      MT[i] = MT[(i + 397) % 624] ^ (y >>> 1);
      if (y % 2 !== 0) {
        MT[i] ^= 2567483615;
      }
    }
  }
  
  function extractNumber() {
    if (index === 0) {
      generateNumbers();
    }
    
    let y = MT[index];
    y ^= y >>> 11;
    y ^= (y << 7) & 2636928640;
    y ^= (y << 15) & 4022730752;
    y ^= y >>> 18;
    
    index = (index + 1) % 624;
    return y >>> 0;
  }
  
  initializeMT(Date.now());
  
  while (true) {
    const value = extractNumber();
    const digit = value % base;
    yield digit;
  }
}

// Logistic Map
function* logisticGenerator(base) {
  let x = Math.random();
  const r = 3.99;
  
  while (true) {
    x = r * x * (1 - x);
    const digit = Math.floor(x * base) % base;
    yield digit;
  }
}

// Middle-Square Method
function* middleSquareGenerator(base) {
  let seed = Date.now() % 1000000;
  if (seed === 0) seed = 123456;
  const seenValues = new Set();
  
  while (true) {
    // Detect cycles and reseed
    if (seenValues.has(seed) || seed === 0) {
      seed = (Date.now() + Math.floor(Math.random() * 1000000)) % 1000000;
      if (seed === 0) seed = 123456;
      seenValues.clear();
    }
    seenValues.add(seed);
    
    // Square the seed
    const squared = seed * seed;
    
    // Extract middle bits using bitwise operations for better distribution
    // Shift right to get middle portion, then mask to get desired bits
    const shifted = squared >>> 8;  // Remove lower 8 bits
    seed = (shifted & 0xFFFFF) % 1000000;  // Keep 20 bits, mod to keep in range
    
    // Use multiple bits for better distribution in low bases
    const digit = seed % base;
    yield digit;
  }
}

// Xorshift
function* xorshiftGenerator(base) {
  let state = Date.now() >>> 0;
  if (state === 0) state = 1;
  
  while (true) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    
    const digit = state % base;
    yield digit;
  }
}

// Quantum Random (API)
async function* quantumGenerator(base) {
  try {
    const response = await fetch('https://qrng.anu.edu.au/API/jsonI.php?length=100&type=uint8');
    const data = await response.json();
    
    if (data.success) {
      for (const value of data.data) {
        yield value % base;
      }
    } else {
      yield* lcgGenerator(base);
    }
  } catch (error) {
    console.error('Quantum API failed, falling back to LCG');
    yield* lcgGenerator(base);
  }
}

// Rule 30 Cellular Automaton
function* rule30Generator(base) {
  const size = 63;
  let cells = new Array(size).fill(0);
  
  // Random initialization: seed with random pattern
  // This ensures different results on each run while maintaining Rule 30's chaotic properties
  const seed = Date.now() + Math.random() * 1000000;
  for (let i = 0; i < size; i++) {
    // Use a simple LCG to generate initial random bits
    const hash = Math.sin(seed + i) * 10000;
    cells[i] = (hash - Math.floor(hash)) > 0.5 ? 1 : 0;
  }
  let bitBuffer = 0;
  let bitCount = 0;
  
  while (true) {
    const newCells = new Array(size).fill(0);
    
    // Apply Rule 30 to each cell with wrap-around (toroidal) boundaries
    for (let i = 0; i < size; i++) {
      const left = cells[(i - 1 + size) % size];  // Wrap left
      const center = cells[i];
      const right = cells[(i + 1) % size];  // Wrap right
      const pattern = (left << 2) | (center << 1) | right;
      newCells[i] = (30 >> pattern) & 1;
    }
    
    cells = newCells;
    
    // Extract center cell bit
    const bit = cells[Math.floor(size/2)];
    bitBuffer = (bitBuffer << 1) | bit;
    bitCount++;
    
    // When we have enough bits for the base, yield a digit
    const bitsNeeded = Math.ceil(Math.log2(base));
    if (bitCount >= bitsNeeded) {
      const maxValue = (1 << bitsNeeded) - 1;
      const digit = bitBuffer & maxValue;
      
      // Rejection sampling: only yield if digit < base
      if (digit < base) {
        yield digit;
      }
      
      bitBuffer = 0;
      bitCount = 0;
    }
  }
}

// ============= MAIN CALCULATION LOGIC =============

function getGenerator(calcType, base) {
  switch(calcType) {
    case 'pcg': return pcgGenerator(base);
    case 'xoshiro': return xoshiroGenerator(base);
    case 'randu': return randuGenerator(base);
    case 'sobol': return sobolGenerator(base);
    case 'pi': return piGenerator(base);
    case 'gaussian': return gaussianGenerator(base);
    case 'perlin': return perlinGenerator(base);
    case 'lcg': return lcgGenerator(base);
    case 'mersenne': return mersenneGenerator(base);
    case 'logistic': return logisticGenerator(base);
    case 'middleSquare': return middleSquareGenerator(base);
    case 'xorshift': return xorshiftGenerator(base);
    case 'quantum': return quantumGenerator(base);
    case 'rule30': return rule30Generator(base);
    default: return lcgGenerator(base);
  }
}

async function calculate() {
  if (isCalculating) return;
  
  isCalculating = true;
  isPaused = false;
  document.getElementById('pauseBtn').textContent = 'Pause';
  
  const digits = parseInt(document.getElementById('digits').value);
  const calcType = document.getElementById('calcType').value;
  const updateFreq = parseInt(document.getElementById('updateFrequency').value.split(' ')[1]);
  
  counts = new Array(currentBase).fill(0);
  currentDigitIndex = 0;
  timeSeriesData = [];
  if (spiralCtx) {
    clearSpiral();
  }
  
  document.getElementById('digitSequence').value = '';
  document.getElementById('liveDigit').textContent = 'Not started';
  document.getElementById('processedCount').textContent = '0';
  document.getElementById('summaryReport').innerHTML = '';
  
  digitGenerator = getGenerator(calcType, currentBase);
  
  const processDigits = async () => {
    while (currentDigitIndex < digits && isCalculating) {
      if (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
        continue;
      }
      
      const result = await digitGenerator.next();
      if (result.done) break;
      
      const digit = result.value;
      counts[digit]++;
      currentDigitIndex++;
      
      // Update spiral visualization
      updateSpiral();
      
      const digitStr = digitLabels[digit];
      document.getElementById('digitSequence').value += digitStr;
      document.getElementById('liveDigit').textContent = digitStr;
      document.getElementById('processedCount').textContent = currentDigitIndex;
      
      if (currentDigitIndex % updateFreq === 0 || currentDigitIndex === digits) {
        updateChart();
        updateStatistics();
        await new Promise(resolve => setTimeout(resolve, generationSpeed));
      }
    }
    
    if (currentDigitIndex >= digits) {
      finishCalculation();
    }
  };
  
  await processDigits();
}

function updateChart() {
  myChart.data.datasets[0].data = [...counts];
  
  const maxCount = Math.max(...counts);
  const winnerIndices = counts.map((c, i) => c === maxCount ? i : -1).filter(i => i >= 0);
  
  myChart.data.datasets[0].backgroundColor = digitColors.map((color, i) => 
    winnerIndices.includes(i) ? '#8B0000' : color
  );
  
  myChart.update('none');
  
  // Update time series chart
  updateTimeSeriesChart();
}

function finishCalculation() {
  isCalculating = false;
  document.getElementById('liveDigit').textContent = 'Done';
  
  updateChart();
  updateStatistics();
  showSummary();
  
  if (submittedGuess !== null) {
    checkGuess();
  }
}

function showSummary() {
  const summaryDiv = document.getElementById('summaryReport');
  let html = '<h3>Summary Report</h3>';
  
  counts.forEach((count, digit) => {
    const tallies = Math.floor(count / 5);
    const label = digitLabels[digit];
    html += `<p>Digit ${label}: ${tallies} tallies (Count: ${count})</p>`;
  });
  
  summaryDiv.innerHTML = html;
}

function pauseResume() {
  if (!isCalculating) return;
  
  isPaused = !isPaused;
  document.getElementById('pauseBtn').textContent = isPaused ? 'Resume' : 'Pause';
}

async function stepGeneration() {
  const digits = parseInt(document.getElementById('digits').value);
  
  // If not calculating, initialize the generator
  if (!isCalculating) {
    isCalculating = true;
    isPaused = true;
    currentDigitIndex = 0;
    counts = new Array(currentBase).fill(0);
    timeSeriesData = [];
    spiralDigits = [];
    if (spiralCtx) {
      clearSpiral();
    }
    
    document.getElementById('digitSequence').value = '';
    document.getElementById('liveDigit').textContent = 'Stepping...';
    document.getElementById('processedCount').textContent = '0';
    document.getElementById('pauseBtn').textContent = 'Resume';
    
    const calcType = document.getElementById('calcType').value;
    digitGenerator = getDigitGenerator(calcType);
    
    updateChart();
    // Fall through to generate first digit immediately
  }
  
  // Generate one digit
  if (digitGenerator && currentDigitIndex < digits) {
    const result = await digitGenerator.next();
    if (result.done) {
      finishCalculation();
      return;
    }
    
    const digit = result.value;
    counts[digit]++;
    currentDigitIndex++;
    
    // Update spiral visualization
    updateSpiral();
    
    const digitStr = digitLabels[digit];
    document.getElementById('digitSequence').value += digitStr;
    document.getElementById('liveDigit').textContent = digitStr;
    document.getElementById('processedCount').textContent = currentDigitIndex;
    
    updateChart();
    updateStatistics();
    
    if (currentDigitIndex >= digits) {
      finishCalculation();
    }
  }
}

function reset() {
  isCalculating = false;
  isPaused = false;
  currentDigitIndex = 0;
  counts = new Array(currentBase).fill(0);
  submittedGuess = null;
  timeSeriesData = [];
  if (spiralCtx) {
    clearSpiral();
  }
  
  document.getElementById('digitSequence').value = '';
  document.getElementById('liveDigit').textContent = 'Not started';
  document.getElementById('processedCount').textContent = '0';
  document.getElementById('summaryReport').innerHTML = '';
  document.getElementById('guessResult').textContent = '';
  document.getElementById('pauseBtn').textContent = 'Pause';
  
  updateStatistics();
  updateChart();
}

function submitGuess() {
  const guessInput = document.getElementById('guess').value.trim().toUpperCase();
  
  if (guessInput === '') {
    alert('Please enter a digit');
    return;
  }
  
  let guessDigit;
  if (guessInput >= '0' && guessInput <= '9') {
    guessDigit = parseInt(guessInput);
  } else if (guessInput >= 'A' && guessInput <= 'Z') {
    guessDigit = guessInput.charCodeAt(0) - 65 + 10;
  } else {
    alert('Invalid digit');
    return;
  }
  
  if (guessDigit >= currentBase) {
    alert(`Digit must be less than ${currentBase} for base ${currentBase}`);
    return;
  }
  
  submittedGuess = guessDigit;
  document.getElementById('guessResult').textContent = `You guessed: ${digitLabels[guessDigit]}`;
}

function checkGuess() {
  const maxCount = Math.max(...counts);
  const winners = counts.map((c, i) => c === maxCount ? i : -1).filter(i => i >= 0);
  
  if (winners.includes(submittedGuess)) {
    document.getElementById('guessResult').textContent += ' - Correct! 🎉';
  } else {
    const winnerLabels = winners.map(i => digitLabels[i]).join(', ');
    document.getElementById('guessResult').textContent += ` - Wrong. Winner(s): ${winnerLabels}`;
  }
}

function toggleGuessSection() {
  const section = document.getElementById('guessSection');
  section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

function copyDigits() {
  const textarea = document.getElementById('digitSequence');
  textarea.select();
  document.execCommand('copy');
  alert('Digits copied to clipboard!');
}

function applyBase() {
  const baseInput = parseInt(document.getElementById('baseSystem').value);
  
  if (baseInput < 2 || baseInput > 16) {
    alert('Base must be between 2 and 16');
    return;
  }
  
  if (isCalculating) {
    alert('Cannot change base during calculation');
    return;
  }
  
  initializeBase(baseInput);
  reset();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  initializeBase(10);
  updateAlgorithmInfo();
  initSpiralCanvas();
  
  document.getElementById('calcType').addEventListener('change', updateAlgorithmInfo);
  
  // Speed control slider
  const speedControl = document.getElementById('speedControl');
  const speedValue = document.getElementById('speedValue');
  
  speedControl.addEventListener('input', (e) => {
    generationSpeed = parseInt(e.target.value);
    speedValue.textContent = `${generationSpeed}ms`;
  });
});
