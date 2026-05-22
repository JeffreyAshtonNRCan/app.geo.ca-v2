<script lang="ts">
  import { onMount } from 'svelte';

  import { chatStore } from '$lib/geochat/stores/chat-store';

  let message = '';

  $: state = $chatStore;

  // ==========================
  // Init
  // ==========================

  onMount(() => {
    if (!state.initialized) {
      chatStore.initializeChat();
    }
  });

  // ==========================
  // Send Message
  // ==========================

  async function handleSend() {
    const trimmed = message.trim();

    if (!trimmed) return;

    await chatStore.sendMessage(trimmed);

    message = '';
  }

  // ==========================
  // Enter Key
  // ==========================

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      handleSend();
    }
  }
</script>

<div class="chat-panel">
  <!-- Messages -->

  <div class="messages">
    {#each state.messages as msg}
      <div class="chat-row {msg.role}">
        <div class="bubble">
          {@html msg.html}
        </div>
      </div>
    {/each}

    <!-- Thinking -->

    {#if state.isThinking}
      <div class="chat-row bot">
        <div class="bubble thinking">Thinking...</div>
      </div>
    {/if}
  </div>

  <!-- Input -->

  <div class="chat-input">
    <textarea bind:value={message} rows="1" placeholder="Type a message..." on:keydown={handleKeydown} />

    <button on:click={handleSend} disabled={!message.trim()}> Send </button>
  </div>
</div>

<style>
  .chat-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  .chat-row {
    display: flex;
    margin-bottom: 1rem;
  }

  .chat-row.user {
    justify-content: flex-end;
  }

  .chat-row.bot {
    justify-content: flex-start;
  }

  .bubble {
    max-width: 80%;
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    background: #f0f0f0;
  }

  .chat-row.user .bubble {
    background: #dbeafe;
  }

  .thinking {
    opacity: 0.7;
    font-style: italic;
  }

  .chat-input {
    display: flex;
    gap: 0.5rem;
    padding: 1rem;
    border-top: 1px solid #ddd;
  }

  textarea {
    flex: 1;
    resize: none;
  }
</style>
