<script lang="ts">
  import { tick } from 'svelte';
  import { chatStore } from '$lib/geochat/stores/chat-store';
  import type { ChatMessage } from '$lib/geochat/stores/chat-store';
  import ChatBubbleIcon from '$lib/components/icons/chatbubble.svelte';
  import { DOWNLOAD_ICON_URI } from '$lib/geochat/utils/download-icon';

  let {
    lang = 'en',
    alternateLanguageUrl = '',
    showDiveDeeper = false,
  }: {
    lang?: 'en' | 'fr';
    alternateLanguageUrl?: string;
    showDiveDeeper?: boolean;
  } = $props();

  let message = $state('');
  let chatLogWrapper: HTMLDivElement;

  const UI_TEXT = {
    en: {
      diveDeeper: 'Dive deeper with GeoChat',
    },
    fr: {
      diveDeeper: 'Approfondissez avec GéoChat',
    },
  } as const;

  // const alternateLanguageUrl = $derived.by(() => {
  //   const pathname =
  //     page.params.lang === 'fr-ca'
  //             ? page.url.pathname.replace('/fr-ca/', '/en-ca/')
  //             : page.url.pathname.replace('/en-ca/', '/fr-ca/');
  //
  //   return `${pathname}${page.url.search}${page.url.hash}`;
  // });

  function openFullGeoChat() {
    window.location.href = lang === 'fr' ? '/fr-ca/geochat' : '/en-ca/geochat';
  }
  async function handleSend() {
    const text = message;

    message = '';

    await chatStore.sendMessage(text, lang);
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
    const botCount = $chatStore.messages.filter((m) => m.role === 'bot').length;

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

      const messageHeight = lastBotRow.offsetHeight;
      const viewportHeight = chatLogWrapper.clientHeight;

      if (messageHeight > viewportHeight) {
        const TOP_PADDING = 16;

        const wrapperRect = chatLogWrapper.getBoundingClientRect();
        const rowRect = lastBotRow.getBoundingClientRect();

        const scrollAmount = chatLogWrapper.scrollTop + (rowRect.top - wrapperRect.top) - TOP_PADDING;

        chatLogWrapper.scrollTo({
          top: scrollAmount,
          behavior: 'smooth',
        });
      } else {
        chatLogWrapper.scrollTop = chatLogWrapper.scrollHeight;
      }
    });
  });
</script>

<!--
  Download links are rendered inside {@html msg.html}, so we cannot use a Svelte
  icon component.  Download icon used by a[data-download='true']::after. Embedded as a data URI
     to keep the WordPress widget self-contained (no external SVG file required). -->
<!-- messages -->
<div id="chat-log-wrapper" bind:this={chatLogWrapper}>
  <div id="chat-log" style={`--download-icon-uri: url("${DOWNLOAD_ICON_URI}")`}>
    {#each $chatStore.messages as msg, index (index)}
      <div class="chat-row {msg.role}">
        {#if msg.role === 'bot' && msg.languageMismatch}
          <div class="bubble bot-text">
            {lang.startsWith('fr')
              ? 'Cette question a été posée dans une langue différente de la page actuelle.'
              : 'This question was asked in French.  You are currently using the English GeoChat.'}

            <a
              href={alternateLanguageUrl}
              onclick={(e) => {
                e.preventDefault();
                window.location.assign(alternateLanguageUrl);
              }}
            >
              {lang.startsWith('fr') ? 'Click here for the English version' : 'Cliquez ici pour la version française'}
            </a>
          </div>
        {:else if msg.role === 'bot' && msg.expandable && !msg.isCurrent}
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

{#if showDiveDeeper}
  <div id="chat-actions">
    <button class="dive-deeper-button" onclick={openFullGeoChat} disabled>
      <ChatBubbleIcon classes="h-4 w-4 md:h-5 md:w-5" />
      {UI_TEXT[lang].diveDeeper}
    </button>
  </div>
{/if}

<!-- input -->
<div class="chat-input">
  <textarea id="chat-input" bind:value={message} maxlength="100" placeholder="Type a message..." onkeydown={handleKeydown}></textarea>

  <button id="chat-send" class:disabled={!message.trim()} onclick={handleSend}> ➤</button>
</div>

<div id="chat-counter">
  {message.length} / 100
</div>

<style lang="postcss">
  @reference "../../../app.css";

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
    font-weight: 600;
  }

  .bot-text :global(a:hover) {
    @apply no-underline;
  }

  .bot-text :global(a[data-download='true']) {
    white-space: nowrap !important;
    display: inline-flex !important;
    align-items: center;
  }

  .bot-text :global(a[data-download='true'])::after {
    content: '';
    display: inline-block;
    width: 1.5em;
    height: 1.5em;
    margin-left: 0.2em;
    vertical-align: -0.375em;

    background-color: currentColor;

    -webkit-mask: var(--download-icon-uri) center/contain no-repeat;
    mask: var(--download-icon-uri) center/contain no-repeat;
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
    background: linear-gradient(to bottom, rgba(229, 231, 235, 0), rgba(229, 231, 235, 1));
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
</style>
