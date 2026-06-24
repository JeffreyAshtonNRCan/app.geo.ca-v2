<script lang="ts">
  import { page } from '$app/state';
  import GeoChatWidget from '../widget/geochat-widget.svelte';
  import { setGeoChatConfig } from '$lib/geochat/geochat-config';

  const lang = $derived(page.params.lang?.startsWith('fr') ? 'fr' : 'en');

  const alternateLanguageUrl = $derived.by(() => {
    const pathname =
      page.params.lang === 'fr-ca' ? page.url.pathname.replace('/fr-ca/', '/en-ca/') : page.url.pathname.replace('/en-ca/', '/fr-ca/');

    return `${pathname}${page.url.search}${page.url.hash}`;
  });

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

<GeoChatWidget {lang} {alternateLanguageUrl} />
