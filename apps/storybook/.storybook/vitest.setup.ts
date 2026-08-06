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
