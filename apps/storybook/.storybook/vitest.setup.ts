import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import { setProjectAnnotations } from '@storybook/react-vite';
import * as projectAnnotations from './preview';

// Speed up by using instant animations/transitions during testing
document.head.appendChild(
  Object.assign(document.createElement('style'), {
    textContent: `*, *::before, *::after {
    transition-duration: 0ms !important;
    animation-duration: 0ms !important;
    transition-delay: 0ms !important;
    animation-delay: 0ms !important;
  }`,
  }),
);

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);
