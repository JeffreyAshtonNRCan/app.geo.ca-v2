<script lang="ts">
  import ChatHistoryPanel from '$lib/geochat/components/chat-history.svelte';
  import ChatPanel from '$lib/geochat/components/chat-panel.svelte';
  import RecordsPanel from '$lib/geochat/components/records-panel.svelte';
</script>

<div class="geochat-page">
  <aside class="history">
    <ChatHistoryPanel />
  </aside>

  <main class="chat">
    <ChatPanel />
  </main>

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
  }

  .chat {
    min-width: 0;
  }

  .history,
  .records {
    border: 1px solid #ddd;
  }
</style>
