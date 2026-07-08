// src/lib/geochat/widget/wordpress-utils.ts

export function getWordPressLang() {
  let lang: 'en-ca' | 'fr-ca' = 'en-ca';
  let alternateLanguageUrl = '';

  const path = window.location.pathname;

  if (path.startsWith('/fr/')) {
    lang = 'fr-ca';
  }

  const links = document.querySelectorAll('link[rel="alternate"][hreflang]');

  links.forEach((link) => {
    const hreflang = link.getAttribute('hreflang');
    const href = link.getAttribute('href');

    if ((lang === 'en-ca' && hreflang === 'fr') || (lang === 'fr-ca' && hreflang === 'en')) {
      alternateLanguageUrl = href ?? '';
    }
  });

  return {
    lang,
    alternateLanguageUrl,
  };
}

export function getWordPressConfig() {
  return (window as any).GeoChatConfig;
}
