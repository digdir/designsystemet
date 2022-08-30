const BREAKPOINTS = {
  desktop: 1600,
  smallDesktop: 1400,
  laptop: 1200,
  smallLaptop: 992,
  tablet: 768,
  mobile: 576,
  smallMobile: 380,
};

type Mq = keyof typeof BREAKPOINTS;
export const media = Object.keys(BREAKPOINTS)
  .map((key) => [key, BREAKPOINTS[key as Mq]] as [Mq, number])
  .reduce((prev, [key, breakpoint]) => {
    prev[key] = `@media (max-width: ${breakpoint}px)`;
    return prev;
  }, {} as Record<Mq, string>);
