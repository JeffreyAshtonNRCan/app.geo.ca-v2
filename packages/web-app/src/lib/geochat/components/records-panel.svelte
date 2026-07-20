<script lang="ts">
  import { chatStore } from '$lib/geochat/stores/chat-store';
  import type { ChatRecord } from '$lib/geochat/stores/chat-store';
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

  let selectedRecord = $state<ChatRecord | undefined>();

  $effect(() => {
    if (!selectedRecord || !$chatStore.records.some((r) => r.uuid === selectedRecord.uuid)) {
      selectedRecord = $chatStore.records[0];
    }
  });

  const uuid = $derived(selectedRecord?.uuid);

  const coordinates = $derived(selectedRecord?.geometry?.coordinates?.[0]);

  $effect(() => {
    if (!selectedRecord) return;

    console.log('Selected:', selectedRecord);

    console.table(
      $chatStore.records.map((r) => ({
        title: r.title_display,
        geometry: r.geometry,
        type: r.geometry?.type,
        rings: r.geometry?.coordinates?.length,
        selected: r.uuid === selectedRecord?.uuid,
      }))
    );
  });
</script>

<div class="records-panel">
  <div class="records-body">
    <div class="records-list">
      {#if $chatStore.isThinking}
        <div class="empty">
          <p>Searching for supporting records...</p>
          <p>
            thinking={$chatStore.isThinking.toString()}
            records={$chatStore.records.length}
          </p>
        </div>
      {:else if $chatStore.records.length === 0}
        <div class="empty">
          <!--          <p>No supporting records are available for this response.</p>-->
          <!--          <p>Some responses are general conversation or guidance and don't reference specific GEO.ca datasets.</p>-->
          <p>
            thinking={$chatStore.isThinking.toString()}
            records={$chatStore.records.length}
          </p>
        </div>
      {:else}
        {#each $chatStore.records as record (record.uuid)}
          <button class="record" class:selected={selectedRecord?.uuid === record.uuid} onclick={() => (selectedRecord = record)}>
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
      {#if $chatStore.isThinking}
        <div class="empty">
          <p>Searching for supporting records...</p>
        </div>
      {:else if selectedRecord?.geometry}
        {#key uuid}
          <Map {coordinates} id={selectedRecord.uuid} dynamic={true} mapType="record" footer={false} mapFill={true} />
        {/key}
      {:else}
        <div class="empty">
          <p>No map available.</p>
        </div>
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
    width: 100%;
    text-align: left;
    padding: 0.75rem;
    border: none;
    border-bottom: 1px solid #ddd;
    background: white;
    cursor: pointer;
  }

  .record:hover {
    background: #f8f8f8;
  }

  .record.selected {
    background: #ececec;
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

  .empty p {
    display: block;
    margin: 0 0 1rem 0;
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
