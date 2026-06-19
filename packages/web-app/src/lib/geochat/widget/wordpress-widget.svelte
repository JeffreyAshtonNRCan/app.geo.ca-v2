<script lang="ts">
  import GeoChatWidget from './geochat-widget.svelte';
  import { getWordPressLang } from './wordpress-utils';

  const { lang, alternateLanguageUrl } = getWordPressLang();
</script>

<GeoChatWidget {lang} {alternateLanguageUrl} />
