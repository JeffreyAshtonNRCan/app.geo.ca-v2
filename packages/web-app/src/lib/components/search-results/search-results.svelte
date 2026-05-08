<script lang="ts">
    import { page, navigating } from '$app/state';
    import ResultList from '$lib/components/search-results/result-list.svelte';
    import SearchBar from '$lib/components/search-results/search-bar.svelte';
    import OverviewSection from '$lib/components/search-results/overview-section.svelte';

    /************* Translations ***************/
    const translations = page.data.t;

    const searchDatasets =
        translations?.searchDatasets ?? 'Search datasets';

    const searchResultsText =
        translations?.searchResults ?? 'Search results';

    let resultMessage = $derived(page.data.resultMessage);

    let { overviewData } = $props();
</script>

<h1 class="font-custom-style-h1 mt-8 px-5 md:px-0 leading-tight">
    {searchDatasets}
</h1>

<p class="mb-2 mt-3 font-open-sans px-5 md:px-0">
    {resultMessage}
</p>

<SearchBar />

<!-- 🔥 OVERVIEW -->
{#if navigating.type !== null}
    <!-- show immediately on search -->
    <OverviewSection isLoading={true} />
{:else if overviewData}
    {#await overviewData}
        <!-- still loading after navigation -->
        <OverviewSection isLoading={true} />
    {:then data}
        <!-- loaded -->
        <OverviewSection overviewData={data} isLoading={false} />
    {/await}
{/if}

<h2 class="font-custom-style-h2 mt-5 px-5 md:px-0">
    {searchResultsText}
</h2>

<!-- 🔥 RESULTS (unchanged component) -->
<ResultList />