// src/lib/geochat/stores/chat-stores.ts

import { writable } from 'svelte/store';

import { sendChatMessage, loadChatHistory } from '$lib/geochat/api/chat-api';

import { getSessionId, checkSession } from '$lib/geochat/session/chat-session';

import { formatMarkdown, escapeHtml } from '$lib/geochat/utils/markdown';

// ==========================
// Types
// ==========================

export interface ChatMessage {
  role: 'user' | 'bot';
  html: string;
  languageMismatch?: boolean;
  collapsed?: boolean;
  expandable?: boolean;
  isCurrent?: boolean;
}

interface ChatState {
  messages: ChatMessage[];
  isThinking: boolean;
  initialized: boolean;
}

interface HistoryMessage {
  role: string;
  text: string;
}

interface HistorySession {
  history: HistoryMessage[];
}

// ==========================
// Store
// ==========================

function createChatStore() {
  const initialState: ChatState = {
    messages: [],
    isThinking: false,
    initialized: false,
  };

  const { subscribe, update, set } = writable(initialState);

  const WELCOME_MESSAGE = 'welcome message';

  const SESSION_ID = getSessionId();

  // ==========================
  // Collapse Previous Bot Message
  // ==========================

  function collapseLastBotMessage(messages: ChatMessage[]) {
    const botMessages = messages.filter((m) => m.role === 'bot');

    if (botMessages.length === 0) {
      return;
    }

    const lastBotMessage = botMessages[botMessages.length - 1];

    if (lastBotMessage.expandable) {
      lastBotMessage.collapsed = true;
    }

    lastBotMessage.isCurrent = false;
  }

  function collapseHistoryMessages(messages: ChatMessage[]) {
    const botMessages = messages.filter((m) => m.role === 'bot');

    if (botMessages.length === 0) {
      return;
    }

    // collapse all expandable bot messages
    botMessages.forEach((m) => {
      if (m.expandable) {
        m.collapsed = true;
      }

      m.isCurrent = false;
    });

    // keep the newest bot message expanded
    const lastBotMessage = botMessages[botMessages.length - 1];

    lastBotMessage.collapsed = false;
    lastBotMessage.isCurrent = true;
  }

  function toggleMessage(message: ChatMessage) {
    update((state) => {
      const updatedMessages = [...state.messages];

      const msg = updatedMessages.find((m) => m === message);

      if (msg) {
        msg.collapsed = !msg.collapsed;
      }

      return {
        ...state,
        messages: updatedMessages,
      };
    });
  }

  // ==========================
  // Send Message
  // ==========================

  async function sendMessage(
      message: string,
      lang: string
  ){
    const trimmed = message.trim();

    if (!trimmed) return;

    const isWelcomeMessage = trimmed === WELCOME_MESSAGE;

    // add user message
    update((state) => ({
      ...state,
      messages: isWelcomeMessage
          ? state.messages
          : [
            ...state.messages,
            {
              role: 'user',
              html: escapeHtml(trimmed),
            },
          ],
      isThinking: true,
    }));

    try {
      const data = await sendChatMessage(
          SESSION_ID,
          trimmed,
          lang,
      );

      console.log ('data=', data);

      const formatted = formatMarkdown(data.answer);

      update((state) => {
        const updatedMessages = [...state.messages];

        collapseLastBotMessage(updatedMessages);

        const isLongMessage = data.answer.length > 400;

        updatedMessages.push({
          role: 'bot',
          html: formatted,
          languageMismatch: data.type === 'language_mismatch',
          collapsed: false,
          expandable: isLongMessage,
          isCurrent: true,
        });

        return {
          ...state,
          messages: updatedMessages,
          isThinking: false,
        };
      });
    } catch (err) {
      console.error(err);

      update((state) => {
        const updatedMessages = [...state.messages];

        collapseLastBotMessage(updatedMessages);

        updatedMessages.push({
          role: 'bot',
          html: 'Sorry, something went wrong.',
          collapsed: false,
        });

        return {
          ...state,
          messages: updatedMessages,
          isThinking: false,
        };
      });
    }
  }

  // ==========================
  // Load History
  // ==========================

  async function initializeChat(lang: string) {
    update((state) => ({
      ...state,
      isThinking: true,
    }));

    try {
      if (checkSession()) {
        const data = await loadChatHistory(SESSION_ID);

        const historyMessages: ChatMessage[] = [];

        if (data.sessions && Array.isArray(data.sessions)) {
          data.sessions.forEach((session: HistorySession) => {
            if (!Array.isArray(session.history)) return;

            session.history.forEach((msg: HistoryMessage) => {
              if (!msg?.text) return;

              // user
              if (msg.role === 'user' && msg.text !== WELCOME_MESSAGE) {
                historyMessages.push({
                  role: 'user',
                  html: escapeHtml(msg.text),
                });
              }

              // assistant
              else if (msg.role === 'assistant') {
                historyMessages.push({
                  role: 'bot',
                  html: formatMarkdown(msg.text),
                  expandable: msg.text.length > 400,
                  collapsed: msg.text.length > 400,
                });
              }
            });
          });
        }

        collapseHistoryMessages(historyMessages);

        // no history -> welcome message
        if (historyMessages.length === 0) {
          update((state) => ({
            ...state,
            isThinking: false,
            initialized: true,
          }));

          await sendMessage(WELCOME_MESSAGE, lang);

          return;
        }

        update((state) => ({
          ...state,
          messages: historyMessages,
          isThinking: false,
          initialized: true,
        }));
      } else {
        update((state) => ({
          ...state,
          isThinking: false,
          initialized: true,
        }));

        await sendMessage(WELCOME_MESSAGE, lang);
      }
    } catch (err) {
      console.error(err);

      update((state) => ({
        ...state,
        isThinking: false,
        initialized: true,
      }));
    }
  }

  return {
    subscribe,
    sendMessage,
    initializeChat,
    toggleMessage,
    set,
  };
}

// ==========================
// Export Store
// ==========================

export const chatStore = createChatStore();
