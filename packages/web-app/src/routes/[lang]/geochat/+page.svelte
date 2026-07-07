<script lang="ts">
  import GeoChatPage from '$lib/geochat/components/geochat-page.svelte';
  import { page } from '$app/state';

  const lang = page.params.lang === 'fr' ? 'fr' : 'en';
</script>

<GeoChatPage {lang} />
