import { browser } from '$app/environment';

const SESSION_ID_KEY = 'geobot_session_id';
const SESSION_STARTED_KEY = 'geobot_session_started';

export function getSessionId(): string {
  if (!browser) {
    return '';
  }

  let sessionId: string | null = localStorage.getItem(SESSION_ID_KEY);

  if (!sessionId) {
    sessionId = generateSessionId();

    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  return sessionId;
}

function generateSessionId(): string {
  if (browser && window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;

    const v = c === 'x' ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
}

export function checkSession(): boolean {
  if (!browser) {
    return false;
  }

  return !!localStorage.getItem(SESSION_ID_KEY);
}

export function isNewSession(): boolean {
  if (!browser) {
    return true;
  }

  return !localStorage.getItem(SESSION_STARTED_KEY);
}

export function markSessionStarted(): void {
  if (!browser) {
    return;
  }

  localStorage.setItem(SESSION_STARTED_KEY, '1');
}
