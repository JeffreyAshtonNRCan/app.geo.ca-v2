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
  records?: ChatRecord[];
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

  const WELCOME_MESSAGE = {
    en: `## Hello!

I'm excited to help you explore the world of geospatial information.
What would you like to know or discover today?`,

    fr: `## Bonjour !

Bienvenue sur GEO.ca ! Je suis ravi de vous accueillir.

Si vous cherchez des informations géospatiales ou des données pour un projet, n'hésitez pas à me poser des questions ou à explorer nos ressources.
Je suis là pour vous aider !`,
  };

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

  async function sendMessage(message: string, lang: 'en' | 'fr') {
    const trimmed = message.trim();

    if (!trimmed) return;

    const isWelcomeMessage = trimmed === WELCOME_MESSAGE[lang];

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

        if (activeChat && activeChat.title === 'New Chat') {
          activeChat.title = trimmed.length > 40 ? `${trimmed.slice(0, 40)}...` : trimmed;

          saveHistory(history);
        }

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
          html: ERROR_MESSAGE[lang],
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

  async function initializeChat(lang: 'en' | 'fr') {
    if (get(store).initialized) {
      return;
    }

    let history = loadHistory();

    if (history.length === 0) {
      history = newChat();
    }

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
              if (msg.role === 'user') {
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
                  records: msg.records,
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
          showWelcomeMessage(lang);
          return;
        }

        //await sendMessage(WELCOME_MESSAGE, lang);

        const currentBot = historyMessages.find((m) => m.isCurrent);

        update((state) => ({
          ...state,
          messages: historyMessages,
          records: currentBot?.records ?? [],
          isThinking: false,
          initialized: true,
        }));
      } else {
        // Brand new chat
        showWelcomeMessage(lang);
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

  function newChat(): ChatHistory[] {
    const history = [...get(store).history];

    // Already started a new chat
    if (history[0]?.title === 'New Chat') {
      return history;
    }

    history.unshift({
      title: 'New Chat',
    });

    saveHistory(history);

    update((state) => ({
      ...state,
      history,
      messages: [],
      records: [],
    }));

    return history;
  }

  function showWelcomeMessage(lang: 'en' | 'fr') {
    update((state) => {
      const messages = [...state.messages];

      messages.push({
        role: 'bot',
        html: formatMarkdown(WELCOME_MESSAGE[lang]),
        records: [],
        expandable: false,
        collapsed: false,
        isCurrent: true,
      });

      return {
        ...state,
        messages,
        isThinking: false,
        initialized: true,
      };
    });
  }

  return {
    subscribe,
    sendMessage,
    initializeChat,
    toggleMessage,
    newChat,
    set,
  };
}

// ==========================
// Export Store
// ==========================

export const chatStore = createChatStore();
