<script lang="ts">
  import GeoChatPage from '$lib/geochat/components/geochat-page.svelte';
  import { page } from '$app/state';

  let lang = $derived(page.params.lang?.startsWith('fr') ? 'fr' : 'en');

  let alternateLanguageUrl = $derived(lang === 'fr' ? '/en-ca/geochat' : '/fr-ca/geochat');

  $effect(() => {
    console.log('=== GeoChat +page ===');
    console.log('page.params.lang =', page.params.lang);
    console.log('lang =', lang);
    console.log('alternateLanguageUrl =', alternateLanguageUrl);
  });
</script>

<GeoChatPage {lang} {alternateLanguageUrl} />
