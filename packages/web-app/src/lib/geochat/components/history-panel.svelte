<script lang="ts">
  import PlusIcon from '$lib/components/icons/plus.svelte';
</script>

<div class="history-list">
  <button
    class="text-nowrap
         h-[34px] px-3
         mb-3
         rounded-[0.3125rem]
         font-custom-style-button-3
         shadow-[0rem_0.1875rem_0.375rem_#00000029]
         bg-custom-16 hover:bg-custom-23
         text-white cursor-pointer
         inline-flex items-center"
  >
    <PlusIcon classes="inline h-4 w-4 mr-2" />
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
