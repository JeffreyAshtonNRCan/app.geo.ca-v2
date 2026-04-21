<script lang="ts">
  import { page } from '$app/state';
  import ResultList from '$lib/components/search-results/result-list.svelte';
  import SearchBar from '$lib/components/search-results/search-bar.svelte';
  import OverviewSection from '$lib/components/search-results/overview-section.svelte';

  const translations = page.data.t;

  const searchDatasets =
    translations?.searchDatasets ?? 'Search datasets';

  const searchResultsText =
    translations?.searchResults ?? 'Search results';

  let resultMessage = $derived(page.data.resultMessage);

  let { overviewData } = $props(); // Promise

  // 🔥 shared loading state
 let isSearching = $state(false);
let lastUrl = $state('');

$effect(() => {
  const currentUrl = page.url.toString();

  // 🔥 fire immediately on navigation (BEFORE data arrives)
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    isSearching = true;

    console.log("SEARCH STARTED (URL change)");
  }
});
function stopSearching() {
  setTimeout(() => {
    isSearching = false;
    console.log("SEARCH FINISHED");
  }, 150);
}
</script>

<h1 class="font-custom-style-h1 mt-8 px-5 md:px-0 leading-tight">
  {searchDatasets}
</h1>

<p class="mb-2 mt-3 font-open-sans px-5 md:px-0">
  {resultMessage}
</p>

<SearchBar />

<!-- 🔥 OVERVIEW (streaming) -->
{#if overviewData}
 {#await overviewData}
    <OverviewSection isLoading={true} />
 {:then data}
    <OverviewSection overviewData={data} isLoading={false} />
    {stopSearching()}
{/await}
{/if}

<h2 class="font-custom-style-h2 mt-5 px-5 md:px-0">
  {searchResultsText}
</h2>

<!-- 🔥 RESULTS -->
<ResultList isLoading={isSearching} />