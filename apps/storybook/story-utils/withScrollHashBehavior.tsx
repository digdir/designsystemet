import type { Decorator } from '@storybook/react';
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
    <div data-storybook-decorator onClick={handleScrollHash}>
      <Story />
    </div>
  );
};
