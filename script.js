function calculatePi() {
  const digits = parseInt(document.getElementById('digits').value);
  let pi = '';
  let q = 1, r = 0, t = 1, k = 1, n = 3, l = 3;
  for (let i = 0; i < digits; i++) {
    if (4 * q + r - t < n * t) {
      pi += n;
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
  }
  document.getElementById('piResult').textContent = 'Pi digits: ' + pi;
  updateDigitCounts(pi);
}

function updateDigitCounts(pi) {
  const counts = new Array(10).fill(0);
  for (let digit of pi) counts[parseInt(digit)]++;
  sessionStorage.setItem('piDigitCounts', JSON.stringify(counts));
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