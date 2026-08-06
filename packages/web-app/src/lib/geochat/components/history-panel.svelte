<script lang="ts">
  import { chatStore } from '$lib/geochat/stores/chat-store';
  import type { ChatHistory } from '$lib/geochat/session/chat-session';
  import PlusIcon from '$lib/components/icons/plus.svelte';
  import GarbageCanIcon from '$lib/components/icons/garbage-can.svelte';

  let {
    lang,
  }: {
    lang: 'en' | 'fr';
  } = $props();

  let deleteSessionId: string | undefined;

  function handleNewChat() {
    chatStore.newChat(lang);
  }

  function handleSelectChat(chat: ChatHistory) {
    chatStore.selectChat(chat, lang);
  }

  function handleDeleteClick(chat: ChatHistory) {
    deleteSessionId = chat.sessionId;
    console.log('deleteSessionId=', deleteSessionId);
  }

  function handleConfirmDelete(chat: ChatHistory) {
    console.log('confirm delete');
    chatStore.deleteChat(chat, lang);
    deleteSessionId = undefined;
  }

  function handleCancelDelete() {
    console.log('cancel delete');
    deleteSessionId = undefined;
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
      <div class="history-item" class:active={i === 0}>
        <button class="history-select" onclick={() => handleSelectChat(chat)}>
          {chat.title}
        </button>

        {#if deleteSessionId === chat.sessionId}
          <!--          <button class="history-confirm" onclick={() => handleConfirmDelete(chat)}> ✓ </button>-->

          <!--          <button class="history-confirm" onclick={handleCancelDelete}> ✕ </button>-->
          <span style="color:red;font-weight:bold;">DELETE?</span>
        {:else}
          <button
            class="history-delete"
            onclick={(e) => {
              e.stopPropagation();
              handleDeleteClick(chat);
            }}
          >
            <GarbageCanIcon classes="w-4 h-4" />
          </button>
        {/if}
      </div>
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
    display: flex;
    align-items: center;
    border-radius: 0.3125rem;

    transition: background-color 0.15s ease;
  }

  .history-item:hover {
    background: #f3f4f6;
  }

  .history-item.active {
    background: #e8f1fb;
  }

  .history-select {
    flex: 1;
    min-width: 0;

    margin: 0;
    padding: 0.375rem 0.75rem;

    text-align: left;
    font: inherit;
    color: inherit;

    background: transparent;
    border: none;
    cursor: pointer;
  }

  .history-select:focus-visible {
    outline: 2px solid #005ea5;
    outline-offset: 2px;
  }

  .history-item.active .history-select {
    font-weight: 600;
  }

  .history-select {
    flex: 1;

    margin: 0;
    padding: 0.375rem 0.75rem;

    text-align: left;
    font: inherit;
    color: inherit;

    background: transparent;
    border: none;
    cursor: pointer;
  }

  .history-select:focus-visible {
    outline: 2px solid #005ea5;
    outline-offset: 2px;
  }

  .history-item.active .history-select {
    font-weight: 600;
  }

  .history-delete {
    opacity: 0;
    pointer-events: none;

    margin-right: 0.5rem;

    background: transparent;
    border: none;
    cursor: pointer;

    transition: opacity 0.15s ease;
  }

  .history-item:hover .history-delete {
    opacity: 1;
    pointer-events: auto;
  }

  .history-confirm {
    margin-right: 0.25rem;
    background: transparent;
    border: none;
    cursor: pointer;
  }
</style>
