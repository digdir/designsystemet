import { attr, isBrowser, onHotReload, onMutation } from './utils';

// Polyfill for Android Firefox not supporting details/summary accessibility properly
const IS_ANDROID_FIREFOX =
  isBrowser() &&
  /android/i.test(navigator.userAgent) &&
  /firefox/i.test(navigator.userAgent);
const SUMMARYS = IS_ANDROID_FIREFOX
  ? document.getElementsByTagName('summary')
  : [];

function handleAriaPolyfill() {
  for (const summary of SUMMARYS) {
    const open = !!(summary.parentElement as HTMLDetailsElement)?.open;
    attr(summary, 'role', 'button');
    attr(summary, 'aria-expanded', `${open}`);
  }
}

if (IS_ANDROID_FIREFOX)
  onHotReload('details-android-firefox', () => [
    onMutation(document, handleAriaPolyfill, {
      attributeFilter: ['open'],
      attributes: true,
      childList: true,
      subtree: true,
    }),
  ]);
