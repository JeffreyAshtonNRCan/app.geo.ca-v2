<script lang="ts">
  import { page } from '$app/state';
  import GeoChatWidget from '../widget/geochat-widget.svelte';

  const lang = $derived(page.params.lang?.startsWith('fr') ? 'fr' : 'en');

  const alternateLanguageUrl = $derived.by(() => {
    const pathname =
      page.params.lang === 'fr-ca' ? page.url.pathname.replace('/fr-ca/', '/en-ca/') : page.url.pathname.replace('/en-ca/', '/fr-ca/');

    return `${pathname}${page.url.search}${page.url.hash}`;
  });
</script>

<GeoChatWidget {lang} {alternateLanguageUrl} />
