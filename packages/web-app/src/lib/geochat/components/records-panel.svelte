<script lang="ts">
  import { chatStore } from '$lib/geochat/stores/chat-store';
  import Map from '$lib/components/map/map.svelte';

  // const testUuid = '175fc87a-acce-4f98-a03a-32846481efc8';
  //
  // const testCoordinates = [
  //   [-141, 60],
  //   [-123.8, 60],
  //   [-123.8, 69.7],
  //   [-141, 69.7],
  //   [-141, 60],
  // ];

  const selectedRecord = $derived($chatStore.records[0]);

  const coordinates = $derived(selectedRecord?.geometry.coordinates);

  const uuid = $derived(selectedRecord?.uuid);
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

    <div class="map">
      {#if $chatStore.records.length > 0}
        {#key selectedRecord.uuid}
          <Map
            coordinates={selectedRecord.geometry.coordinates[0]}
            id={selectedRecord.uuid}
            dynamic={true}
            mapType="record"
            footer={false}
            mapFill={true}
          />
        {/key}
      {/if}
    </div>
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
    grid-template-rows: 180px 1fr;
    gap: 1rem;
    height: 100%;
  }

  .records-list {
    overflow-y: auto;
    min-height: 0;
  }

  .records-list {
    overflow-y: auto;
  }

  .records-list::-webkit-scrollbar {
    width: 8px;
  }

  .records-list::-webkit-scrollbar-track {
    background: transparent;
  }

  .records-list::-webkit-scrollbar-thumb {
    background: #535aa4;
    border-radius: 9999px;
  }

  .records-list::-webkit-scrollbar-thumb:hover {
    background: #130944;
  }

  /* Firefox */
  .records-list {
    scrollbar-width: thin;
    scrollbar-color: #535aa4 transparent;
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
    width: 100%;
    height: 100%;
    min-height: 0;
    overflow: hidden;

    border-top: 1px solid #e5e7eb;
    padding-top: 0.75rem;
  }
</style>
