import { mount } from 'svelte';
import WordPressWidget from './wordpress-widget.svelte';

const target = document.getElementById('geochat-root');

if (target) {
  mount(WordPressWidget, {
    target,
  });
}
