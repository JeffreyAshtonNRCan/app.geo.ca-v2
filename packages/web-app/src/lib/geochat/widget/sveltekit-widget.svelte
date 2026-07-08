<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import GeoChatWidget from '../widget/geochat-widget.svelte';
  import { setGeoChatConfig } from '$lib/geochat/geochat-config';

  const locale = $derived(page.params.lang ?? 'en-ca');

  const lang = $derived(locale.startsWith('fr') ? 'fr' : 'en');
  const alternateLanguageUrl = $derived.by(() => {
    const pathname =
      page.params.lang === 'fr-ca' ? page.url.pathname.replace('/fr-ca/', '/en-ca/') : page.url.pathname.replace('/en-ca/', '/fr-ca/');

    return `${pathname}${page.url.search}${page.url.hash}`;
  });

  function handleDiveDeeper() {
    console.log('page.params.lang =', page.params.lang);
    console.log('lang =', lang);
    console.log('goto =', `/${lang}/geochat`);

    goto(`/${locale}/geochat`);
  }

  // TODO: Replace hardcoded URLs with environment variables.
  // WordPress supplies these via plugin settings.
  // Add to .env
  //  CHAT_API_URL
  //  CHAT_HISTORY_URL
  // and
  // setGeoChatConfig({
  //     chatApiUrl: CHAT_API_URL,
  //     chatHistoryUrl: CHAT_HISTORY_URL,
  // });

  setGeoChatConfig({
    chatApiUrl: 'https://2qvn83jteg.execute-api.ca-central-1.amazonaws.com/staging/chat',
    chatHistoryUrl: 'https://2qvn83jteg.execute-api.ca-central-1.amazonaws.com/staging/chathistory',
  });
</script>

// no widget for full page chat
{#if !page.url.pathname.endsWith('/geochat')}
  <GeoChatWidget {lang} {alternateLanguageUrl} onDiveDeeper={handleDiveDeeper} />
{/if}
