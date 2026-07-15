<script lang="ts">
  import PlusIcon from '$lib/components/icons/plus.svelte';
</script>

<div class="history-list">
  <button class="new-chat">
    <PlusIcon width={18} height={18} />
    <span>New Chat</span>
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
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;

    height: 34px;
    padding: 0 12px;

    margin-bottom: 1rem;

    background: #5a539d;
    color: #fff;

    border: 1px solid #4c458d;
    border-radius: 6px;

    font-size: 0.95rem;
    font-weight: 600;

    cursor: pointer;
  }

  .new-chat svg {
    flex-shrink: 0;
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
