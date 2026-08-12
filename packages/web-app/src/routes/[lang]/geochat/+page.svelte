<script lang="ts">
  import GeoChatPage from '$lib/geochat/components/geochat-page.svelte';
  import { page } from '$app/state';

  let lang: 'en' | 'fr' = $derived(page.params.lang?.startsWith('fr') ? 'fr' : 'en');

  let alternateLanguageUrl = $derived(lang === 'fr' ? '/en-ca/geochat' : '/fr-ca/geochat');
</script>

<GeoChatPage {lang} {alternateLanguageUrl} />
