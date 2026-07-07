<script lang="ts">
  import HistoryPanel from '$lib/geochat/components/history-panel.svelte';
  import ChatPanel from '$lib/geochat/components/chat-panel.svelte';
  import RecordsPanel from '$lib/geochat/components/records-panel.svelte';
</script>

<div class="geochat-page">
  <div class="panel history">
    <div class="panel-header">
      <h2>History</h2>
    </div>

    <div class="panel-body">
      <div class="panel-content">
        <HistoryPanel />
      </div>
    </div>
  </div>

  <section class="panel chat">
    <div class="panel-header">
      <h2>GeoChat</h2>
    </div>

    <div class="panel-body">
      <div class="panel-content chat-layout">
        <ChatPanel />
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
      minmax(220px, 1fr)
      minmax(0, 2fr)
      minmax(0, 2fr);
    gap: 1rem;
    height: calc(100vh - 180px);
    align-items: stretch;
  }

  .history,
  .chat,
  .records {
    min-width: 0;
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
</style>
