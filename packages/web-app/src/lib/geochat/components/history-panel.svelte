<script lang="ts">
  import PlusIcon from '$lib/components/icons/plus.svelte';
</script>

<div class="history-list">
  <button class="new-chat" aria-label="New Chat" title="New Chat">
    <PlusIcon width={18} height={18} />
  </button>

  <ul>
    <li>Chat #1</li>
    <li>Chat #2</li>
  </ul>
</div>

<style>
  .history-content {
    padding: 1rem;
  }

  .history-list {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
  }

  .new-chat {
    width: 34px;
    height: 34px;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0;
    margin-bottom: 1rem;

    background: #5a539d;
    color: #fff;

    border: 1px solid #4c458d;
    border-radius: 6px;

    cursor: pointer;
    transition:
      background-color 150ms ease,
      transform 150ms ease;
  }

  .new-chat:hover {
    background: #4c458d;
  }

  .new-chat:active {
    transform: scale(0.97);
  }

  .new-chat:hover {
    background: #4c458d;
  }

  .new-chat svg {
    flex-shrink: 0;
  }

  .section h3 {
    margin: 0 0 1rem;
    font-size: 1rem;
  }

  ul {
    margin: 0;
    padding-left: 1.25rem;
  }

  li {
    margin-bottom: 0.5rem;
  }
</style>
