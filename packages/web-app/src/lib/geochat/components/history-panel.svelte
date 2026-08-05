<script lang="ts">
  import { chatStore } from '$lib/geochat/stores/chat-store';
  import type { ChatHistory } from '$lib/geochat/session/chat-session';
  import PlusIcon from '$lib/components/icons/plus.svelte';

  let {
    lang,
  }: {
    lang: 'en' | 'fr';
  } = $props();

  function handleNewChat() {
    chatStore.newChat(lang);
  }

  function handleSelectChat(chat: ChatHistory) {
    chatStore.selectChat(chat, lang);
  }
</script>

<div class="history-list">
  <button
    class="text-nowrap
           h-[34px] px-3
           mb-4
           rounded-[0.3125rem]
           font-custom-style-button-3
           shadow-[0rem_0.1875rem_0.375rem_#00000029]
           bg-custom-16 hover:bg-custom-23
           text-white cursor-pointer
           inline-flex items-center"
    onclick={handleNewChat}
  >
    <PlusIcon classes="inline h-4 w-4 mr-2" />
    New Chat
  </button>

  {#each $chatStore.history as chat, i (chat.sessionId)}
    {#if chat.title !== 'New Chat'}
      <button class="history-item" class:active={i === 0} onclick={() => handleSelectChat(chat)}>
        {chat.title}
      </button>
    {/if}
  {/each}
</div>

<style>
  .history-list {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
  }

  .history-item {
    display: block;
    width: 100%;
    margin: 0 0 0.125rem;
    padding: 0.375rem 0.75rem; /* was 0.5rem */

    text-align: left;
    font: inherit;
    color: inherit;

    background: transparent;
    border: none;
    border-radius: 0.3125rem;
    cursor: pointer;

    transition:
      background-color 0.15s ease,
      color 0.15s ease;
  }

  .history-item:hover {
    background: #f3f4f6;
  }

  .history-item:focus-visible {
    outline: 2px solid #005ea5;
    outline-offset: 2px;
  }

  .history-item.active {
    background: #e8f1fb;
    font-weight: 600;
  }
</style>
