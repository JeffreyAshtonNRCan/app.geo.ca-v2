<script lang="ts">
  import PlusIcon from '$lib/components/icons/plus.svelte';
</script>

<div class="history-list">
  <button class="button-3 text-nowrap shadow-[0rem_0.1875rem_0.375rem_#00000029] cursor-pointer mb-4">
    <PlusIcon classes="inline h-5 mr-2" />
    New Chat
  </button>

  <ul>
    <li>Chat #1</li>
    <li>Chat #2</li>
  </ul>
</div>

<style>
  .history-list {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
  }

  ul {
    margin: 0;
    padding-left: 1.25rem;
  }

  li {
    margin-bottom: 0.5rem;
  }
</style>
