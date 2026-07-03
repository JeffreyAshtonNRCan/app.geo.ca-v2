<script lang="ts">
  import HistoryPanel from '$lib/geochat/components/history-panel.svelte';
  import ChatPanel from '$lib/geochat/components/chat-panel.svelte';
  import RecordsPanel from '$lib/geochat/components/records-panel.svelte';
</script>

<div class="geochat-page">
  <aside class="history">
    <HistoryPanel />
  </aside>

  <div class="chat">
    <div class="chat-panel">
      <ChatPanel />
    </div>
  </div>

  <aside class="records">
    <RecordsPanel />
  </aside>
</div>

<style>
  .geochat-page {
    display: grid;
    grid-template-columns: 320px 1fr 380px;
    gap: 1rem;

    height: calc(100vh - 180px);

    align-items: stretch;
  }

  .history,
  .chat,
  .records {
    min-height: 0;
    height: 100%;
  }

  .chat {
    display: flex;
    width: 100%;
  }

  .chat-panel {
    display: flex;
    flex-direction: column;

    flex: 1 1 auto;

    min-width: 0;
    min-height: 0;

    overflow: hidden;
  }

  .chat-panel :global(#chat-log-wrapper) {
    flex: 1;
    margin: 0;
    border: none;
  }

  .chat-panel :global(#chat-log) {
    padding: 12px 10px 10px;
  }

  .history,
  .records {
    border: 1px solid #ddd;
  }
</style>
