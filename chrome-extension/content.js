// AlecRae Voice — Content Script
// Injects a floating microphone button near focused text fields.
// Handles recording, transcription, optional enhancement, and text insertion.

(() => {
  'use strict';

  const API_BASE = 'https://alecrae.app';
  const ALECRAE_ID = 'alecrae-voice-ext';

  // Prevent double-injection
  if (document.getElementById(ALECRAE_ID)) return;

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------
  let activeField = null;
  let mediaRecorder = null;
  let audioChunks = [];
  let isRecording = false;
  let floatingBtn = null;
  let hideTimeout = null;

  // ---------------------------------------------------------------------------
  // Floating microphone button
  // ---------------------------------------------------------------------------

  function createFloatingBtn() {
    const btn = document.createElement('div');
    btn.id = ALECRAE_ID;
    btn.className = 'alecrae-float-btn';
    btn.title = 'AlecRae Voice — click to dictate (Alt+Shift+D)';
    btn.innerHTML = `
      <svg class="alecrae-mic-svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" fill="#c4a23a"/>
        <path d="M8 11v1a4 4 0 0 0 8 0v-1" stroke="#c4a23a" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="12" y1="16" x2="12" y2="19" stroke="#c4a23a" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <svg class="alecrae-stop-svg alecrae-hidden" width="14" height="14" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="5" width="14" height="14" rx="2" fill="#ef4444"/>
      </svg>
    `;
    btn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleRecording();
    });
    document.body.appendChild(btn);
    return btn;
  }

  function positionBtn(field) {
    if (!floatingBtn) floatingBtn = createFloatingBtn();

    const rect = field.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // Position at top-right corner of the field
    floatingBtn.style.top = `${rect.top + scrollY + 4}px`;
    floatingBtn.style.left = `${rect.right + scrollX - 32}px`;
    floatingBtn.classList.add('alecrae-visible');

    clearTimeout(hideTimeout);
  }

  function hideBtn() {
    // Delay hiding so the button stays clickable briefly after blur
    hideTimeout = setTimeout(() => {
      if (!isRecording && floatingBtn) {
        floatingBtn.classList.remove('alecrae-visible');
      }
    }, 300);
  }

  // ---------------------------------------------------------------------------
  // Text field detection
  // ---------------------------------------------------------------------------

  function isTextField(el) {
    if (!el) return false;
    const tag = el.tagName;

    // Standard inputs
    if (tag === 'TEXTAREA') return true;
    if (tag === 'INPUT') {
      const type = (el.type || '').toLowerCase();
      return ['text', 'search', 'url', 'email', ''].includes(type);
    }

    // Content-editable elements
    if (el.isContentEditable) return true;

    // Role=textbox (used by many rich editors)
    if (el.getAttribute('role') === 'textbox') return true;

    return false;
  }

  // ---------------------------------------------------------------------------
  // Focus / blur listeners
  // ---------------------------------------------------------------------------

  document.addEventListener('focusin', (e) => {
    if (isTextField(e.target)) {
      activeField = e.target;
      positionBtn(e.target);
    }
  }, true);

  document.addEventListener('focusout', (e) => {
    if (isTextField(e.target)) {
      hideBtn();
    }
  }, true);

  // Reposition on scroll/resize
  let repositionRaf = null;
  function repositionIfNeeded() {
    if (repositionRaf) return;
    repositionRaf = requestAnimationFrame(() => {
      repositionRaf = null;
      if (activeField && floatingBtn && floatingBtn.classList.contains('alecrae-visible')) {
        const rect = activeField.getBoundingClientRect();
        floatingBtn.style.top = `${rect.top + window.scrollY + 4}px`;
        floatingBtn.style.left = `${rect.right + window.scrollX - 32}px`;
      }
    });
  }

  window.addEventListener('scroll', repositionIfNeeded, { passive: true });
  window.addEventListener('resize', repositionIfNeeded, { passive: true });

  // ---------------------------------------------------------------------------
  // Recording
  // ---------------------------------------------------------------------------

  async function toggleRecording() {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  async function startRecording() {
    // Verify auth first
    const { token } = await msg('GET_AUTH');
    if (!token) {
      showToast('Please sign in via the AlecRae Voice extension popup.');
      return;
    }

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

      if (floatingBtn) {
        floatingBtn.classList.add('alecrae-recording');
        floatingBtn.querySelector('.alecrae-mic-svg').classList.add('alecrae-hidden');
        floatingBtn.querySelector('.alecrae-stop-svg').classList.remove('alecrae-hidden');
      }

      msg('SET_RECORDING_STATE', { active: true });
      showToast('Recording...', 0);
    } catch (err) {
      console.error('AlecRae Voice: microphone access denied', err);
      showToast('Microphone access denied.');
    }
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    isRecording = false;

    if (floatingBtn) {
      floatingBtn.classList.remove('alecrae-recording');
      floatingBtn.querySelector('.alecrae-mic-svg').classList.remove('alecrae-hidden');
      floatingBtn.querySelector('.alecrae-stop-svg').classList.add('alecrae-hidden');
    }

    msg('SET_RECORDING_STATE', { active: false });
    showToast('Processing...');
  }

  // ---------------------------------------------------------------------------
  // Transcribe & enhance
  // ---------------------------------------------------------------------------

  async function processAudio(blob) {
    showToast('Transcribing...');

    try {
      const settings = await msg('GET_SETTINGS');
      const mode = settings.mode || 'general';

      // Transcribe
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');
      formData.append('mode', mode);

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

      // Enhance if enabled
      if (settings.enhance) {
        showToast('Enhancing...');

        const enhanceRes = await fetch(`${API_BASE}/api/enhance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: rawText, mode }),
          credentials: 'include',
        });

        if (enhanceRes.ok) {
          const reader = enhanceRes.body.getReader();
          const decoder = new TextDecoder();
          let enhanced = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
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
                  enhanced += data;
                }
              }
            }
          }

          if (enhanced.trim()) finalText = enhanced;
        }
      }

      // Insert into active field
      insertText(finalText);

      // Save to history
      msg('ADD_HISTORY', {
        entry: { text: finalText, mode, timestamp: Date.now() },
      });

      showToast('Inserted', 2000);
    } catch (err) {
      console.error('AlecRae Voice: processing error', err);
      showToast('Error — please try again.', 3000);
    }
  }

  // ---------------------------------------------------------------------------
  // Text insertion
  // ---------------------------------------------------------------------------

  function insertText(text) {
    const field = activeField;
    if (!field) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text).catch(() => {});
      showToast('Copied to clipboard (no active field).');
      return;
    }

    // Content-editable
    if (field.isContentEditable || field.getAttribute('role') === 'textbox') {
      // Use execCommand for undo-able insertion in rich editors
      field.focus();
      document.execCommand('insertText', false, text);
      return;
    }

    // Standard input/textarea
    field.focus();
    const start = field.selectionStart || 0;
    const end = field.selectionEnd || 0;
    const before = field.value.slice(0, start);
    const after = field.value.slice(end);

    // Use execCommand first (preserves undo stack in many browsers)
    const inserted = document.execCommand('insertText', false, text);
    if (!inserted) {
      // Fallback: direct value set
      field.value = before + text + after;
      field.selectionStart = field.selectionEnd = start + text.length;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  // ---------------------------------------------------------------------------
  // Toast notifications
  // ---------------------------------------------------------------------------

  let toastEl = null;
  let toastTimeout = null;

  function showToast(message, duration = 4000) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'alecrae-toast';
      document.body.appendChild(toastEl);
    }

    toastEl.textContent = message;
    toastEl.classList.add('alecrae-toast-visible');

    clearTimeout(toastTimeout);
    if (duration > 0) {
      toastTimeout = setTimeout(() => {
        toastEl.classList.remove('alecrae-toast-visible');
      }, duration);
    }
  }

  // ---------------------------------------------------------------------------
  // Message listener (from background / popup)
  // ---------------------------------------------------------------------------

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    switch (message.type) {
      case 'TOGGLE_RECORDING':
        // From keyboard shortcut
        if (!activeField) {
          // Try to use the currently focused element
          const focused = document.activeElement;
          if (isTextField(focused)) {
            activeField = focused;
          }
        }
        toggleRecording();
        sendResponse({ ok: true });
        break;

      case 'INSERT_TEXT':
        insertText(message.text);
        sendResponse({ ok: true });
        break;

      default:
        break;
    }
  });

  // ---------------------------------------------------------------------------
  // Helper
  // ---------------------------------------------------------------------------

  function msg(type, extra = {}) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type, ...extra }, resolve);
    });
  }

})();
