// AlecRae Voice — Background Service Worker
// Manages auth state, recording state, and keyboard shortcuts.

const API_BASE = 'https://alecrae.app';

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

async function getAuthToken() {
  const data = await chrome.storage.local.get('alecrae_token');
  return data.alecrae_token || null;
}

async function setAuthToken(token) {
  await chrome.storage.local.set({ alecrae_token: token });
}

async function clearAuth() {
  await chrome.storage.local.remove(['alecrae_token', 'alecrae_settings']);
}

// ---------------------------------------------------------------------------
// Recording state (shared across popup + content script)
// ---------------------------------------------------------------------------

let recordingState = {
  active: false,
  tabId: null,
};

function getRecordingState() {
  return { ...recordingState };
}

function setRecordingState(active, tabId) {
  recordingState = { active, tabId: active ? tabId : null };
}

// ---------------------------------------------------------------------------
// Keyboard shortcut handler
// ---------------------------------------------------------------------------

chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-recording') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    const token = await getAuthToken();
    if (!token) {
      // Not logged in — open the popup instead
      return;
    }

    chrome.tabs.sendMessage(tab.id, {
      type: 'TOGGLE_RECORDING',
    });
  }
});

// ---------------------------------------------------------------------------
// Message router — popup and content scripts communicate through here
// ---------------------------------------------------------------------------

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_AUTH':
      getAuthToken().then((token) => sendResponse({ token }));
      return true; // async

    case 'SET_AUTH':
      setAuthToken(message.token).then(() => sendResponse({ ok: true }));
      return true;

    case 'LOGOUT':
      clearAuth().then(() => sendResponse({ ok: true }));
      return true;

    case 'GET_RECORDING_STATE':
      sendResponse(getRecordingState());
      return false;

    case 'SET_RECORDING_STATE':
      setRecordingState(message.active, message.tabId || sender.tab?.id);
      sendResponse({ ok: true });
      return false;

    case 'GET_SETTINGS':
      chrome.storage.local.get('alecrae_settings', (data) => {
        sendResponse(data.alecrae_settings || {
          mode: 'general',
          autoInsert: true,
          enhance: false,
        });
      });
      return true;

    case 'SET_SETTINGS':
      chrome.storage.local.set({ alecrae_settings: message.settings }).then(() => {
        sendResponse({ ok: true });
      });
      return true;

    case 'GET_HISTORY':
      chrome.storage.local.get('alecrae_history', (data) => {
        sendResponse(data.alecrae_history || []);
      });
      return true;

    case 'ADD_HISTORY':
      chrome.storage.local.get('alecrae_history', (data) => {
        const history = data.alecrae_history || [];
        history.unshift(message.entry);
        const trimmed = history.slice(0, 5);
        chrome.storage.local.set({ alecrae_history: trimmed }).then(() => {
          sendResponse({ ok: true });
        });
      });
      return true;

    default:
      return false;
  }
});
