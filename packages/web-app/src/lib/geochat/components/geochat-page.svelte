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
      <div class="panel-content chat-panel">
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
    padding: 1rem 1rem 0;
  }

  .panel-content {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    background: #fff;
  }

  .chat .panel-content {
    flex: 1;
    min-height: 0;
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
    /*border: none;*/
  }

  .chat-panel :global(#chat-log) {
    padding: 12px 10px 10px;
  }
</style>
