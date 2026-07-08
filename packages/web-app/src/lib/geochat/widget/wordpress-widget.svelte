<script lang="ts">
  import GeoChatWidget from './geochat-widget.svelte';
  import { getWordPressLang } from './wordpress-utils';

  const { lang, locale, alternateLanguageUrl } = getWordPressLang();

  function handleDiveDeeper() {
    window.location.href = `https://app.geo.ca/${locale}/geochat`;
  }
</script>

<GeoChatWidget {lang} {alternateLanguageUrl} onDiveDeeper={handleDiveDeeper} />
