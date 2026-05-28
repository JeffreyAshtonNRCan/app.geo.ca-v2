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
  collapsed?: boolean;
}

interface ChatState {
  messages: ChatMessage[];
  isThinking: boolean;
  initialized: boolean;
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

    lastBotMessage.collapsed = true;
  }

  // ==========================
  // Send Message
  // ==========================

  async function sendMessage(message: string) {
    const trimmed = message.trim();

    if (!trimmed) return;

    // add user message
    update((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          role: 'user',
          html: escapeHtml(trimmed),
        },
      ],
      isThinking: true,
    }));

    try {
      const data = await sendChatMessage(SESSION_ID, trimmed);

      const formatted = formatMarkdown(data.answer);

      update((state) => {
        const updatedMessages = [...state.messages];

        collapseLastBotMessage(updatedMessages);

        updatedMessages.push({
          role: 'bot',
          html: formatted,
          collapsed: false,
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

  async function initializeChat() {
    update((state) => ({
      ...state,
      isThinking: true,
    }));

    try {
      if (checkSession()) {
        const data = await loadChatHistory(SESSION_ID);

        const historyMessages: ChatMessage[] = [];

        if (data.sessions && Array.isArray(data.sessions)) {
          data.sessions.forEach((session: any) => {
            if (!Array.isArray(session.history)) return;

            session.history.forEach((msg: any) => {
              if (!msg?.text) return;

              // user
              if (msg.role === 'user' && msg.text !== 'welcome message') {
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
                });
              }
            });
          });
        }

        // no history -> welcome
        if (historyMessages.length === 0) {
          update((state) => ({
            ...state,
            isThinking: false,
            initialized: true,
          }));

          await sendMessage('welcome message');

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

        await sendMessage('welcome message');
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
    set,
  };
}

// ==========================
// Export Store
// ==========================

export const chatStore = createChatStore();
