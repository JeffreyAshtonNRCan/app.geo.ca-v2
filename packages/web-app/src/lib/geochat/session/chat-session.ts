const browser = typeof window !== 'undefined';

const SESSION_ID_KEY = 'geochat_session_id';
const SESSION_STARTED_KEY = 'geochat_session_started';

const HISTORY_KEY = 'geochat-history';

export interface ChatHistory {
  sessionId?: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
}

export function loadHistory(): ChatHistory[] {
  const json = localStorage.getItem(HISTORY_KEY);

  if (!json) {
    return [];
  }

  try {
    return JSON.parse(json) as ChatHistory[];
  } catch (err) {
    console.error('Unable to load chat history', err);

    localStorage.removeItem(HISTORY_KEY);

    return [];
  }
}

export function saveHistory(history: ChatHistory[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

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
