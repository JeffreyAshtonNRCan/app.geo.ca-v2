<script lang="ts">
  import ChatPanel from '$lib/geochat/components/chat-panel.svelte';
</script>

<div class="geochat-page">
  <aside class="history">History</aside>

  <main class="chat">
    <ChatPanel />
  </main>

  <aside class="records">Records & Map</aside>
</div>

<style>
  .geochat-page {
    display: grid;
    grid-template-columns: 320px 1fr 380px;
    gap: 1rem;

    height: calc(100vh - 180px);
  }

  .history,
  .records {
    border: 1px solid #ddd;
  }

  .chat {
    min-width: 0;
  }
</style>
