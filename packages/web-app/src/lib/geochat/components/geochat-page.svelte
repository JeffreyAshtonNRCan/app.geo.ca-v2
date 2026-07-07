<script lang="ts">
  import HistoryPanel from '$lib/geochat/components/history-panel.svelte';
  import ChatPanel from '$lib/geochat/components/chat-panel.svelte';
  import RecordsPanel from '$lib/geochat/components/records-panel.svelte';
</script>

<div class="geochat-page">
  <div class="panel panel-history">
    <div class="panel-header">
      <h2>History</h2>
    </div>

    <div class="panel-content">
      <HistoryPanel />
    </div>
  </div>

  <section class="panel panel-chat">
    <div class="panel-header">
      <h2>GeoChat</h2>
    </div>

    <div class="panel-content">
      <div class="chat-container">
        <ChatPanel />
      </div>
    </div>
  </section>

  <div class="panel panel-records">
    <div class="panel-header">
      <h2>Records &amp; Map</h2>
    </div>

    <div class="panel-content">
      <RecordsPanel />
    </div>
  </div>
</div>

<style>
  .geochat-page {
    display: grid;
    grid-template-columns:
      minmax(220px, 1fr)
      minmax(0, 2fr)
      minmax(0, 2fr);
    gap: 1rem;
    height: calc(100vh - 180px);
    align-items: stretch;
  }

  .panel {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    border: 1px solid #ddd;
    background: #fff;
  }

  .panel-header {
    padding: 1rem;
    text-align: center;
    background: #fff;
  }

  .panel-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.2;
  }

  .panel-content {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }

  .panel-history .panel-content,
  .panel-records .panel-content {
    background: #f5f5f5;
  }

  .panel-chat .panel-content {
    padding: 0 1rem;
    background: #fff;
  }

  .chat-container {
    flex: 1;
    min-width: 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #fff;
  }

  .chat-container :global(#chat-log-wrapper) {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 8px;
    border: 1px solid #ddd;
    background: #fff;
  }

  .chat-container :global(#chat-log) {
    padding: 0 10px;
  }
</style>
