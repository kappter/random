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
let leadTime = []; // Track iterations each digit spent in the lead
let leadTimeChart = null; // Lead time bar chart

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
  },
  fileUpload: {
    name: 'File Byte Analysis',
    type: 'Real Data',
    distribution: 'File-Dependent',
    description: 'Analyzes the byte distribution of an uploaded file. Each byte (0x00–0xFF) is treated as a hex value and converted to the selected base.',
    basicInfo: 'Every file is a stream of bytes (0–255), naturally represented as base-16 (hex) values. By analyzing a file\'s byte distribution, you can reveal its "entropy fingerprint" — text files cluster around ASCII values, while encrypted files show near-uniform distribution.',
    technicalInfo: 'Each byte is split into two hex nibbles (high and low), giving 2× the file size in hex digits. These are then converted to the target base using bit-packing with rejection sampling for uniform distribution. Shannon entropy is calculated to classify the file.',
    useCases: 'File entropy analysis, detecting encryption/compression, understanding file formats, comparing randomness of real data vs PRNGs, cybersecurity education, forensics.',
    languageUsage: 'Byte analysis is fundamental in Python (struct, bytes), Java (InputStream), C (fread), and all system programming languages. Shannon entropy is used in compression algorithms (ZIP, GZIP) and cryptography.',
    compatibleBases: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
    category: 'file'
  }
};

// Category display names
const CategoryNames = {
  classic: 'Classic Algorithms',
  modern: 'Modern PRNGs',
  mathematical: 'Mathematical/Chaotic',
  quasi: 'Quasi-Random',
  crypto: 'Cryptographic/True Random',
  file: 'File Analysis'
};

// Helper function to get current algorithm name
function getAlgorithmName() {
  const calcType = document.getElementById('calcType').value;
  if (calcType === 'fileUpload') {
    return uploadedFileName ? `File: ${uploadedFileName}` : 'File Upload';
  }
  return AlgorithmMetadata[calcType]?.name || 'Unknown';
}

