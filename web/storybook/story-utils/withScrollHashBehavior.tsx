import type { Decorator } from '@storybook/react-vite';
import type { MouseEventHandler } from 'react';

function isInViewport(el: Element) {
  const { top, left, bottom, right } = el.getBoundingClientRect();
  return (
    top >= 0 &&
    left >= 0 &&
    bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

const handleScrollHash: MouseEventHandler<HTMLDivElement> = (event) => {
  const anchor = (event.target as Element).closest<HTMLAnchorElement>(
    'a[href^="#"]',
  );
  const hash = anchor?.hash;
  if (!hash) return;
  event.preventDefault();
  const element = document.getElementById(hash.slice(1));
  if (element) {
    if (!isInViewport(element)) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    element.focus({ preventScroll: true });
  }
};

export const withScrollHashBehavior: Decorator = (Story) => {
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Also adds `withScrollHashBehavior` decorator which we can use for stories / groups of stories, as demonstrated here, to fix Storybook's annoying behavior of navigating to the inner `iframe` when in-page anchor links are clicked instead of actually navigating in-page. https://github.com/digdir/designsystemet/pull/3555
    <div data-storybook-decorator onClick={handleScrollHash}>
      <Story />
    </div>
  );
};
