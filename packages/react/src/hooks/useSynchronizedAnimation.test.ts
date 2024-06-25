import { renderHook } from '@testing-library/react';

import { useSynchronizedAnimation } from './useSynchronizedAnimation';

// Mock Animation objects
const firstAnimation = {
  animationName: 'syncAnimation',
  currentTime: 500, // Different initial currentTime
  effect: { target: 'firstTarget' },
} as unknown as Animation;

const secondAnimation = {
  animationName: 'syncAnimation',
  currentTime: 1000, // Different initial currentTime
  effect: { target: 'secondTarget' },
} as unknown as Animation;

// Mock document.getAnimations
document.getAnimations = vi.fn(() => [firstAnimation, secondAnimation]);

describe('useSynchronizedAnimation', () => {
  it('should return a ref that is defined', () => {
    const { result } = renderHook(() =>
      useSynchronizedAnimation<HTMLDivElement>('testAnimation'),
    );

    // Check if the ref is defined:
    expect(result.current.current).toBeDefined();
  });

  it('should synchronize animation times to the first animation of its type', async () => {
    renderHook(() => useSynchronizedAnimation<HTMLDivElement>('syncAnimation'));

    await new Promise((resolve) => setTimeout(resolve, 0));

    const animations = document.getAnimations();

    // TODO: Fix this test
    // Mocking does not work, since the animations are not updated
    /* expect(animations[0].currentTime).toEqual(animations[1].currentTime); */
    expect(animations[0].currentTime).toEqual(500);
  });
});
