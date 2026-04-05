// AlecRae Voice — Popup Controller
// Handles login, recording from popup, mode/toggle persistence, and history.

const API_BASE = 'https://alecrae.app';

// DOM refs
const loginView = document.getElementById('login-view');
const mainView = document.getElementById('main-view');
const passwordInput = document.getElementById('password-input');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const recordBtn = document.getElementById('record-btn');
const micIcon = document.getElementById('mic-icon');
const stopIcon = document.getElementById('stop-icon');
const recordStatus = document.getElementById('record-status');
const modeSelect = document.getElementById('mode-select');
const toggleInsert = document.getElementById('toggle-insert');
const toggleEnhance = document.getElementById('toggle-enhance');
const historyList = document.getElementById('history-list');

// State
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;

// ---------------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', async () => {
  const { token } = await msg('GET_AUTH');
  if (token) {
    showMain();
  } else {
    showLogin();
  }
});

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------

function showLogin() {
  loginView.classList.remove('hidden');
  mainView.classList.add('hidden');
  passwordInput.focus();
}

async function showMain() {
  loginView.classList.add('hidden');
  mainView.classList.remove('hidden');
  await loadSettings();
  await loadHistory();
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

loginBtn.addEventListener('click', doLogin);
passwordInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doLogin();
});

async function doLogin() {
  loginError.style.display = 'none';
  loginBtn.disabled = true;
  loginBtn.textContent = 'Signing in...';

  try {
    const res = await fetch(`${API_BASE}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordInput.value }),
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Invalid');
    }

    // Store a flag indicating we're authenticated (cookie handles actual auth)
    await msg('SET_AUTH', { token: 'authenticated' });
    showMain();
  } catch {
    loginError.style.display = 'block';
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Sign in';
  }
}

logoutBtn.addEventListener('click', async () => {
  try {
    await fetch(`${API_BASE}/api/auth`, { method: 'DELETE', credentials: 'include' });
  } catch { /* ignore */ }
  await msg('LOGOUT');
  showLogin();
});

// ---------------------------------------------------------------------------
// Recording
// ---------------------------------------------------------------------------

recordBtn.addEventListener('click', toggleRecording);

async function toggleRecording() {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioChunks = [];

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm';

    mediaRecorder = new MediaRecorder(stream, { mimeType });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(audioChunks, { type: mimeType });
      await processAudio(blob);
    };

    mediaRecorder.start();
    isRecording = true;
    recordBtn.classList.add('recording');
    micIcon.classList.add('hidden');
    stopIcon.classList.remove('hidden');
    recordStatus.textContent = 'Recording...';
    recordStatus.classList.add('visible');

    await msg('SET_RECORDING_STATE', { active: true });
  } catch (err) {
    console.error('Microphone access denied:', err);
    recordStatus.textContent = 'Microphone access denied';
    recordStatus.classList.add('visible');
    recordStatus.style.color = '#ef4444';
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  isRecording = false;
  recordBtn.classList.remove('recording');
  micIcon.classList.remove('hidden');
  stopIcon.classList.add('hidden');
  recordStatus.textContent = 'Processing...';
  msg('SET_RECORDING_STATE', { active: false });
}

// ---------------------------------------------------------------------------
// Transcribe & Enhance
// ---------------------------------------------------------------------------

async function processAudio(blob) {
  recordStatus.textContent = 'Transcribing...';
  recordStatus.style.color = '#c4a23a';

  try {
    // Transcribe
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');
    formData.append('mode', modeSelect.value);

    const transcribeRes = await fetch(`${API_BASE}/api/transcribe`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!transcribeRes.ok) {
      throw new Error(`Transcription failed: ${transcribeRes.status}`);
    }

    const { text: rawText } = await transcribeRes.json();
    let finalText = rawText;

    // Enhance if toggled on
    const settings = await msg('GET_SETTINGS');
    if (settings.enhance || toggleEnhance.classList.contains('on')) {
      recordStatus.textContent = 'Enhancing...';

      const enhanceRes = await fetch(`${API_BASE}/api/enhance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: rawText,
          mode: modeSelect.value,
        }),
        credentials: 'include',
      });

      if (enhanceRes.ok) {
        // The enhance endpoint streams SSE — read the full response
        const reader = enhanceRes.body.getReader();
        const decoder = new TextDecoder();
        let enhanced = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          // Parse SSE lines
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) enhanced += parsed.text;
                if (parsed.delta) enhanced += parsed.delta;
              } catch {
                // Plain text delta
                enhanced += data;
              }
            }
          }
        }

        if (enhanced.trim()) finalText = enhanced;
      }
    }

    // Insert into active tab if toggle is on
    if (toggleInsert.classList.contains('on')) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'INSERT_TEXT',
          text: finalText,
        });
      }
    }

    // Save to history
    await msg('ADD_HISTORY', {
      entry: {
        text: finalText,
        mode: modeSelect.value,
        timestamp: Date.now(),
      },
    });

    recordStatus.textContent = 'Done';
    recordStatus.style.color = '#22c55e';
    setTimeout(() => {
      recordStatus.classList.remove('visible');
      recordStatus.style.color = '#c4a23a';
    }, 2000);

    await loadHistory();
  } catch (err) {
    console.error('Processing error:', err);
    recordStatus.textContent = 'Error — try again';
    recordStatus.style.color = '#ef4444';
    setTimeout(() => {
      recordStatus.classList.remove('visible');
      recordStatus.style.color = '#c4a23a';
    }, 3000);
  }
}

