<script lang="ts">
  import { draggable } from '$lib/geochat/utils/draggable';

  import ChatPanel from '$lib/geochat/components/chat-panel.svelte';
  import ExpandIcon from '$lib/components/icons/expand.svelte';
  import CloseIcon from '$lib/components/icons/close.svelte';
  import ChatBubbleIcon from '$lib/components/icons/chatbubble.svelte';
  import { chatStore } from '$lib/geochat/stores/chat-store';
  import { tick } from 'svelte';

  let {
    lang = 'en',
    alternateLanguageUrl = '',
    onDiveDeeper,
  }: {
    lang?: 'en' | 'fr';
    alternateLanguageUrl?: string;
    onDiveDeeper?: () => void;
  } = $props();

  let chatbotPanel = $state<HTMLDivElement | undefined>(undefined);

  let isOpen = $state(false);
  let isExpanded = $state(false);

  function toggleChat() {
    isOpen = !isOpen;

    if (isOpen) {
      chatStore.initializeChat(lang);
    }
  }

  async function toggleExpanded() {
    isExpanded = !isExpanded;

    await tick();

    if (chatbotPanel) {
      chatbotPanel.removeAttribute('style');
    }
  }

  $effect(() => {
    if (!isOpen && chatbotPanel) {
      chatbotPanel.style.left = '';
      chatbotPanel.style.top = '';
      chatbotPanel.style.right = '';
      chatbotPanel.style.bottom = '';
    }
  });
</script>

<div id="chatbot-widget">
  <!-- launcher -->
  <button id="chatbot-toggle" class="font-custom-style-button-1" onclick={toggleChat}>
    <ChatBubbleIcon classes="h-4 md:h-5" />
    <span class="label">
      {lang === 'fr' ? 'Demandez au GéoChat' : 'Ask GeoChat'}
    </span>
  </button>
</div>

<!-- panel -->
{#if isOpen}
  <div id="chatbot-panel" bind:this={chatbotPanel} class:large={isExpanded} role="dialog" aria-labelledby="chatbot-title">
    <!-- header -->
    <div class="chat-header">
      <div class="drag-handle" use:draggable>
        <span id="chatbot-title">
          {lang === 'fr' ? 'Demandez au GéoChat' : 'Ask GeoChat'}
        </span>
      </div>
      <div class="icons">
        <button
          class="chat-expand"
          aria-label={lang === 'fr'
            ? isExpanded
              ? 'Réduire le clavardage'
              : 'Agrandir le clavardage'
            : isExpanded
              ? 'Switch to small chat'
              : 'Switch to large chat'}
          title={lang === 'fr' ? (isExpanded ? 'Petit clavardage' : 'Grand clavardage') : isExpanded ? 'Small Chat' : 'Large Chat'}
          onclick={toggleExpanded}
        >
          <ExpandIcon classes="h-4 w-4 md:h-5 md:w-5" />
        </button>

        <button
          class="chat-close"
          aria-label={lang === 'fr' ? 'Fermer le clavardage' : 'Close chat'}
          title={lang === 'fr' ? 'Fermer' : 'Close'}
          onclick={() => (isOpen = false)}
        >
          <CloseIcon classes="h-4 w-4 md:h-4 md:w-4" />
        </button>
      </div>
    </div>
    <ChatPanel {lang} {alternateLanguageUrl} showDiveDeeper={true} {onDiveDeeper} />
  </div>
{/if}

<style lang="postcss">
  @reference "../../../app.css";
  /* =========================
    CHAT WIDGET
    ========================= */
  #chatbot-widget {
    z-index: 10020;
  }

  /*  Background color is defined here because the standalone WordPress build does
  not always generate custom Tailwind utility classes */
  #chatbot-toggle {
    position: fixed;
    right: 20px;
    bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;

    height: 42px;
    padding: 0 16px;

    border-radius: 28px;
    border: 0;

    color: #fff;
    background: #5859a2;
    cursor: pointer;

    white-space: nowrap;

    transition: background 0.2s ease;
  }

  #chatbot-toggle:hover {
    background: #130944;
  }

  #chatbot-toggle:active {
    transform: scale(0.97);
  }

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

  .chat-header button {
    cursor: pointer;
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

  .chat-header .chat-expand :global(svg) {
    width: 20px;
    height: 20px;
    display: block;
  }

  .chat-header .chat-close :global(svg) {
    width: 16px;
    height: 16px;
    display: block;
  }

  .drag-handle {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    cursor: grab;
    user-select: none;
    touch-action: none;
  }

  .drag-handle:active {
    cursor: grabbing;
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

    display: flex;
    flex-direction: column;
    overflow: hidden;

    z-index: 10020;
  }

  #chatbot-panel.large {
    width: 580px;
    height: calc(100dvh - 100px);

    top: 20px;
    bottom: auto;
  }

  /* =========================
       MOBILE
    ========================= */
  @media (max-width: 768px) {
    #chatbot-panel {
      /*left: auto !important;*/
      /*top: auto !important;*/
      bottom: 70px !important;

      width: 85vw;
      right: 2.5vw;
      height: 70dvh;
    }

    #chatbot-panel.large {
      width: calc(100vw - 20px);
      right: 10px;
    }
  }

  /*@media (max-width: 480px) {*/
  @media (max-width: 680px) {
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