// Base configuration
function initializeBase(base) {
  currentBase = base;
  digitLabels = generateLabels(base);
  digitColors = generateColors(base);
  counts = new Array(base).fill(0);
  leadTime = new Array(base).fill(0);
  
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
  createLeadTimeChart();
  
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
  const categories = ['classic', 'modern', 'mathematical', 'quasi', 'crypto', 'file'];
  
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

// Create lead time chart
function createLeadTimeChart() {
  const canvas = document.getElementById('leadTimeChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  if (leadTimeChart) {
    leadTimeChart.destroy();
  }
  
  leadTimeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: digitLabels,
      datasets: [{
        label: 'Iterations in Lead',
        data: leadTime,
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
          text: `Lead Time - ${getAlgorithmName()} (Base ${currentBase})`,
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
          title: { display: true, text: 'Iterations in Lead' }
        },
        x: {
          title: { display: true, text: `Digits (Base ${currentBase})` }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}

// Update lead time chart with new data
function updateLeadTimeChart() {
  if (!leadTimeChart) return;
  
  leadTimeChart.data.datasets[0].data = [...leadTime];
  leadTimeChart.update('none'); // Update without animation for performance
}

// Track lead time for each digit
function updateLeadTime() {
  if (counts.length === 0) return;
  
  // Find the maximum count
  const maxCount = Math.max(...counts);
  
  // Find all digits with the maximum count (handles ties)
  const leaders = [];
  for (let i = 0; i < counts.length; i++) {
    if (counts[i] === maxCount) {
      leaders.push(i);
    }
  }
  
  // Increment lead time for all current leaders
  for (const leader of leaders) {
    leadTime[leader]++;
  }
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
  document.getElementById('leadTimeContainer').style.display = 'none';
  document.getElementById('timeSeriesBtn').classList.add('active');
  document.getElementById('spiralBtn').classList.remove('active');
  document.getElementById('leadTimeBtn').classList.remove('active');
}

function showSpiralView() {
  document.getElementById('timeSeriesContainer').style.display = 'none';
  document.getElementById('spiralContainer').style.display = 'block';
  document.getElementById('leadTimeContainer').style.display = 'none';
  document.getElementById('timeSeriesBtn').classList.remove('active');
  document.getElementById('spiralBtn').classList.add('active');
  document.getElementById('leadTimeBtn').classList.remove('active');
  drawRadialPolygon(); // Redraw in case it needs updating
}

function showLeadTimeView() {
  document.getElementById('timeSeriesContainer').style.display = 'none';
  document.getElementById('spiralContainer').style.display = 'none';
  document.getElementById('leadTimeContainer').style.display = 'block';
  document.getElementById('timeSeriesBtn').classList.remove('active');
  document.getElementById('spiralBtn').classList.remove('active');
  document.getElementById('leadTimeBtn').classList.add('active');
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
  let index = 0;
  const maxValue = 2147483648; // 2^31 for better precision
  const directionNumbers = [
    1073741824, 536870912, 268435456, 134217728,
    67108864, 33554432, 16777216, 8388608,
    4194304, 2097152, 1048576, 524288,
    262144, 131072, 65536, 32768,
    16384, 8192, 4096, 2048,
    1024, 512, 256, 128,
    64, 32, 16, 8,
    4, 2, 1
  ];
  
  while (true) {
    let value = 0;
    let i = index;
    let j = 0;
    
    // Gray code XOR with direction numbers
    while (i > 0 && j < directionNumbers.length) {
      if (i & 1) {
        value ^= directionNumbers[j];
      }
      i >>= 1;
      j++;
    }
    
    // Normalize to [0, 1) and convert to digit
    const normalized = value / maxValue;
    const digit = Math.floor(normalized * base) % base;
    
    index++;
    yield digit;
  }
}

// Pi Digits - works in all bases by converting decimal Pi to target base
function* piGenerator(base) {
  // Pi with 10000 decimal digits (no repetition within max 10000 digit generation)
  const piDigits = "3141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752724891227938183011949129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405132000568127145263560827785771342757789609173637178721468440901224953430146549585371050792279689258923542019956112129021960864034418159813629774771309960518707211349999998372978049951059731732816096318595024459455346908302642522308253344685035261931188171010003137838752886587533208381420617177669147303598253490428755468731159562863882353787593751957781857780532171226806613001927876611195909216420198938095257201065485863278865936153381827968230301952035301852968995773622599413891249721775283479131515574857242454150695950829533116861727855889075098381754637464939319255060400927701671139009848824012858361603563707660104710181942955596198946767837449448255379774726847104047534646208046684259069491293313677028989152104752162056966024058038150193511253382430035587640247496473263914199272604269922796782354781636009341721641219924586315030286182974555706749838505494588586926995690927210797509302955321165344987202755960236480665499119881834797753566369807426542527862551818417574672890977772793800081647060016145249192173217214772350141441973568548161361157352552133475741849468438523323907394143334547762416862518983569485562099219222184272550254256887671790494601653466804988627232791786085784383827967976681454100953883786360950680064225125205117392984896084128488626945604241965285022210661186306744278622039194945047123713786960956364371917287467764657573962413890865832645995813390478027590099465764078951269468398352595709825822620522489407726719478268482601476990902640136394437455305068203496252451749399651431429809190659250937221696461515709858387410597885959772975498930161753928468138268683868942774155991855925245953959431049972524680845987273644695848653836736222626099124608051243884390451244136549762780797715691435997700129616089441694868555848406353422072225828488648158456028506016842739452267467678895252138522549954666727823986456596116354886230577456498035593634568174324112515076069479451096596094025228879710893145669136867228748940560101503308617928680920874760917824938589009714909675985261365549781893129784821682998948722658804857564014270477555132379641451523746234364542858444795265867821051141354735739523113427166102135969536231442952484937187110145765403590279934403742007310578539062198387447808478489683321445713868751943506430218453191048481005370614680674919278191197939952061419663428754440643745123718192179998391015919561814675142691239748940907186494231961567945208095146550225231603881930142093762137855956638937787083039069792077346722182562599661501421503068038447734549202605414665925201497442850732518666002132434088190710486331734649651453905796268561005508106658796998163574736384052571459102897064140110971206280439039759515677157700420337869936007230558763176359421873125147120532928191826186125867321579198414848829164470609575270695722091756711672291098169091528017350671274858322287183520935396572512108357915136988209144421006751033467110314126711136990865851639831501970165151168517143765761835155650884909989859982387345528331635507647918535893226185489632132933089857064204675259070915481416549859461637180270981994309924488957571282890592323326097299712084433573265489382391193259746366730583604142813883032038249037589852437441702913276561809377344403070746921120191302033038019762110110044929321516084244485963766983895228684783123552658213144957685726243344189303968642624341077322697802807318915441101044682325271620105265227211166039666557309254711055785376346682065310989652691862056476931257058635662018558100729360659876486117910453348850346113657686753249441668039626579787718556084552965412665408530614344431858676975145661406800700237877659134401712749470420562230538994561314071127000407854733269939081454664645880797270826683063432858785698305235808933065757406795457163775254202114955761581400250126228594130216471550979259230990796547376125517656751357517829666454779174501129961489030463994713296210734043751895735961458901938971311179042978285647503203198691514028708085990480109412147221317947647772622414254854540332157185306142288137585043063321751829798662237172159160771669254748738986654949450114654062843366393790039769265672146385306736096571209180763832716641627488880078692560290228472104031721186082041900042296617119637792133757511495950156604963186294726547364252308177036751590673502350728354056704038674351362222477158915049530984448933309634087807693259939780541934144737744184263129860809988868741326047215695162396586457302163159819319516735381297416772947867242292465436680098067692823828068996400482435403701416314965897940924323789690706977942236250822168895738379862300159377647165122893578601588161755782973523344604281512627203734314653197777416031990665541876397929334419521541341899485444734567383162499341913181480927777103863877343177207545654532207770921201905166096280490926360197598828161332316663652861932668633606273567630354477628035045077723554710585954870279081435624014517180624643626794561275318134078330336254232783944975382437205835311477119926063813346776879695970309833913077109870408591337464144282277263465947047458784778720192771528073176790770715721344473060570073349243693113835049316312840425121925651798069411352801314701304781643788518529092854520116583934196562134914341595625865865570552690496520985803385072242648293972858478316305777756068887644624824685792603953527734803048029005876075825104747091643961362676044925627420420832085661190625454337213153595845068772460290161876679524061634252257719542916299193064553779914037340432875262888963995879475729174642635745525407909145135711136941091193932519107602082520261879853188770584297259167781314969900901921169717372784768472686084900337702424291651300500516832336435038951702989392233451722013812806965011784408745196012122859937162313017114448464090389064495444006198690754851602632750529834918740786680881833851022833450850486082503930213321971551843063545500766828294930413776552793975175461395398468339363830474611996653858153842056853386218672523340283087112328278921250771262946322956398989893582116745627010218356462201349671518819097303811980049734072396103685406643193950979019069963955245300545058068550195673022921913933918568034490398205955100226353536192041994745538593810234395544959778377902374216172711172364343543947822181852862408514006660443325888569867054315470696574745855033232334210730154594051655379068662733379958511562578432298827372319898757141595781119635833005940873068121602876496286744604774649159950549737425626901049037781986835938146574126804925648798556145372347867330390468838343634655379498641927056387293174872332083760112302991136793862708943879936201629515413371424892830722012690147546684765357616477379467520049075715552781965362132392640616013635815590742202020318727760527721900556148425551879253034351398442532234157623361064250639049750086562710953591946589751413103482276930624743536325691607815478181152843667957061108615331504452127473924544945423682886061340841486377670096120715124914043027253860764823634143346235189757664521641376796903149501910857598442391986291642193994907236234646844117394032659184044378051333894525742399508296591228508555821572503107125701266830240292952522011872676756220415420516184163484756516999811614101002996078386909291603028840026910414079288621507842451670908700069928212066041837180653556725253256753286129104248776182582976515795984703562226293486003415872298053498965022629174878820273420922224533985626476691490556284250391275771028402799806636582548892648802545661017296702664076559042909945681506526530537182941270336931378517860904070866711496558343434769338578171138645587367812301458768712660348913909562009939361031029161615288138437909904231747336394804575931493140529763475748119356709110137751721008031559024853090669203767192203322909433467685142214477379393751703443661991040337511173547191855046449026365512816228824462575916333039107225383742182140883508657391771509682887478265699599574490661758344137522397096834080053559849175417381883999446974867626551658276584835884531427756879002909517028352971634456212964043523117600665101241200659755851276178583829204197484423608007193045761893234922927965019875187212726750798125547095890455635792122103334669749923563025494780249011419521238281530911407907386025152274299581807247162591668545133312394804947079119153267343028244186041426363954800044800267049624820179289647669758318327131425170296923488962766844032326092752496035799646925650493681836090032380929345958897069536534940603402166544375589004563288225054525564056448246515187547119621844396582533754388569094113031509526179378002974120766514793942590298969594699556576121865619673378623625612521632086286922210327488921865436480229678070576561514463204692790682120738837781423356282360896320806822246801224826117718589638140918390367367222088832151375560037279839400415297002878307667094447456013455641725437090697939612257142989467154357846878861444581231459357198492252847160504922124247014121478057345510500801908699603302763478708108175450119307141223390866393833952942578690507643100638351983438934159613185434754649556978103829309716465143840700707360411237359984345225161050702705623526601276484830840761183013052793205427462865403603674532865105706587488225698157936789766974220575059683440869735020141020672358502007245225632651341055924019027421624843914035998953539459094407046912091409387001264560016237428802109276457931065792295524988727584610126483699989225695968815920560010165525637567";
  
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
    case 'fileUpload': return fileUploadGenerator(base);
    default: return lcgGenerator(base);
  }
}

async function calculate() {
  if (isCalculating) return;
  
  // Validate file upload
  const calcType = document.getElementById('calcType').value;
  if (calcType === 'fileUpload' && (!uploadedFileBytes || uploadedFileBytes.length === 0)) {
    alert('Please upload a file first before calculating.');
    return;
  }
  
  isCalculating = true;
  isPaused = false;
  document.getElementById('pauseBtn').textContent = 'Pause';
  
  const digits = parseInt(document.getElementById('digits').value);
  const updateFreq = parseInt(document.getElementById('updateFrequency').value.split(' ')[1]);
  
  counts = new Array(currentBase).fill(0);
  leadTime = new Array(currentBase).fill(0);
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
      
      // Track lead time
      updateLeadTime();
      
      // Update spiral visualization
      updateSpiral();
      
      const digitStr = digitLabels[digit];
      document.getElementById('digitSequence').value += digitStr;
      document.getElementById('liveDigit').textContent = digitStr;
      document.getElementById('processedCount').textContent = currentDigitIndex;
      
      if (currentDigitIndex % updateFreq === 0 || currentDigitIndex === digits) {
        updateChart();
        updateLeadTimeChart();
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
  updateLeadTimeChart();
  updateStatistics();
  showSummary();
  
  if (submittedGuess !== null) {
    checkGuess();
  }
  
  // Show print report button
  document.getElementById('printReportBtn').style.display = 'block';
}

function showSummary() {
  const summaryDiv = document.getElementById('summaryReport');
  let html = '<h3>Summary Report</h3>';
  
  // Create array of digit data for sorting
  const digitData = counts.map((count, digit) => ({
    digit: digit,
    label: digitLabels[digit],
    count: count,
    leadTime: leadTime[digit]
  }));
  
  // Sort by count descending (winner on top)
  digitData.sort((a, b) => b.count - a.count);
  
  // Generate sorted summary
  digitData.forEach(data => {
    html += `<p>Digit ${data.label}: ${data.count} occurrences | ${data.leadTime} iterations in lead</p>`;
  });
  
  summaryDiv.innerHTML = html;
  
  // Generate detailed analysis report
  showDetailedAnalysis();
}

function showDetailedAnalysis() {
  const analysisDiv = document.getElementById('detailedAnalysis');
  if (!analysisDiv) return;
  
  // Create array of digit data
  const digitData = counts.map((count, digit) => ({
    digit: digit,
    label: digitLabels[digit],
    count: count,
    leadTime: leadTime[digit]
  }));
  
  // Find champions
  const countWinner = digitData.reduce((max, d) => d.count > max.count ? d : max);
  const leadTimeWinner = digitData.reduce((max, d) => d.leadTime > max.leadTime ? d : max);
  
  // Calculate statistics
  const totalIterations = digitData.reduce((sum, d) => sum + d.count, 0);
  const totalLeadIterations = digitData.reduce((sum, d) => sum + d.leadTime, 0);
  const leadDominance = ((leadTimeWinner.leadTime / totalIterations) * 100).toFixed(1);
  const countDominance = ((countWinner.count / totalIterations) * 100).toFixed(1);
  
  // Detect anomaly
  const isAnomaly = countWinner.digit !== leadTimeWinner.digit;
  
  // Sort for runner-up analysis
  const sortedByCount = [...digitData].sort((a, b) => b.count - a.count);
  const countRunnerUp = sortedByCount[1];
  const countGap = countWinner.count - countRunnerUp.count;
  const gapPercentage = ((countGap / countWinner.count) * 100).toFixed(1);
  
  // Classify anomaly types
  let anomalyType = '';
  let anomalyDescription = '';
  
  if (isAnomaly) {
    const leadWinnerCountRank = sortedByCount.findIndex(d => d.digit === leadTimeWinner.digit) + 1;
    const countWinnerLeadPct = (countWinner.leadTime / totalIterations) * 100;
    
    if (countWinner.leadTime === 0) {
      anomalyType = '"The Ghost" 👻';
      anomalyDescription = `Digit ${countWinner.label} won final count (${countWinner.count}) but NEVER led at any point during generation!`;
    } else if (countWinnerLeadPct < 20) {
      anomalyType = '"The Late Surge" 🚀';
      anomalyDescription = `Digit ${countWinner.label} won final count (${countWinner.count}) despite leading for only ${countWinner.leadTime} iterations (${countWinnerLeadPct.toFixed(1)}%).`;
    }
    
    if (leadDominance > 50 && leadWinnerCountRank > 1) {
      anomalyType += (anomalyType ? ' vs ' : '') + '"The Marathon Leader" 🏃';
      anomalyDescription += ` Meanwhile, Digit ${leadTimeWinner.label} led for ${leadTimeWinner.leadTime} iterations (${leadDominance}% dominance) but finished in ${leadWinnerCountRank}${getOrdinalSuffix(leadWinnerCountRank)} place with only ${leadTimeWinner.count} occurrences.`;
    }
  } else {
    anomalyType = '"The Consistent Performer" 🏆';
    anomalyDescription = `Digit ${countWinner.label} won both final count (${countWinner.count}) and lead time (${leadTimeWinner.leadTime} iterations, ${leadDominance}% dominance), showing true dominance throughout.`;
  }
  
  // Find "ghosts" - high count but never led
  const ghosts = digitData.filter(d => d.count >= sortedByCount[2].count && d.leadTime === 0);
  
  // Build HTML
  let html = '<h3>📊 Detailed Analysis</h3>';
  
  // Champions section
  html += '<div class="analysis-section">';
  html += '<h4>Champions</h4>';
  html += `<p class="champion-line"><span class="badge badge-gold">🏆 FINAL COUNT</span> Digit ${countWinner.label}: <strong>${countWinner.count} occurrences</strong> (${countDominance}% of total)</p>`;
  html += `<p class="champion-line"><span class="badge badge-purple">👑 LEAD TIME</span> Digit ${leadTimeWinner.label}: <strong>${leadTimeWinner.leadTime} iterations</strong> (${leadDominance}% dominance)</p>`;
  html += '</div>';
  
  // Anomaly detection
  if (isAnomaly) {
    html += '<div class="analysis-section anomaly-alert">';
    html += '<h4>🚨 ANOMALY DETECTED</h4>';
    html += `<p class="anomaly-type"><strong>${anomalyType}</strong></p>`;
    html += `<p>${anomalyDescription}</p>`;
    html += '</div>';
  } else {
    html += '<div class="analysis-section">';
    html += '<h4>✅ No Anomaly</h4>';
    html += `<p>${anomalyDescription}</p>`;
    html += '</div>';
  }
  
  // Statistical insights
  html += '<div class="analysis-section">';
  html += '<h4>Statistical Insights</h4>';
  html += '<div class="stats-grid">';
  html += `<div class="stat-item"><strong>Total Iterations:</strong> ${totalIterations}</div>`;
  html += `<div class="stat-item"><strong>Total Lead Time:</strong> ${totalLeadIterations} ${totalLeadIterations > totalIterations ? '(ties occurred)' : ''}</div>`;
  html += `<div class="stat-item"><strong>Count Gap:</strong> ${countGap} occurrences (${gapPercentage}% difference)</div>`;
  html += `<div class="stat-item"><strong>Lead Dominance:</strong> ${leadDominance}% by Digit ${leadTimeWinner.label}</div>`;
  html += '</div>';
  html += '</div>';
  
  // Notable findings
  html += '<div class="analysis-section">';
  html += '<h4>💡 Notable Findings</h4>';
  html += '<ul class="findings-list">';
  
  if (isAnomaly) {
    html += `<li>Different winners for final count (Digit ${countWinner.label}) vs lead time (Digit ${leadTimeWinner.label})</li>`;
  }
  
  if (ghosts.length > 0) {
    ghosts.forEach(g => {
      html += `<li>Digit ${g.label}: ${g.count} occurrences but never led ("Ghost" accumulation)</li>`;
    });
  }
  
  if (totalLeadIterations > totalIterations) {
    const tieCount = totalLeadIterations - totalIterations;
    html += `<li>${tieCount} extra lead iterations due to ties (multiple digits tied for lead)</li>`;
  }
  
  const highLeadLowCount = digitData.filter(d => (d.leadTime / totalIterations > 0.3) && (sortedByCount.findIndex(s => s.digit === d.digit) > 2));
  if (highLeadLowCount.length > 0) {
    highLeadLowCount.forEach(d => {
      const rank = sortedByCount.findIndex(s => s.digit === d.digit) + 1;
      html += `<li>Digit ${d.label}: Led for ${((d.leadTime / totalIterations) * 100).toFixed(1)}% but finished ${rank}${getOrdinalSuffix(rank)}</li>`;
    });
  }
  
  html += '</ul>';
  html += '</div>';
  
  // Educational context
  if (isAnomaly) {
    html += '<div class="analysis-section educational">';
    html += '<h4>🎓 Teaching Applications</h4>';
    html += '<p>This result is ideal for teaching:</p>';
    html += '<ul>';
    html += '<li><strong>Statistical Variance:</strong> Early dominance doesn\'t guarantee final victory</li>';
    html += '<li><strong>Regression to the Mean:</strong> Extreme early results tend to moderate over time</li>';
    html += '<li><strong>Gambler\'s Fallacy:</strong> Past performance is not indicative of future results</li>';
    html += '<li><strong>Leading vs Lagging Indicators:</strong> Instantaneous state ≠ final outcome</li>';
    html += '</ul>';
    html += '</div>';
  }
  
  analysisDiv.innerHTML = html;
}

function getOrdinalSuffix(num) {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
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
    leadTime = new Array(currentBase).fill(0);
    timeSeriesData = [];
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
    
    // Track lead time
    updateLeadTime();
    
    // Update spiral visualization
    updateSpiral();
    
    const digitStr = digitLabels[digit];
    document.getElementById('digitSequence').value += digitStr;
    document.getElementById('liveDigit').textContent = digitStr;
    document.getElementById('processedCount').textContent = currentDigitIndex;
    
    updateChart();
    updateLeadTimeChart();
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
  leadTime = new Array(currentBase).fill(0);
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
  
  // Get bet type
  const betType = document.querySelector('input[name="betType"]:checked').value;
  
  submittedGuess = {
    digit: guessDigit,
    betType: betType
  };
  
  const betTypeText = betType === 'tally' ? 'Most Tallies' : (betType === 'leadTime' ? 'Most Lead Time' : 'Highest Ghost Score');
  document.getElementById('guessResult').textContent = `You guessed: ${digitLabels[guessDigit]} (${betTypeText})`;
}

function checkGuess() {
  if (!submittedGuess) return;
  
  const guessedDigit = submittedGuess.digit;
  const betType = submittedGuess.betType;
  
  // Determine winners based on bet type
  let winners = [];
  let winnerType = '';
  
  if (betType === 'tally') {
    // Check final tally
    const maxCount = Math.max(...counts);
    winners = counts.map((c, i) => c === maxCount ? i : -1).filter(i => i >= 0);
    winnerType = 'Tally Champion';
  } else if (betType === 'leadTime') {
    // Check lead time
    const maxLeadTime = Math.max(...leadTime);
    winners = leadTime.map((lt, i) => lt === maxLeadTime ? i : -1).filter(i => i >= 0);
    winnerType = 'Lead Time Champion';
  } else {
    // Check ghost score (highest count with 0 lead time)
    const ghostScores = counts.map((c, i) => leadTime[i] === 0 ? c : 0);
    const maxGhostScore = Math.max(...ghostScores);
    if (maxGhostScore > 0) {
      winners = ghostScores.map((gs, i) => gs === maxGhostScore ? i : -1).filter(i => i >= 0);
      winnerType = 'Ghost Champion';
    } else {
      winners = [];
      winnerType = 'No Ghost (all digits led at some point)';
    }
  }
  
  // Check if guess is correct
  if (winners.includes(guessedDigit)) {
    document.getElementById('guessResult').textContent += ' - Correct! 🎉';
  } else {
    const winnerLabels = winners.map(i => digitLabels[i]).join(', ');
    document.getElementById('guessResult').textContent += ` - Wrong. ${winnerType}: ${winnerLabels}`;
  }
  
  // Show both champions for educational value
  const tallyMax = Math.max(...counts);
  const tallyChampions = counts.map((c, i) => c === tallyMax ? i : -1).filter(i => i >= 0);
  const leadTimeMax = Math.max(...leadTime);
  const leadTimeChampions = leadTime.map((lt, i) => lt === leadTimeMax ? i : -1).filter(i => i >= 0);
  
  const tallyLabels = tallyChampions.map(i => `${digitLabels[i]} (${counts[i]})`).join(', ');
  const leadTimeLabels = leadTimeChampions.map(i => `${digitLabels[i]} (${leadTime[i]} iterations)`).join(', ');
  
  // Calculate ghost champion
  const ghostScores = counts.map((c, i) => leadTime[i] === 0 ? c : 0);
  const maxGhostScore = Math.max(...ghostScores);
  let ghostResult = '';
  if (maxGhostScore > 0) {
    const ghostChampions = ghostScores.map((gs, i) => gs === maxGhostScore ? i : -1).filter(i => i >= 0);
    const ghostLabels = ghostChampions.map(i => `${digitLabels[i]} (${counts[i]} count, 0 lead)`).join(', ');
    ghostResult = `<br>👻 Ghost Champion: ${ghostLabels}`;
  } else {
    ghostResult = '<br>👻 No Ghost (all digits led at some point)';
  }
  
  document.getElementById('guessResult').innerHTML += `<br><br><strong>Final Results:</strong><br>✅ Tally Champion: ${tallyLabels}<br>👑 Lead Time Champion: ${leadTimeLabels}${ghostResult}`;
}

function toggleGuessSection() {
  const section = document.getElementById('guessSection');
  section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

function randomizeSettings() {
  // Random base (2-16)
  const randomBase = Math.floor(Math.random() * 15) + 2;
  document.getElementById('baseSystem').value = randomBase;
  
  // Random digit count (500-1000)
  const randomDigits = Math.floor(Math.random() * 501) + 500;
  document.getElementById('digits').value = randomDigits;
  
  // Random algorithm
  const algorithms = ['pi', 'gaussian', 'perlin', 'lcg', 'mersenne', 'logistic', 'middleSquare', 'xorshift', 'quantum', 'rule30', 'pcg', 'sobol', 'randu'];
  const randomAlgorithm = algorithms[Math.floor(Math.random() * algorithms.length)];
  document.getElementById('calcType').value = randomAlgorithm;
  
  // Apply the base to initialize
  applyBase();
  
  // Show notification
  alert(`🎲 Random Settings Applied!\n\nBase: ${randomBase}\nDigits: ${randomDigits}\nAlgorithm: ${document.getElementById('calcType').selectedOptions[0].text}\n\nReady to guess and calculate!`);
}

function printReport() {
  const totalIterations = counts.reduce((s, c) => s + c, 0);
  if (totalIterations === 0) { alert('No data to print yet. Please run a calculation first.'); return; }
  
  const algorithmName = getAlgorithmName();
  const baseInfo = document.getElementById('baseInfo').textContent;
  const chiSquare = document.getElementById('statChiSquare').textContent;
  
  // Date/time
  document.getElementById('printDate').textContent = new Date().toLocaleString();
  document.getElementById('printAlgorithm').textContent = algorithmName;
  document.getElementById('printBase').textContent = baseInfo;
  document.getElementById('printDigitCount').textContent = totalIterations;
  document.getElementById('printChiSquare').textContent = chiSquare;
  
  // Build digit data
  const digitData = counts.map((count, i) => ({
    digit: i, label: digitLabels[i], count,
    leadTime: leadTime[i],
    ghostScore: leadTime[i] === 0 ? count : 0
  }));
  
  const sortedByCount = [...digitData].sort((a, b) => b.count - a.count);
  const countWinner = sortedByCount[0];
  const leadWinner = digitData.reduce((mx, d) => d.leadTime > mx.leadTime ? d : mx);
  const ghostScores = digitData.map(d => d.ghostScore);
  const maxGhost = Math.max(...ghostScores);
  const ghostWinners = maxGhost > 0 ? digitData.filter(d => d.ghostScore === maxGhost) : [];
  
  // Champions
  document.getElementById('printTallyChamp').textContent =
    `Digit ${countWinner.label}: ${countWinner.count} occurrences (${((countWinner.count/totalIterations)*100).toFixed(1)}%)`;
  document.getElementById('printLeadChamp').textContent =
    `Digit ${leadWinner.label}: ${leadWinner.leadTime} iterations (${((leadWinner.leadTime/totalIterations)*100).toFixed(1)}%)`;
  document.getElementById('printGhostChamp').textContent =
    ghostWinners.length > 0
      ? ghostWinners.map(g => `Digit ${g.label}: ${g.count} (never led)`).join(', ')
      : 'None — all digits led at some point';
  
  // Anomaly
  const isAnomaly = countWinner.digit !== leadWinner.digit;
  const anomalyBlock = document.getElementById('printAnomalyBlock');
  if (isAnomaly) {
    anomalyBlock.style.display = 'block';
    const leadPct = ((leadWinner.leadTime / totalIterations) * 100).toFixed(1);
    const rank = sortedByCount.findIndex(d => d.digit === leadWinner.digit) + 1;
    document.getElementById('printAnomalyText').textContent =
      `Digit ${countWinner.label} won the final count (${countWinner.count}) but Digit ${leadWinner.label} led for ${leadWinner.leadTime} iterations (${leadPct}% dominance), finishing ${rank}${getOrdinalSuffix(rank)} place. This is a classic example of early dominance failing to translate into final victory.`;
  } else {
    anomalyBlock.style.display = 'none';
  }
  
  // Guess block
  const guessBlock = document.getElementById('printGuessBlock');
  const guessResultText = document.getElementById('guessResult').textContent;
  if (guessResultText && guessResultText.trim() !== '') {
    guessBlock.style.display = 'block';
    document.getElementById('printGuessText').textContent = guessResultText;
  } else {
    guessBlock.style.display = 'none';
  }
  
  // Stats table
  const tbody = document.getElementById('printStatsBody');
  tbody.innerHTML = '';
  sortedByCount.forEach((d, idx) => {
    const pct = ((d.count / totalIterations) * 100).toFixed(1);
    const isCountWin = d.digit === countWinner.digit;
    const isLeadWin  = d.digit === leadWinner.digit;
    const isGhostWin = ghostWinners.some(g => g.digit === d.digit);
    const rowClass = isCountWin ? 'winner-row' : (isLeadWin ? 'lead-row' : (isGhostWin ? 'ghost-row' : ''));
    const notes = [];
    if (isCountWin) notes.push('✅ Count Winner');
    if (isLeadWin)  notes.push('👑 Lead Champion');
    if (isGhostWin) notes.push('👻 Ghost Champion');
    if (d.leadTime === 0 && d.count > 0) notes.push('Never led');
    tbody.innerHTML += `<tr class="${rowClass}"><td>${d.label}</td><td>${d.count}</td><td>${pct}%</td><td>${d.leadTime}</td><td>${d.ghostScore > 0 ? d.ghostScore : '—'}</td><td>${notes.join(', ') || '—'}</td></tr>`;
  });
  
  // Narrative
  const totalLead = digitData.reduce((s, d) => s + d.leadTime, 0);
  const tieNote = totalLead > totalIterations ? ` (${totalLead - totalIterations} extra iterations due to ties)` : '';
  let narrative = `This experiment ran ${totalIterations} digits using the ${algorithmName} algorithm in ${baseInfo}. `;
  if (isAnomaly) {
    narrative += `A notable anomaly was detected: Digit ${countWinner.label} won the final count but Digit ${leadWinner.label} dominated the lead for most of the run. `;
  } else {
    narrative += `Digit ${countWinner.label} demonstrated consistent dominance, winning both the final count and the lead time championship. `;
  }
  if (ghostWinners.length > 0) {
    narrative += `Ghost accumulation was observed: ${ghostWinners.map(g => `Digit ${g.label} (${g.count} occurrences, never led)`).join(', ')}. `;
  }
  narrative += `Total lead time across all digits: ${totalLead}${tieNote}. Chi-Square: ${chiSquare}.`;
  document.getElementById('printNarrative').textContent = narrative;
  
  // Show the report and trigger print
  const report = document.getElementById('printableReport');
  report.style.display = 'block';
  setTimeout(() => { window.print(); }, 300);
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
  
  document.getElementById('calcType').addEventListener('change', handleAlgorithmChange);
  
  // Speed control slider
  const speedControl = document.getElementById('speedControl');
  const speedValue = document.getElementById('speedValue');
  
  speedControl.addEventListener('input', (e) => {
    generationSpeed = parseInt(e.target.value);
    speedValue.textContent = `${generationSpeed}ms`;
  });
  
  // Dark mode toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  
  if (savedDarkMode) {
    document.body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️ Light Mode';
  }
  
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    darkModeToggle.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
    localStorage.setItem('darkMode', isDarkMode);
    
    // Update charts for dark mode
    if (myChart) {
      myChart.update();
    }
    if (timeSeriesChart) {
      timeSeriesChart.update();
    }
    if (spiralCanvas) {
      drawRadialPolygon();
    }
  });
});

// ============= FILE UPLOAD FEATURE =============

let uploadedFileBytes = null;  // Uint8Array of file bytes
let uploadedFileName = '';
let uploadedFileType = '';
let uploadedFileSize = 0;

// Show/hide file upload zone when algorithm changes
function handleAlgorithmChange() {
  const calcType = document.getElementById('calcType').value;
  const fileUploadZone = document.getElementById('fileUploadZone');
  
  if (calcType === 'fileUpload') {
    fileUploadZone.style.display = 'block';
  } else {
    fileUploadZone.style.display = 'none';
  }
  
  updateAlgorithmInfo();
}

// Drag-and-drop handlers
function handleDragOver(event) {
  event.preventDefault();
  event.stopPropagation();
  document.getElementById('dropZone').classList.add('drag-over');
}

function handleDragLeave(event) {
  event.preventDefault();
  document.getElementById('dropZone').classList.remove('drag-over');
}

function handleFileDrop(event) {
  event.preventDefault();
  event.stopPropagation();
  document.getElementById('dropZone').classList.remove('drag-over');
  
  const files = event.dataTransfer.files;
  if (files.length > 0) {
    processUploadedFile(files[0]);
  }
}

function handleFileSelect(event) {
  const files = event.target.files;
  if (files.length > 0) {
    processUploadedFile(files[0]);
  }
}

function processUploadedFile(file) {
  // 2MB cap
  const MAX_SIZE = 2 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    alert(`File too large! Maximum size is 2MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`);
    return;
  }
  
  if (file.size === 0) {
    alert('File is empty. Please choose a file with content.');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    uploadedFileBytes = new Uint8Array(e.target.result);
    uploadedFileName = file.name;
    uploadedFileType = file.type || detectFileType(file.name);
    uploadedFileSize = file.size;
    
    // Show file info panel
    showFileInfoPanel();
    
    // Auto-set digit count to available hex digits (capped at 10000)
    const availableHexDigits = uploadedFileBytes.length * 2;
    const suggestedDigits = Math.min(availableHexDigits, 10000);
    document.getElementById('digits').value = suggestedDigits;
    
    // Update chart titles to reflect the loaded file name
    const algorithmLabel = `File: ${uploadedFileName}`;
    const base = currentBase;
    ['digitChart', 'timeSeriesChart', 'leadTimeChart'].forEach(id => {
      const c = Chart.getChart(id);
      if (c && c.options.plugins.title) {
        const oldTitle = c.options.plugins.title.text || '';
        // Replace the algorithm portion of the title
        c.options.plugins.title.text = oldTitle.replace(/^(.*?) - .* \(Base/, `$1 - ${algorithmLabel} (Base`);
        c.update();
      }
    });
    // Spiral title will update on next draw via getAlgorithmName()
  };
  reader.readAsArrayBuffer(file);
}

function detectFileType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const typeMap = {
    'txt': 'text/plain', 'html': 'text/html', 'css': 'text/css',
    'js': 'text/javascript', 'json': 'application/json',
    'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg',
    'gif': 'image/gif', 'bmp': 'image/bmp', 'svg': 'image/svg+xml',
    'pdf': 'application/pdf', 'zip': 'application/zip',
    'mp3': 'audio/mpeg', 'mp4': 'video/mp4',
    'exe': 'application/octet-stream', 'bin': 'application/octet-stream'
  };
  return typeMap[ext] || 'application/octet-stream';
}

