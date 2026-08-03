<script lang="ts">
  import GeoChatPage from '$lib/geochat/components/geochat-page.svelte';
  import { page } from '$app/state';

  console.log('page.params.lang =', page.params.lang);

  const lang: 'en' | 'fr' = page.params.lang?.startsWith('fr') ? 'fr' : 'en';
</script>

<GeoChatPage {lang} />
