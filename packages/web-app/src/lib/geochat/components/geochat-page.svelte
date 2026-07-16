<script lang="ts">
  import { onMount } from 'svelte';

  import HistoryPanel from '$lib/geochat/components/history-panel.svelte';
  import ChatPanel from '$lib/geochat/components/chat-panel.svelte';
  import RecordsPanel from '$lib/geochat/components/records-panel.svelte';
  import { chatStore } from '$lib/geochat/stores/chat-store';

  let {
    lang = 'en',
    alternateLanguageUrl = '',
  }: {
    lang?: 'en' | 'fr';
    alternateLanguageUrl?: string;
  } = $props();

  let historyCollapsed = $state(false);

  onMount(() => {
    chatStore.initializeChat(lang);
  });
</script>

<h1 class="font-custom-style-h1 mt-8 px-5 md:px-0 leading-tight">GeoChat</h1>

<p class="mb-8 mt-3 font-open-sans px-5 md:px-0">Ask questions about GEO.ca datasets in natural language.</p>

<div class="geochat-page px-5 md:px-0" class:history-collapsed={historyCollapsed}>
  <div class="panel history" class:collapsed={historyCollapsed}>
    <div class="panel-header history-header">
      <button
        type="button"
        class="history-toggle
           h-[34px] w-[34px]
           rounded-[0.3125rem]
           bg-custom-16 hover:bg-custom-23
           text-white
           inline-flex items-center justify-center
           cursor-pointer
           transition-colors"
        onclick={() => (historyCollapsed = !historyCollapsed)}
        aria-label={historyCollapsed ? 'Show history' : 'Hide history'}
      >
        {historyCollapsed ? '❯' : '❮'}
      </button>

      {#if !historyCollapsed}
        <h2>Chat History</h2>
      {/if}
    </div>

    <div class="panel-body">
      <div class="panel-content history-content">
        <HistoryPanel />
      </div>
    </div>
  </div>

  <section class="panel chat">
    <div class="panel-header">
      <h2>Chat</h2>
    </div>

    <div class="panel-body">
      <div class="panel-content chat-layout">
        <ChatPanel {lang} {alternateLanguageUrl} showDiveDeeper={false} />
      </div>
    </div>
  </section>

  <div class="panel records">
    <div class="panel-header">
      <h2>Records &amp; Map</h2>
    </div>

    <div class="panel-body">
      <div class="panel-content">
        <RecordsPanel />
      </div>
    </div>
  </div>
</div>

<style>
  .geochat-page {
    display: grid;
    grid-template-columns:
      240px
      minmax(0, 2fr)
      minmax(0, 2fr);
    gap: 1rem;
    height: calc(100vh - 180px);
    align-items: stretch;

    transition: grid-template-columns 250ms ease;
  }

  .geochat-page.history-collapsed {
    grid-template-columns:
      64px
      minmax(0, 2fr)
      minmax(0, 2fr);
  }

  .history,
  .chat,
  .records {
    min-width: 0;
  }

  .history-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
  }

  .history-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.2;
  }

  .history {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .history-content {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;

    opacity: 1;
    transform: translateX(0);

    transition:
      opacity 250ms ease,
      transform 250ms ease;
  }

  .history.collapsed .history-content {
    opacity: 0;
    transform: translateX(-16px);
    pointer-events: none;
  }

  .history-toggle {
    font-size: 20px;
    line-height: 1;
    transition: transform 200ms ease;
  }

  .history-toggle:active {
    transform: scale(0.96);
  }

  .history.collapsed .history-toggle {
    margin: 0;
  }

  .history.collapsed .history-header {
    justify-content: center;
  }

  .history.collapsed .history-toggle {
    margin: 0;
  }

  .panel {
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    background: #fff;
    min-height: 0;
    box-sizing: border-box;
  }

  .panel-header {
    background: #fff;
    padding: 1rem;
    text-align: center;
  }

  .panel-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.2;
  }

  .panel-body {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }

  .history .panel-body,
  .records .panel-body {
    background: #f5f5f5;
  }

  .chat .panel-body {
    background: #fff;
    padding: 0 1rem 0;
  }

  .panel-content {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    background: #fff;
  }

  .chat-layout {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    background: #fff;
  }

  .chat-layout :global(#chat-log-wrapper) {
    flex: 1;
    overflow-y: auto;
    margin: 0 0 8px;
    border: 1px solid #ddd;
    background: #fff;
  }

  .chat-layout :global(#chat-log) {
    padding: 0 10px;
  }

  /*.chat-layout :global(.chat-input) {*/
  /*  margin-top: 8px;*/
  /*}*/
  .chat-layout :global(#chat-input) {
    margin-top: 0;
  }

  .chat-layout :global(#chat-log) {
    padding: 10px 10px 8px;
  }
</style>