function getFileTypeIcon(mimeType, filename) {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('text/')) return '📄';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.startsWith('video/')) return '🎬';
  if (mimeType === 'application/pdf') return '📕';
  if (mimeType === 'application/zip' || filename.endsWith('.zip') || filename.endsWith('.gz')) return '🗜️';
  if (mimeType === 'application/json') return '📋';
  if (filename.endsWith('.exe') || filename.endsWith('.bin')) return '⚙️';
  return '📂';
}

function classifyEntropy(bytes) {
  // Count unique byte values
  const freq = new Array(256).fill(0);
  for (const b of bytes) freq[b]++;
  const uniqueBytes = freq.filter(f => f > 0).length;
  
  // Calculate Shannon entropy (bits per byte)
  let entropy = 0;
  const n = bytes.length;
  for (const f of freq) {
    if (f > 0) {
      const p = f / n;
      entropy -= p * Math.log2(p);
    }
  }
  
  // Classify
  if (entropy >= 7.5) return { label: 'Very High 🔥', insight: 'This file has near-maximum entropy — it looks like encrypted or compressed data. The byte distribution is extremely uniform, similar to a high-quality PRNG.', entropy };
  if (entropy >= 6.5) return { label: 'High ⬆️', insight: 'High entropy suggests compressed, encrypted, or binary data. Bytes are fairly well distributed with no strong patterns.', entropy };
  if (entropy >= 5.0) return { label: 'Medium ➡️', insight: 'Medium entropy is typical of executable files or mixed binary/text. Some byte values dominate but there is still variety.', entropy };
  if (entropy >= 3.0) return { label: 'Low ⬇️', insight: 'Low entropy suggests structured text or data with repeating patterns. Certain byte values (like ASCII letters) appear far more often than others.', entropy };
  return { label: 'Very Low ❄️', insight: 'Very low entropy means this file is highly repetitive or mostly zeros. The byte distribution is extremely non-uniform.', entropy };
}

