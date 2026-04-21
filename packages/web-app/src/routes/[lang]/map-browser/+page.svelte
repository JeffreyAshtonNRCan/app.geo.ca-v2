<script lang="ts">
  import { page, navigating } from '$app/stores';
  import { onMount } from 'svelte';
  import SearchResults from '$lib/components/search-results/search-results.svelte';

  // use $page (reactive store)
  $: lang = $page.data.lang;

  $: title =
    lang === 'fr-ca'
      ? 'app.geo.ca - Résultats de recherche'
      : 'app.geo.ca - Search Results';

  $: canonicalUrl = $page.data.canonicalUrl;
  $: alternateUrl = $page.data.alternateUrl;
  $: alternateLang = $page.data.alternateLang;
  $: metaDescription = $page.data.metaDescription;


  $: overviewData = $page.data.overviewData;
  let isLoading = false;
  
  $: console.log("NAVIGATING:", $navigating);

$: {
  const keyword = $page.url.searchParams.get('search-terms');

  isLoading = !!keyword && !!$navigating;

  console.log("isLoading:", isLoading);
}

  onMount(() => {
    console.log("CLIENT URL:", window.location.href);
  });

  
  $: console.log("PAGE overviewData:", overviewData?.question);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={metaDescription} />
  <link rel="canonical" href={canonicalUrl} />
  <link rel="alternate" hreflang={alternateLang} href={alternateUrl} />
</svelte:head>

<div class="flex flex-wrap lg:flex-nowrap items-start gap-4 py-4">
  <div class="grow flex flex-col gap-4">
    <SearchResults {overviewData} />
  </div>
</div>