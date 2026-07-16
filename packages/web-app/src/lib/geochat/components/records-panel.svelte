<script lang="ts">
  import { chatStore } from '$lib/geochat/stores/chat-store';
</script>

<div class="records-panel">
  <div class="records-body">
    <div class="records-list">
      {#if $chatStore.records.length === 0}
        <div class="empty">Supporting records will appear here.</div>
      {:else}
        {#each $chatStore.records as record (record.uuid)}
          <button class="record">
            <div class="record-title">
              {record.title_display}
            </div>

            <div class="record-description">
              {record.description_display}
            </div>
          </button>
        {/each}
      {/if}
    </div>

    <div class="map">Map placeholder</div>
  </div>
</div>

<style>
  :global(.records) {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .records-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  .records-body {
    display: grid;
    grid-template-rows: 1fr 1fr;
    gap: 1rem;
    padding: 1rem;
    flex: 1;
    min-height: 0;
  }

  .records-list,
  .map {
    min-height: 0;
    border: 1px solid #ddd;
  }

  .records-list {
    overflow-y: auto;
  }

  .record {
    display: block;
    width: 100%;
    padding: 0.75rem;
    text-align: left;
    border: 0;
    border-bottom: 1px solid #eee;
    background: transparent;
    cursor: pointer;
  }

  .record-title {
    font-weight: 600;
  }

  .record-description {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: #666;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .empty {
    padding: 1rem;
    color: #666;
  }

  .map {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
