/*
==================================================
  WORKSHEET GENERATOR
==================================================
*/

// ── Modal Controls ──────────────────────────────
function openWorksheetModal() {
  document.getElementById('worksheetModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeWorksheetModal() {
  document.getElementById('worksheetModal').style.display = 'none';
  document.body.style.overflow = '';
}

// ── Focus / Option Button Selection ─────────────
function wsSelectFocus(btn) {
  document.querySelectorAll('#wsFocusGrid .ws-focus-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}
function wsSelectOpt(btn, groupId) {
  document.querySelectorAll(`#${groupId} .ws-opt-btn`).forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ── Get Current Selections ───────────────────────
function wsGetSelections() {
  const focusBtn = document.querySelector('#wsFocusGrid .ws-focus-btn.active');
  const gradeBtn = document.querySelector('#wsGradeGroup .ws-opt-btn.active');
  const qcountBtn = document.querySelector('#wsQCountGroup .ws-opt-btn.active');
  return {
    focus: focusBtn ? focusBtn.dataset.focus : 'pi-day',
    grade: gradeBtn ? gradeBtn.dataset.grade : 'high-school',
    qcount: qcountBtn ? parseInt(qcountBtn.dataset.qcount) : 5,
    includeHeader: document.getElementById('wsIncludeHeader').checked,
    includeAnswerLines: document.getElementById('wsIncludeAnswerLines').checked,
    includeHandsOn: document.getElementById('wsIncludeHandsOn').checked,
    includeQR: document.getElementById('wsIncludeQR').checked,
    customTitle: document.getElementById('wsCustomTitle').value.trim()
  };
}

// ── Fisher-Yates Shuffle ─────────────────────────
function wsShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Pick Questions ───────────────────────────────
function wsPickQuestions(focus, grade, count, includeHandsOn) {
  let pool = [];

  if (focus === 'mixed') {
    // One from each available topic
    const topics = Object.keys(QUESTION_BANK);
    topics.forEach(topic => {
      const topicPool = (QUESTION_BANK[topic][grade] || QUESTION_BANK[topic]['high-school'] || []);
      const filtered = includeHandsOn ? topicPool : topicPool.filter(q => q.type !== 'hands-on');
      if (filtered.length > 0) pool.push(filtered[Math.floor(Math.random() * filtered.length)]);
    });
    pool = wsShuffle(pool);
  } else {
    const topicPool = QUESTION_BANK[focus]
      ? (QUESTION_BANK[focus][grade] || QUESTION_BANK[focus]['high-school'] || [])
      : [];
    pool = includeHandsOn ? topicPool : topicPool.filter(q => q.type !== 'hands-on');
    pool = wsShuffle(pool);
  }

  return pool.slice(0, count);
}

// ── Focus Display Names ──────────────────────────
const FOCUS_NAMES = {
  'pi-day': 'Pi Day Explorer',
  'number-bases': 'Number Bases',
  'randomness-prngs': 'Randomness & PRNGs',
  'benford': "Benford's Law",
  'ulam-spiral': 'Ulam Spiral',
  'mixed': 'Mixed Sampler'
};
const GRADE_NAMES = {
  'middle-school': 'Middle School',
  'high-school': 'High School',
  'college': 'College / University'
};
const TYPE_LABELS = {
  'mcq': 'Multiple Choice',
  'fill-in': 'Fill in the Blank',
  'short-answer': 'Short Answer',
  'hands-on': '🔬 App Activity'
};

// ── Build QR Code URL ────────────────────────────
function wsEncodeAnswerKeyURL(focus, grade, questionIndices) {
  // Encode the worksheet config into a URL param for the answer key page
  const base = window.location.href.replace(/\/[^/]*$/, '/') + 'answer-key.html';
  const params = new URLSearchParams({
    focus,
    grade,
    q: questionIndices.join(',')
  });
  return `${base}?${params.toString()}`;
}

// ── Render Question HTML ─────────────────────────
function wsRenderQuestion(q, index, includeAnswerLines) {
  const typeLabel = TYPE_LABELS[q.type] || q.type;
  let html = `
    <div class="ws-question">
      <div class="ws-q-header">
        <span class="ws-q-num">${index + 1}</span>
        <span class="ws-q-type-tag">${typeLabel}</span>
      </div>
      <p class="ws-q-text">${q.question}</p>`;

  if (q.type === 'mcq' && q.options) {
    const letters = ['A', 'B', 'C', 'D'];
    html += `<ol class="ws-mcq-options" type="A">`;
    q.options.forEach((opt, i) => {
      html += `<li class="ws-mcq-opt"><span class="ws-mcq-letter">${letters[i]}.</span> ${opt}</li>`;
    });
    html += `</ol>`;
    if (includeAnswerLines) {
      html += `<div class="ws-answer-line-mcq">Answer: ______</div>`;
    }
  } else if (q.type === 'fill-in') {
    // Already has blank in question text — just add answer line
    if (includeAnswerLines) {
      html += `<div class="ws-answer-line">Answer: _______________________________________________</div>`;
    }
  } else {
    // short-answer or hands-on
    if (includeAnswerLines) {
      html += `<div class="ws-answer-lines">
        <div class="ws-answer-line-blank"></div>
        <div class="ws-answer-line-blank"></div>
        <div class="ws-answer-line-blank"></div>
      </div>`;
    }
  }

  html += `</div>`;
  return html;
}

// ── Main Generator ───────────────────────────────
function generateWorksheet() {
  const sel = wsGetSelections();
  const questions = wsPickQuestions(sel.focus, sel.grade, sel.qcount, sel.includeHandsOn);

  if (questions.length === 0) {
    alert('No questions available for this combination. Try a different focus area or grade level.');
    return;
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const focusName = FOCUS_NAMES[sel.focus] || sel.focus;
  const gradeName = GRADE_NAMES[sel.grade] || sel.grade;
  const title = sel.customTitle || `${focusName} Worksheet`;

  // Build answer key URL (encode focus, grade, and question indices for future use)
  const answerKeyURL = wsEncodeAnswerKeyURL(sel.focus, sel.grade, questions.map((_, i) => i));

  // Build QR code image URL using Google Charts API (free, no key needed)
  const qrURL = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(answerKeyURL)}`;

  // Build questions HTML
  let questionsHTML = '';
  questions.forEach((q, i) => {
    questionsHTML += wsRenderQuestion(q, i, sel.includeAnswerLines);
  });

  // Build header fields
  let headerHTML = '';
  if (sel.includeHeader) {
    headerHTML = `
      <div class="ws-header-fields">
        <div class="ws-field-row">
          <span class="ws-field-label">Name:</span>
          <span class="ws-field-line"></span>
          <span class="ws-field-label">Date:</span>
          <span class="ws-field-line ws-field-line-short"></span>
        </div>
        <div class="ws-field-row">
          <span class="ws-field-label">Class / Period:</span>
          <span class="ws-field-line"></span>
          <span class="ws-field-label">Teacher:</span>
          <span class="ws-field-line"></span>
        </div>
      </div>`;
  }

  // Build QR section
  let qrHTML = '';
  if (sel.includeQR) {
    qrHTML = `
      <div class="ws-qr-section">
        <div class="ws-qr-left">
          <img src="${qrURL}" alt="QR Code to Answer Key" class="ws-qr-img" onerror="this.style.display='none'">
        </div>
        <div class="ws-qr-right">
          <p class="ws-qr-title">📱 Scan for Answer Key</p>
          <p class="ws-qr-note">Scan this QR code with your phone's camera to access the answer key for this worksheet.</p>
          <p class="ws-qr-url">${answerKeyURL}</p>
        </div>
      </div>`;
  }

  // Full worksheet HTML document
  const worksheetHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Georgia', serif;
      font-size: 11pt;
      color: #1a1a1a;
      background: #fff;
      padding: 0;
    }
    .ws-page {
      max-width: 720px;
      margin: 0 auto;
      padding: 28px 36px 24px;
    }

    /* Header */
    .ws-doc-header {
      border-bottom: 3px solid #2c3e8c;
      padding-bottom: 10px;
      margin-bottom: 12px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .ws-doc-logo {
      font-size: 2rem;
      line-height: 1;
      color: #2c3e8c;
    }
    .ws-doc-title-block { flex: 1; }
    .ws-doc-title {
      font-size: 1.35rem;
      font-weight: bold;
      color: #1a1a1a;
      line-height: 1.2;
    }
    .ws-doc-meta {
      font-size: 0.78rem;
      color: #555;
      margin-top: 3px;
    }
    .ws-doc-badge {
      display: inline-block;
      background: #2c3e8c;
      color: #fff;
      font-size: 0.68rem;
      font-weight: bold;
      padding: 2px 8px;
      border-radius: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-right: 4px;
    }
    .ws-doc-badge.grade { background: #27ae60; }
    .ws-doc-badge.count { background: #e67e22; }

    /* Student fields */
    .ws-header-fields {
      background: #f8f9fc;
      border: 1px solid #dde;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 14px;
    }
    .ws-field-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 7px;
    }
    .ws-field-row:last-child { margin-bottom: 0; }
    .ws-field-label { font-size: 0.82rem; font-weight: bold; white-space: nowrap; color: #333; }
    .ws-field-line {
      flex: 1;
      border-bottom: 1px solid #999;
      min-width: 80px;
      height: 16px;
    }
    .ws-field-line-short { flex: 0.4; min-width: 60px; }

    /* Instructions */
    .ws-instructions {
      background: #fffbe6;
      border-left: 4px solid #f0c040;
      padding: 8px 12px;
      font-size: 0.82rem;
      color: #555;
      margin-bottom: 16px;
      border-radius: 0 4px 4px 0;
    }

    /* Questions */
    .ws-question {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .ws-q-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 5px;
    }
    .ws-q-num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: #2c3e8c;
      color: #fff;
      font-size: 0.78rem;
      font-weight: bold;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .ws-q-type-tag {
      font-size: 0.68rem;
      color: #888;
      font-style: italic;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .ws-q-text {
      font-size: 0.96rem;
      line-height: 1.5;
      color: #1a1a1a;
      margin-left: 32px;
    }

    /* MCQ */
    .ws-mcq-options {
      list-style: none;
      margin: 8px 0 4px 32px;
    }
    .ws-mcq-opt {
      margin-bottom: 5px;
      font-size: 0.9rem;
      display: flex;
      align-items: flex-start;
      gap: 6px;
    }
    .ws-mcq-letter { font-weight: bold; min-width: 16px; }
    .ws-answer-line-mcq {
      margin-left: 32px;
      margin-top: 4px;
      font-size: 0.85rem;
      color: #333;
    }

    /* Answer lines */
    .ws-answer-line {
      margin-left: 32px;
      margin-top: 6px;
      font-size: 0.85rem;
      color: #333;
    }
    .ws-answer-lines { margin-left: 32px; margin-top: 8px; }
    .ws-answer-line-blank {
      border-bottom: 1px solid #aaa;
      height: 22px;
      margin-bottom: 6px;
    }

    /* QR Section */
    .ws-qr-section {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      border-top: 2px solid #2c3e8c;
      margin-top: 24px;
      padding-top: 14px;
    }
    .ws-qr-img {
      width: 100px;
      height: 100px;
      border: 2px solid #2c3e8c;
      border-radius: 6px;
      flex-shrink: 0;
    }
    .ws-qr-title {
      font-size: 0.92rem;
      font-weight: bold;
      color: #2c3e8c;
      margin-bottom: 4px;
    }
    .ws-qr-note {
      font-size: 0.78rem;
      color: #555;
      line-height: 1.4;
      margin-bottom: 4px;
    }
    .ws-qr-url {
      font-size: 0.62rem;
      color: #888;
      word-break: break-all;
    }

    /* Footer */
    .ws-doc-footer {
      margin-top: 20px;
      padding-top: 8px;
      border-top: 1px solid #dde;
      font-size: 0.7rem;
      color: #aaa;
      display: flex;
      justify-content: space-between;
    }

    /* Divider between questions */
    .ws-question + .ws-question { border-top: 1px dashed #e0e0e0; padding-top: 16px; }

    @media print {
      body { padding: 0; }
      .ws-page { padding: 18px 24px; }
      .ws-no-print { display: none !important; }
    }
  </style>
</head>
<body>
<div class="ws-page">

  <!-- Document Header -->
  <div class="ws-doc-header">
    <span class="ws-doc-logo">π</span>
    <div class="ws-doc-title-block">
      <div class="ws-doc-title">${title}</div>
      <div class="ws-doc-meta">
        <span class="ws-doc-badge">${focusName}</span>
        <span class="ws-doc-badge grade">${gradeName}</span>
        <span class="ws-doc-badge count">${questions.length} Questions</span>
        &nbsp; Generated: ${dateStr}
      </div>
    </div>
    <button class="ws-no-print" onclick="window.print()" style="padding:6px 14px;background:#2c3e8c;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.85rem;">🖨️ Print</button>
  </div>

  ${headerHTML}

  <div class="ws-instructions">
    <strong>Instructions:</strong> Answer all questions below. For hands-on activities (🔬), use the Live Random Calculator app at <em>your teacher's provided link</em>. Scan the QR code at the bottom to access the answer key.
  </div>

  <!-- Questions -->
  <div class="ws-questions-list">
    ${questionsHTML}
  </div>

  ${qrHTML}

  <div class="ws-doc-footer">
    <span>Live Random Calculator — Educational Worksheet</span>
    <span>${focusName} · ${gradeName} · ${dateStr}</span>
  </div>

</div>
</body>
</html>`;

  // Open in new tab
  const win = window.open('', '_blank');
  if (win) {
    win.document.write(worksheetHTML);
    win.document.close();
  } else {
    alert('Pop-up blocked! Please allow pop-ups for this page to open the worksheet.');
  }
}
