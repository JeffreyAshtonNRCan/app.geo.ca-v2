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
    grid-template-columns: 320px minmax(0, 1fr) 380px;
    gap: 1rem;

    width: 100%;
    min-width: 0;

    height: calc(100vh - 180px);
  }

  .history,
  .chat,
  .records {
    min-width: 0;
    min-height: 0;
  }

  .chat {
    display: flex;
    width: 100%;
  }

  .chat-panel {
    display: flex;
    flex: 1 1 auto;

    min-width: 0;
    min-height: 0;

    overflow: hidden;
  }

  .chat-panel > * {
    flex: 1 1 auto;
    min-width: 0;
    min-height: 0;
  }

  .history,
  .records {
    border: 1px solid #ddd;
  }
</style>