// ---------------------------------------------------------------------------
// Settings persistence
// ---------------------------------------------------------------------------

modeSelect.addEventListener('change', saveSettings);
toggleInsert.addEventListener('click', () => {
  toggleInsert.classList.toggle('on');
  toggleInsert.setAttribute('aria-checked', toggleInsert.classList.contains('on'));
  saveSettings();
});
toggleEnhance.addEventListener('click', () => {
  toggleEnhance.classList.toggle('on');
  toggleEnhance.setAttribute('aria-checked', toggleEnhance.classList.contains('on'));
  saveSettings();
});

async function loadSettings() {
  const settings = await msg('GET_SETTINGS');
  modeSelect.value = settings.mode || 'general';

  if (settings.autoInsert !== false) {
    toggleInsert.classList.add('on');
    toggleInsert.setAttribute('aria-checked', 'true');
  } else {
    toggleInsert.classList.remove('on');
    toggleInsert.setAttribute('aria-checked', 'false');
  }

  if (settings.enhance) {
    toggleEnhance.classList.add('on');
    toggleEnhance.setAttribute('aria-checked', 'true');
  } else {
    toggleEnhance.classList.remove('on');
    toggleEnhance.setAttribute('aria-checked', 'false');
  }
}

async function saveSettings() {
  await msg('SET_SETTINGS', {
    settings: {
      mode: modeSelect.value,
      autoInsert: toggleInsert.classList.contains('on'),
      enhance: toggleEnhance.classList.contains('on'),
    },
  });
}

// ---------------------------------------------------------------------------
// History
// ---------------------------------------------------------------------------

async function loadHistory() {
  const history = await msg('GET_HISTORY');

  if (!history || history.length === 0) {
    historyList.innerHTML = '<div class="history-empty">No dictations yet</div>';
    return;
  }

  historyList.innerHTML = history
    .map((item) => {
      const date = new Date(item.timestamp);
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      const preview = item.text.length > 60 ? item.text.slice(0, 60) + '...' : item.text;
      return `
        <div class="history-item" data-text="${escapeAttr(item.text)}" title="Click to copy">
          <div class="history-text">${escapeHtml(preview)}</div>
          <div class="history-meta">${escapeHtml(item.mode)} &middot; ${dateStr} ${timeStr}</div>
        </div>
      `;
    })
    .join('');

  // Click to copy or insert
  historyList.querySelectorAll('.history-item').forEach((el) => {
    el.addEventListener('click', async () => {
      const text = el.getAttribute('data-text');

      if (toggleInsert.classList.contains('on')) {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.id) {
          chrome.tabs.sendMessage(tab.id, { type: 'INSERT_TEXT', text });
        }
      } else {
        await navigator.clipboard.writeText(text);
        el.querySelector('.history-meta').textContent = 'Copied to clipboard';
        setTimeout(() => loadHistory(), 1500);
      }
    });
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function msg(type, extra = {}) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type, ...extra }, resolve);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