function showFileInfoPanel() {
  const panel = document.getElementById('fileInfoPanel');
  const dropZone = document.getElementById('dropZone');
  
  // Update file info
  document.getElementById('fileTypeIcon').textContent = getFileTypeIcon(uploadedFileType, uploadedFileName);
  document.getElementById('fileName').textContent = uploadedFileName;
  
  const sizeKB = (uploadedFileSize / 1024).toFixed(1);
  const sizeMB = (uploadedFileSize / 1024 / 1024).toFixed(2);
  const sizeStr = uploadedFileSize > 1024 * 100 ? `${sizeMB} MB` : `${sizeKB} KB`;
  document.getElementById('fileMeta').textContent = `${sizeStr} · ${uploadedFileType || 'unknown type'}`;
  
  // Entropy stats
  const freq = new Array(256).fill(0);
  for (const b of uploadedFileBytes) freq[b]++;
  const uniqueBytes = freq.filter(f => f > 0).length;
  const entropyInfo = classifyEntropy(uploadedFileBytes);
  
  document.getElementById('fileTotalBytes').textContent = uploadedFileBytes.length.toLocaleString();
  document.getElementById('fileHexDigits').textContent = (uploadedFileBytes.length * 2).toLocaleString();
  document.getElementById('fileEntropyClass').textContent = entropyInfo.label;
  document.getElementById('fileUniqueBytes').textContent = `${uniqueBytes} / 256`;
  document.getElementById('fileEntropyInsight').textContent = `Shannon Entropy: ${entropyInfo.entropy.toFixed(3)} bits/byte — ${entropyInfo.insight}`;
  
  // Show panel, hide drop zone
  dropZone.style.display = 'none';
  panel.style.display = 'block';
}

