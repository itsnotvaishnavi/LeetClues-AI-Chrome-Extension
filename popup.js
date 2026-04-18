document.addEventListener('DOMContentLoaded', async function () {
  const hintButton = document.getElementById('get-hint-button');
  const revealSolutionBtn = document.getElementById('reveal-solution-button');
  const resetBtn = document.getElementById('reset-button');
  
  const userCodeInput = document.getElementById('user-code');
  const gfgLink = document.getElementById('gfg-link');
  const historyContainer = document.getElementById('history-container');
  const codeFeedbackContainer = document.getElementById('code-feedback');
  const loadingDisplay = document.getElementById('loading');
  const problemTypeDisplay = document.getElementById('problem-type');
  const suggestionBox = document.getElementById('suggestion-box');

  let hintLevel = 1;
  let lastQuestion = "";
  let hintHistory = [];
  let idleTimer = null;
  let debounceTimer = null;

  function startIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (suggestionBox) suggestionBox.style.display = 'block';
    }, 60000);
  }

  function detectProblemType(question) {
    const qLower = question.toLowerCase();
    if (qLower.includes("tree")) return "Tree";
    if (qLower.includes("graph")) return "Graph";
    if (qLower.includes("list")) return "Linked List";
    if (qLower.includes("array") || qLower.includes("sum") || qLower.includes("two")) return "Array / Math";
    if (qLower.includes("string") || qLower.includes("palindrome") || qLower.includes("anagram")) return "String";
    if (qLower.includes("matrix") || qLower.includes("grid")) return "Matrix";
    if (qLower.includes("dp") || qLower.includes("dynamic")) return "Dynamic Programming";
    if (qLower.includes("sort")) return "Sorting";
    if (qLower.includes("search")) return "Binary Search";
    if (qLower.includes("number")) return "Math";
    return "Algorithmic";
  }

  function updateGFGLink(questionName) {
    const searchString = questionName.split('-').join('+');
    const link = `https://www.geeksforgeeks.org/search/?gq=${searchString}`;
    
    gfgLink.href = "#"; 
    gfgLink.style.display = "block";
    gfgLink.onclick = (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: link });
    };
  }

  function getBadgeLevel(level) {
    if (level === 1) return '<span class="badge badge-easy">Easy</span>';
    if (level === 2) return '<span class="badge badge-medium">Medium</span>';
    return '<span class="badge badge-strong">Strong</span>';
  }

  function renderHistory() {
    historyContainer.innerHTML = '';
    
    hintHistory.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = 'hint-card';
      
      const contentStr = typeof item.content === 'string' ? item.content : JSON.stringify(item.content);
      const formattedContent = contentStr ? contentStr.replace(/\n/g, '<br>') : '';
      let additionalHTML = '';

      if (item.alternative) {
        const altStr = typeof item.alternative === 'string' ? item.alternative : JSON.stringify(item.alternative);
        additionalHTML += `<div class="extra-section"><strong>💡 Alternative Approach:</strong><br>${altStr.replace(/\n/g, '<br>')}</div>`;
      }
      if (item.optimized) {
        const optStr = typeof item.optimized === 'string' ? item.optimized : JSON.stringify(item.optimized);
        additionalHTML += `<div class="extra-section"><strong>⚡ Optimized Approach:</strong><br>${optStr.replace(/\n/g, '<br>')}</div>`;
      }

      if (item.mode === 'hint') {
        el.innerHTML = `<div class="hint-title">Hint ${index + 1} ${getBadgeLevel(index + 1)}</div><div>${formattedContent}</div>${additionalHTML}`;
      } else {
        el.innerHTML = `<div class="hint-title solution-title">Solution</div><div>${formattedContent}</div>${additionalHTML}`;
        el.classList.add('solution-card');
      }
      historyContainer.appendChild(el);
    });

    if (hintLevel > 3 && !hintHistory.some(h => h.mode === 'solution')) {
      hintButton.style.display = 'none';
      revealSolutionBtn.style.display = 'block';
    } else if (hintHistory.some(h => h.mode === 'solution')) {
      hintButton.style.display = 'none';
      revealSolutionBtn.style.display = 'none';
    } else {
      hintButton.style.display = 'block';
      revealSolutionBtn.style.display = 'none';
      hintButton.textContent = `Get Hint ${hintLevel}`;
    }

    historyContainer.scrollTop = historyContainer.scrollHeight;
  }

  async function loadState(questionName) {
    return new Promise((resolve) => {
      chrome.storage.local.get(['lastQuestion', 'hintLevel', 'hintHistory'], (result) => {
        if (result.lastQuestion === questionName) {
          hintLevel = result.hintLevel || 1;
          hintHistory = result.hintHistory || [];
        } else {
          hintLevel = 1;
          hintHistory = [];
          lastQuestion = questionName;
          saveState();
        }
        resolve();
      });
    });
  }

  function saveState() {
    chrome.storage.local.set({ lastQuestion, hintLevel, hintHistory });
  }

  async function getCurrentQuestion() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs || tabs.length === 0) throw new Error("No active tab.");
    const tabUrl = tabs[0].url;
    if (!tabUrl.includes('leetcode.com/problems/')) {
      throw new Error('Please navigate to a LeetCode problem page');
    }
    const match = tabUrl.match(/problems\/([^/]+)/);
    if (!match) throw new Error('Could not find question name in URL');
    return match[1];
  }

  async function callHintApi(questionName, mode, level) {
    const response = await fetch('http://localhost:3000/get-hint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionName, level, mode })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch from backend');
    }
    return response.json();
  }

  function showLoading(show) {
    loadingDisplay.style.display = show ? 'block' : 'none';
    hintButton.disabled = show;
    revealSolutionBtn.disabled = show;
    resetBtn.disabled = show;
  }

  function displayProgressiveHint(level, hint, feedback) {
    const hintBox = document.getElementById("code-feedback");
    
    let levelText = "";
    if (level === 1) levelText = "Beginner";
    else if (level === 2) levelText = "Intermediate";
    else levelText = "Advanced";

    const hintStr = typeof hint === 'string' ? hint : JSON.stringify(hint);
    const feedbackStr = typeof feedback === 'string' ? feedback : JSON.stringify(feedback);

    hintBox.innerHTML = `
      <div class="hint-card feedback-card">
        <h4 style="color: #0f766e; margin-top: 0; margin-bottom: 8px;">🧠 Detected Progress: ${levelText}</h4>
        <p style="margin:0 0 8px 0;"><strong>Hint:</strong> ${hintStr.replace(/\n/g, '<br>')}</p>
        <p style="margin:0;"><strong>Feedback:</strong> ${feedbackStr.replace(/\n/g, '<br>')}</p>
      </div>
    `;
  }

  async function analyzeCodeAndGenerateHint() {
    const code = userCodeInput.value;
    if (!code || code.length < 20) return; // avoid unnecessary calls
  
    showLoading(true);
    try {
      const response = await fetch("http://localhost:3000/analyze-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionName: lastQuestion,
          code,
        }),
      });
  
      const data = await response.json();
      displayProgressiveHint(data.level, data.hint, data.feedback);
    } catch (err) {
      console.error(`Error analyzing progress: ${err.message}`);
    } finally {
      showLoading(false);
    }
  }

  // --- Initialize ---
  try {
    const qName = await getCurrentQuestion();
    lastQuestion = qName;
    problemTypeDisplay.textContent = `Type: ${detectProblemType(qName)}`;
    updateGFGLink(qName);
    
    await loadState(qName);
    renderHistory();
    startIdleTimer();
  } catch (err) {
    historyContainer.innerHTML = `<div class="error">${err.message}</div>`;
    hintButton.style.display = 'none';
    resetBtn.style.display = 'none';
    document.querySelector('.code-analysis-section').style.display = 'none';
  }

  hintButton.addEventListener('click', async () => {
    startIdleTimer();
    showLoading(true);
    try {
      const data = await callHintApi(lastQuestion, 'hint', hintLevel);
      hintHistory.push({ 
        mode: 'hint', 
        content: data.result || data.hint,
        alternative: data.alternative,
        optimized: data.optimized
      });
      hintLevel++;
      saveState();
      renderHistory();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      showLoading(false);
    }
  });

  revealSolutionBtn.addEventListener('click', async () => {
    startIdleTimer();
    const confirmed = confirm("⚠️ Are you sure you want to see the solution?");
    if (!confirmed) return;
    
    showLoading(true);
    try {
      const data = await callHintApi(lastQuestion, 'solution', hintLevel);
      hintHistory = []; // Wipe previous hints when showing the final solution
      hintHistory.push({ 
        mode: 'solution', 
        content: data.result || data.hint,
        alternative: data.alternative,
        optimized: data.optimized
      });
      saveState();
      renderHistory();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      showLoading(false);
    }
  });

  userCodeInput.addEventListener("input", () => {
    startIdleTimer();
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      analyzeCodeAndGenerateHint();
    }, 4000); // trigger after 4 seconds of inactivity
  });

  resetBtn.addEventListener('click', () => {
    startIdleTimer();
    hintLevel = 1;
    hintHistory = [];
    userCodeInput.value = '';
    codeFeedbackContainer.innerHTML = '';
    saveState();
    renderHistory();
  });

  document.addEventListener('mousemove', startIdleTimer);
  document.addEventListener('keypress', startIdleTimer);
});