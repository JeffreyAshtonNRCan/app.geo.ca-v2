<div class="records-panel">
  <div class="records-body">
    <div class="records-list">Supporting records will appear here.</div>

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

  .map {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