function clearUploadedFile() {
  uploadedFileBytes = null;
  uploadedFileName = '';
  uploadedFileType = '';
  uploadedFileSize = 0;
  
  // Reset file input
  document.getElementById('fileInput').value = '';
  
  // Show drop zone, hide panel
  document.getElementById('dropZone').style.display = 'flex';
  document.getElementById('fileInfoPanel').style.display = 'none';
}

// File upload generator — reads bytes as hex digits, then converts to target base
function* fileUploadGenerator(base) {
  if (!uploadedFileBytes || uploadedFileBytes.length === 0) {
    // Fallback if no file loaded
    yield* lcgGenerator(base);
    return;
  }
  
  // Extract hex digits from bytes (each byte = 2 hex digits, high nibble then low nibble)
  const hexDigits = [];
  for (const byte of uploadedFileBytes) {
    hexDigits.push((byte >> 4) & 0xF);  // High nibble (0-15)
    hexDigits.push(byte & 0xF);          // Low nibble (0-15)
  }
  
  if (base === 16) {
    // Direct hex digit output
    let i = 0;
    while (true) {
      yield hexDigits[i % hexDigits.length];
      i++;
    }
  } else {
    // Convert hex digit stream to target base
    // Pack hex digits into a value and re-extract in target base
    // Use a sliding window approach for efficient conversion
    let buffer = 0;
    let bufferBits = 0;
    const bitsPerHex = 4;
    const bitsNeeded = Math.ceil(Math.log2(base));
    let hexIndex = 0;
    
    while (true) {
      // Fill buffer with hex digits
      while (bufferBits < bitsNeeded && hexIndex < hexDigits.length) {
        buffer = (buffer << bitsPerHex) | hexDigits[hexIndex++];
        bufferBits += bitsPerHex;
      }
      
      // If we've consumed all bytes, wrap around
      if (hexIndex >= hexDigits.length) {
        hexIndex = 0;
      }
      
      // Extract digit in target base using rejection sampling
      if (bufferBits >= bitsNeeded) {
        const maxVal = 1 << bitsNeeded;
        const candidate = (buffer >> (bufferBits - bitsNeeded)) & (maxVal - 1);
        bufferBits -= bitsNeeded;
        buffer &= (1 << bufferBits) - 1;
        
        if (candidate < base) {
          yield candidate;
        }
        // else: reject and try again (rejection sampling for uniform distribution)
      }
    }
  }
}
