console.log("🧠 LeetClues Auto-Mentor: BACKGROUND SCRIPT LOADED (Version 2 - No Disappear)");
let idleTimer;

function resetTimer() {
  clearTimeout(idleTimer);
  
  idleTimer = setTimeout(() => {
    checkAndHint();
  }, 15000); // 15 seconds of inactivity
}

// Reset idle timer on any standard coding activities
document.addEventListener('keydown', resetTimer);
document.addEventListener('mousemove', resetTimer);
document.addEventListener('mousedown', resetTimer);

async function checkAndHint() {
  try {
    const match = window.location.pathname.match(/problems\/([^/]+)/);
    if (!match) return;
    const questionName = match[1];

    // Grab code from Monaco view lines natively
    const lines = document.querySelectorAll('.view-line');
    if (!lines || lines.length === 0) return;
    
    // Attempt standard text pull for LLM context
    const code = Array.from(lines).map(line => line.textContent).join('\n');
    if (code.length < 20) return; // ignore practically empty editors

    const response = await fetch("http://localhost:3000/analyze-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionName, code })
    });
    
    if (!response.ok) return;
    const data = await response.json();
    showHintBox(data.level, data.hint, data.feedback);

  } catch (err) {
    console.error("LeetClues Background Track Error:", err);
  }
}

function showHintBox(level, hint, feedback) {
    let existing = document.getElementById('leetclues-hint-box');
    if (existing) existing.remove();

    const box = document.createElement('div');
    box.id = 'leetclues-hint-box';
    box.style.position = 'fixed';
    box.style.bottom = '20px';
    box.style.right = '20px';
    box.style.width = '350px';
    box.style.backgroundColor = '#f8fafc';
    box.style.border = '2px solid #0f766e';
    box.style.borderRadius = '12px';
    box.style.padding = '15px';
    box.style.boxShadow = '0 6px 15px rgba(0,0,0,0.15)';
    box.style.zIndex = '999999';
    box.style.fontFamily = 'monospace, sans-serif';
    box.style.color = '#334155';

    let levelText = level === 1 ? "Beginner" : level === 2 ? "Intermediate" : "Advanced";
    const hintStr = typeof hint === 'string' ? hint : JSON.stringify(hint);

    box.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-bottom: 10px;">
            <strong style="color: #0f766e; font-size: 14px;">🧠 LeetClues Auto-Mentor</strong>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 12px; font-weight: bold; padding: 2px 8px; border-radius: 12px; background: #e2e8f0;">${levelText}</span>
                <span id="close-leetclues-hint" style="cursor: pointer; font-weight: bold; color: #94a3b8; font-size: 16px;">&times;</span>
            </div>
        </div>
        <div style="font-size: 13px; margin-bottom: 8px;">
            <strong>Hint:</strong><br> ${hintStr.replace(/\n/g, '<br>')}
        </div>
    `;

    document.body.appendChild(box);

    document.getElementById('close-leetclues-hint').addEventListener('click', () => {
        box.remove();
    });
}

// Start timer on load
resetTimer();
