// src/lib/geochat/api/chat-api.ts

const CHAT_API_URL = 'https://2qvn83jteg.execute-api.ca-central-1.amazonaws.com/staging/chat';

const CHAT_HISTORY_URL = 'https://2qvn83jteg.execute-api.ca-central-1.amazonaws.com/staging/chathistory';

export async function sendChatMessage(
    sessionId: string,
    message: string,
    lang: string
) {
  const response = await fetch(CHAT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      message,
      lang,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.json();
}

export async function loadChatHistory(sessionId: string, limit = 25) {
  const params = new URLSearchParams({
    session_id: sessionId,
    limit: String(limit),
  });

  const response = await fetch(`${CHAT_HISTORY_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return await response.json();
}
