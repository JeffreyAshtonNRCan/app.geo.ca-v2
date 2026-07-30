// src/lib/geochat/stores/chat-stores.ts

import { writable, get } from 'svelte/store';

import { sendChatMessage, loadChatSession } from '$lib/geochat/api/chat-api';

import { type ChatHistory, generateSessionId, loadHistory, saveHistory } from '$lib/geochat/session/chat-session';

import { formatMarkdown, escapeHtml } from '$lib/geochat/utils/markdown';

// ==========================
// Types
// ==========================

export interface ChatRecord {
  uuid: string;

  rank: number;

  title_display: string;
  title_en: string;
  title_fr: string;

  description_display: string;
  description_en: string;
  description_fr: string;

  publisher: {
    en: string;
    fr: string;
  };

  geometry_type?: string;

  geometry?: {
    type: string;
    coordinates: number[][][];
  };

  relevance_score: number;
}

export interface ChatMessage {
  role: 'user' | 'bot';
  html: string;

  records?: ChatRecord[];

  languageMismatch?: boolean;
  collapsed?: boolean;
  expandable?: boolean;
  isCurrent?: boolean;
}

interface ChatState {
  messages: ChatMessage[];
  records: ChatRecord[];
  history: ChatHistory[];

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
    records: [],
    history: [],
    isThinking: false,
    initialized: false,
  };

  const store = writable(initialState);

  const { subscribe, update, set } = store;

  const WELCOME_MESSAGE = 'welcome message';
  const ERROR_MESSAGE = {
    en: 'Sorry, something went wrong.',
    fr: 'Désolé, une erreur est survenue.',
  };

  //const SESSION_ID = getSessionId();

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

      // Collapse every expandable bot message and clear current
      updatedMessages.forEach((m) => {
        if (m.role === 'bot') {
          if (m.expandable) {
            m.collapsed = true;
          }
          m.isCurrent = false;
        }
      });

      // Expand the selected message
      message.collapsed = false;
      message.isCurrent = true;

      return {
        ...state,
        messages: updatedMessages,
        records: message.records ?? [],
      };
    });
  }

  // ==========================
  // Send Message
  // ==========================

  async function sendMessage(message: string, lang: string) {
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
      records: [], // clear previous records
      isThinking: true,
    }));

    try {
      const state = get(store);
      const history = [...state.history];
      const activeChat = history[0];

      if (!activeChat.sessionId) {
        activeChat.sessionId = generateSessionId();

        saveHistory(history);

        update((state) => ({
          ...state,
          history,
        }));
      }
      const data = await sendChatMessage(activeChat.sessionId!, trimmed, lang);

      console.log('data=', data);

      // prefer markdown response, fall back to plain text
      // const responseText = data.answer_markdown ?? data.answer ?? '';
      const responseText = data.answer;
      const formatted = formatMarkdown(responseText);

      update((state) => {
        const updatedMessages = [...state.messages];

        collapseLastBotMessage(updatedMessages);

        const isLongMessage = responseText.length > 400;

        updatedMessages.push({
          role: 'bot',
          html: formatted,
          records: data.records,
          languageMismatch: data.type === 'language_mismatch',
          collapsed: false,
          expandable: isLongMessage,
          isCurrent: true,
        });

        // Add this session to history if it isn't already there
        const history = [...state.history];

        const activeChat = history[0];

        if (activeChat) {
          activeChat.title = trimmed.length > 40 ? `${trimmed.slice(0, 40)}...` : trimmed;
        }

        saveHistory(history);

        console.log('history=', history);

        return {
          ...state,
          messages: updatedMessages,
          records: data.records ?? [],
          history,
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
          html: ERROR_MESSAGE[lang as 'en' | 'fr'] ?? ERROR_MESSAGE.en,
          collapsed: false,
        });

        return {
          ...state,
          messages: updatedMessages,
          records: [], // Clear records
          isThinking: false,
        };
      });
    }
  }

  // ==========================
  // Load History
  // ==========================

  async function initializeChat(lang: string) {
    if (get(store).initialized) {
      return;
    }

    const history = loadHistory();

    update((state) => ({
      ...state,
      history,
      isThinking: true,
    }));

    const activeChat = history[0];

    try {
      if (activeChat?.sessionId) {
        const data = await loadChatSession(activeChat.sessionId);

        console.log('active session data=', data);

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
