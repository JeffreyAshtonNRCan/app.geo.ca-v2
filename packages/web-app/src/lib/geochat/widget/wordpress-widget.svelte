<script lang="ts">
  import GeoChatWidget from './geochat-widget.svelte';
  import { getWordPressLang } from './wordpress-utils';
  import { getGeoChatConfig } from '../geochat-config';

  const { lang, locale, alternateLanguageUrl } = getWordPressLang();

  function handleDiveDeeper() {
    const { appUrl } = getGeoChatConfig();
    window.location.href = `${appUrl}/${locale}/geochat`;
  }
</script>

<GeoChatWidget {lang} {alternateLanguageUrl} onDiveDeeper={handleDiveDeeper} />
