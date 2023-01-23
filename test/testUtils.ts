export const mockMediaQuery = (maxWidth: number) => {
  const setScreenWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: width <= maxWidth,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
  };

  return { setScreenWidth };
};
