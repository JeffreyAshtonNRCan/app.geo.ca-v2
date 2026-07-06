<script lang="ts">
  import HistoryPanel from '$lib/geochat/components/history-panel.svelte';
  import ChatPanel from '$lib/geochat/components/chat-panel.svelte';
  import RecordsPanel from '$lib/geochat/components/records-panel.svelte';
</script>

<div class="geochat-page">
  <aside class="panel history">
    <div class="panel-header">
      <h2>History</h2>
    </div>

    <div class="panel-content">
      <HistoryPanel />
    </div>
  </aside>

  <section class="panel chat">
    <div class="panel-header">
      <h2>GeoChat</h2>
    </div>

    <div class="panel-content chat-panel">
      <ChatPanel />
    </div>
  </section>

  <aside class="panel records">
    <div class="panel-header">
      <h2>Records &amp; Map</h2>
    </div>

    <div class="panel-content">
      <RecordsPanel />
    </div>
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

  .panel {
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    background: #fff;
    min-height: 0;
  }

  .panel-header {
    background: #fff;
    padding: 1rem;
    border-bottom: 1px solid #ddd;
    text-align: center;
  }

  .panel-content {
    flex: 1;
    min-height: 0;

    display: flex;
    flex-direction: column;
  }

  .history .panel-content,
  .records .panel-content {
    background: #f5f5f5;
  }

  .history :global(.history-list),
  .records :global(.records-list),
  .records :global(.map) {
    background: #fff;
  }

  .chat .panel-content {
    background: #fff;
  }

  .chat-panel {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
  }

  .chat-panel :global(#chat-log-wrapper) {
    flex: 1;
    overflow-y: auto;
    margin: 0 0 8px;
    border: none;
  }

  .chat-panel :global(#chat-log) {
    padding: 12px 10px 10px;
  }
</style>
