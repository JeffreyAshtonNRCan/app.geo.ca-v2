import { mount } from 'svelte';
import WordPressWidget from './wordpress-widget.svelte';

const target = document.getElementById('geochat-root');

console.log('target', target);

if (target) {
  console.log('mounting widget');

  mount(WordPressWidget, {
    target,
  });
}
