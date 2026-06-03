<script lang="ts">
  import { tick } from 'svelte';
  import { chatStore } from '$lib/geochat/stores/chat-store';
  import type { ChatMessage } from '$lib/geochat/stores/chat-store';

  import ChatBubbleIcon from '$lib/components/icons/chatbubble.svelte';
  import CloseIcon from '$lib/components/icons/close.svelte';
  import ExpandIcon from '$lib/components/icons/expand.svelte';

  let isOpen = $state(false);
  let isExpanded = $state(false);
  let message = $state('');

  let chatLogWrapper: HTMLDivElement;

  function toggleChat() {
    isOpen = !isOpen;

    if (isOpen && !$chatStore.initialized) {
      chatStore.initializeChat();
    }
  }

  async function handleSend() {
    const trimmed = message.trim();

    if (!trimmed) return;

    message = '';

    await chatStore.sendMessage(trimmed);

  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function toggleMessage(msg: ChatMessage) {
    if (msg.role !== 'bot') {
      return;
    }

    chatStore.toggleMessage(msg);
  }

  let lastBotCount = 0;
  let lastThinking = false;

  $effect(() => {
    const botCount = $chatStore.messages.filter(
            (m) => m.role === 'bot'
    ).length;

    const thinking = $chatStore.isThinking;

    const newBotMessage = botCount > lastBotCount;
    const thinkingStarted = thinking && !lastThinking;

    lastBotCount = botCount;
    lastThinking = thinking;

    if (!newBotMessage && !thinkingStarted) {
      return;
    }

    tick().then(() => {
      if (!chatLogWrapper) {
        return;
      }

      if (thinkingStarted) {
        chatLogWrapper.scrollTop = chatLogWrapper.scrollHeight;
        return;
      }

      const botRows = chatLogWrapper.querySelectorAll('.chat-row.bot');
      const lastBotRow = botRows[botRows.length - 1] as HTMLElement | undefined;

      if (!lastBotRow) {
        return;
      }

      console.log({
        offsetTop: lastBotRow.offsetTop,
        messageHeight: lastBotRow.offsetHeight,
        viewportHeight: chatLogWrapper.clientHeight
      });

      const messageHeight = lastBotRow.offsetHeight;
      const viewportHeight = chatLogWrapper.clientHeight;

      if (messageHeight > viewportHeight) {
        const TOP_PADDING = 16;
        chatLogWrapper.scrollTo({
          top: Math.max(0, lastBotRow.offsetTop - TOP_PADDING),
          behavior: 'smooth'
        });
      } else {
        chatLogWrapper.scrollTop = chatLogWrapper.scrollHeight;
      }
    });
  });
</script>

<div id="chatbot-widget">
  <!-- launcher -->
  <button id="chatbot-toggle" onclick={toggleChat}>
    <ChatBubbleIcon classes="h-4 md:h-5" />
    <span class="label">Ask GeoChat</span>
  </button>

  <!-- panel -->
  <div id="chatbot-panel" class:open={isOpen} class:large={isExpanded}>
    <!-- header -->
    <div class="chat-header">
      <span id="chatbot-title"> Ask GeoChat </span>

      <div class="icons">
        <button
          class="chat-expand"
          aria-label="Large chat"
          title={isExpanded ? 'Small Chat' : 'Large Chat'}
          onclick={() => (isExpanded = !isExpanded)}
        >
          <ExpandIcon classes="h-4 w-4 md:h-5 md:w-5" />
        </button>

        <button class="chat-close" aria-label="Close chat" title="Close chat" onclick={() => (isOpen = false)}>
          <CloseIcon classes="h-4 w-4 md:h-4 md:w-4" />
        </button>
      </div>
    </div>

    <!-- messages -->
    <div id="chat-log-wrapper" bind:this={chatLogWrapper}>
      <div id="chat-log">
        {#each $chatStore.messages as msg, index (index)}
          <div class="chat-row {msg.role}">
            {#if msg.role === 'bot' && msg.expandable && !msg.isCurrent}
              <div
                class="bubble bot-text expandable {msg.collapsed ? 'collapsed' : ''}"
                role="button"
                tabindex="0"
                onclick={() => toggleMessage(msg)}
                onkeydown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleMessage(msg);
                }
              }}
              >
                {@html msg.html}
              </div>

            {:else if msg.role === 'bot'}
              <div class="bubble bot-text">
                {@html msg.html}
              </div>

            {:else}
              <div class="bubble">
                {@html msg.html}
              </div>
            {/if}
          </div>
        {/each}

        {#if $chatStore.isThinking}
          <div class="chat-row bot">
            <div class="bubble bot-text thinking">
              <span class="typing">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          </div>
        {/if}
      </div>
    </div>

    <!-- actions -->
    <div id="chat-actions">
      <button class="dive-deeper-button">
        <ChatBubbleIcon classes="h-4 md:h-5" />
        Dive deeper with GeoChat
      </button>
    </div>

    <!-- input -->
    <div class="chat-input">
      <textarea id="chat-input" bind:value={message} maxlength="500" placeholder="Type a message..." onkeydown={handleKeydown}></textarea>

      <button id="chat-send" class:disabled={!message.trim()} onclick={handleSend}> ➤ </button>
    </div>

    <div id="chat-counter">
      {message.length} / 500
    </div>
  </div>
</div>

<style lang="postcss">
  @reference "../../../app.css";
  /* =========================
   CHAT HEADER
========================= */
  .chat-header {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    padding: 10px;
    background: #5859a2;
    color: #fff;
    font-weight: bold;
    z-index: 10;
  }

  .icons {
    margin-left: auto;
    display: flex;
    gap: 12px;
  }

  .chat-header .icons button {
    background: transparent;
    border: 0;
    color: inherit;
    cursor: pointer;
    padding: 0;
  }

  /* =========================
     CHAT WIDGET
  ========================= */
  #chatbot-widget {
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 20000;
  }

  /*#chatbot-toggle {*/
  /*    width: 56px;*/
  /*    height: 56px;*/
  /*    border-radius: 50%;*/
  /*    border: 0;*/
  /*    background: #5859a2;*/
  /*    color: #fff;*/
  /*    cursor: pointer;*/
  /*    font-size: 20px;*/
  /*}*/

  #chatbot-toggle {
    position: fixed;
    right: 20px;
    bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;

    height: 42px;
    padding: 0 16px;

    border-radius: 28px; /* pill shape instead of circle */
    border: 0;

    background: #5859a2;
    color: #fff;
    cursor: pointer;

    font-size: 16px;
    white-space: nowrap;
  }

  #chatbot-toggle .label {
    font-size: 16px;
  }

  #chatbot-toggle {
    transition: background 0.2s ease;
  }

  #chatbot-toggle:hover {
    background: #130944;
  }

  #chatbot-toggle:active {
    transform: scale(0.97);
  }

  #chatbot-panel {
    position: fixed;
    right: 20px;
    bottom: 70px;

    width: 420px;
    height: 65dvh;

    min-height: 380px;
    max-height: calc(100dvh - 100px);

    background: #fff;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

    display: none;
    flex-direction: column;
    overflow: hidden;

    z-index: 9999;
  }

  #chatbot-panel.large {
    width: 580px;
    height: calc(100dvh - 100px);
  }

  #chatbot-panel.open {
    display: flex;
  }

  /* =========================
     CHAT LOG
  ========================= */
  #chat-log-wrapper {
    flex: 1;
    overflow-y: auto;
    margin: 10px 0;
    border: 1px solid #eee;
    background: #fafafa;
    min-height: 0;
    scroll-behavior: smooth;
    color: #5b58a0;
  }

  #chat-log {
    padding: 10px;
  }

  /* scrollbar */
  #chat-log-wrapper::-webkit-scrollbar {
    width: 10px;
  }
  #chat-log-wrapper::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  #chat-log-wrapper::-webkit-scrollbar-thumb {
    background: #5b58a0;
  }
  #chat-log-wrapper::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* =========================
     CHAT INPUT
  ========================= */
  .chat-input {
    display: flex;
    flex: 0 0 auto;
    border-top: 1px solid #eee;
  }

  #chat-input {
    flex: 1;
    border: none;
    outline: none;
    resize: none;
    overflow: hidden;
    height: 36px;
    line-height: 1.4;
    padding: 6px 8px;
    background: transparent;
  }

  .chat-input button {
    border: 0;
    background: none;
    padding: 8px 12px;
    cursor: pointer;
  }

  /* send button */
  #chat-send {
    color: #fff;
    background: #ccc;
    border-radius: 5px;
  }

  #chat-send:not(.disabled) {
    background: #5859a2;
  }

  #chat-send.disabled {
    opacity: 0.4;
    pointer-events: none;
  }

  /* counter */
  #chat-counter {
    font-size: 12px;
    color: #888;
    text-align: right;
    margin-top: 3px;
  }

  /* =========================
     CHAT ROWS
  ========================= */
  .chat-row {
    display: flex;
    width: 100%;
    margin-bottom: 10px;
    font-size: 14px;
    animation: chatFade 0.2s ease;
    scroll-margin-top: 8px;
  }

  .chat-row.user {
    justify-content: flex-end;
  }

  .chat-row.bot {
    justify-content: flex-start;
  }

  .chat-row.bot.thinking {
    align-items: center;
    gap: 6px;
    opacity: 0.8;
  }

  /* message bubble */
  .chat-row > div {
    padding: 8px 12px;
    border-radius: 10px;
    line-height: 1.5;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  /* user bubble */
  .chat-row.user > div {
    max-width: 65%;
    background: #f3f7ff;
    color: #172554;
    border: 1px solid #c7d7ff;
    border-bottom-left-radius: 4px;
  }

  /* bot bubble */
  .chat-row.bot > div {
    max-width: 95%;
    width: fit-content;
    background: #f9fafb;
    color: #111827;
    border-bottom-right-radius: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  }

  /* =========================
     BOT TEXT / MARKDOWN
  ========================= */
  .chat-row.bot .bot-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow: hidden;
    position: relative;
  }

  .bot-answer {
    width: 100%;
  }

  .bot-text :global(p) {
    margin: 6px 0;
    transition: max-height 0.2s ease;
  }

  .bot-text :global(ul) {
    margin: 8px 0;
    padding-left: 18px;
  }

  .bot-text :global(li) {
    margin-bottom: 4px;
  }

  .bot-text :global(a) {
    @apply text-custom-8 underline;
  }

  .bot-text :global(a:hover) {
    @apply no-underline;
  }

  .bot-text:global(.expandable) {
    cursor: pointer;
  }

  .bot-text:global(.collapsed) {
    max-height: 7.5rem;
    overflow: hidden;
    position: relative;
  }

  /* collapsed fade */
  .bot-text:global(.collapsed)::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    background: linear-gradient(
            to bottom,
            rgba(229, 231, 235, 0),
            rgba(229, 231, 235, 1)
    );
  }

  .bot-text:not(:global(.collapsed)) {
    max-height: none;
  }

  /* =========================
     TYPING INDICATOR
  ========================= */
  .typing {
    display: inline-flex;
    gap: 4px;
  }

  .typing span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #555;
    animation: typingBounce 1.4s infinite ease-in-out;
  }

  .typing span:nth-child(2) {
    animation-delay: 0.2s;
  }
  .typing span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typingBounce {
    0%,
    80%,
    100% {
      transform: scale(0.7);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* =========================
     ACTIONS
  ========================= */
  #chat-actions {
    border-top: 1px solid #eee;
    padding: 8px 10px;
    background: #fff;
    display: flex;
    justify-content: center;
  }

  #chat-actions .dive-deeper-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #535aa4;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    padding: 8px 20px;
    gap: 8px;
    border: none;
    outline: none;
    box-shadow: none;
  }

  #chat-actions .dive-deeper-button:hover {
    background: #130944;
  }

  /* =========================
     ANIMATIONS
  ========================= */
  @keyframes chatFade {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  /* =========================
     MOBILE
  ========================= */
  @media (max-width: 768px) {
    #chatbot-panel {
      width: 95vw;
      right: 2.5vw;
      height: 70dvh;
    }
  }

  @media (max-width: 480px) {
    #chatbot-toggle {
      width: 56px;
      padding: 0;
      justify-content: center;
      border-radius: 50%;
    }

    #chatbot-toggle .label {
      display: none;
    }
  }
</style>
