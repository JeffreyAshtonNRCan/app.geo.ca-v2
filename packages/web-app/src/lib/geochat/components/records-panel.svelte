<h3>Records & Map</h3>

<div class="records-body">
  <div class="records-list">Supporting records will appear here.</div>

  <div class="map">Map placeholder</div>
</div>

<style>
  :global(.records) {
    display: flex;
    flex-direction: column;
  }

  h3 {
    margin: 0;
    padding: 1rem;
    border-bottom: 1px solid #ddd;
  }

  .records-body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    flex: 1;
  }

  .records-list {
    min-height: 150px;
    border: 1px solid #ddd;
    padding: 1rem;
  }

  .map {
    flex: 1;
    min-height: 250px;
    border: 1px solid #ddd;

    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
