import { renderHook } from '@testing-library/react';

import { useSynchronizedAnimation } from './useSynchronizedAnimation';

// Mock Animation objects
const mockAnimation = {
  animationName: 'testAnimation',
  currentTime: 100,
  effect: { target: 'testTarget' },
  finished: Promise.resolve(),
} as unknown as Animation;

const mockAnimation2 = {
  animationName: 'testAnimation2',
  currentTime: 200,
  effect: { target: 'testTarget' },
  finished: Promise.resolve(),
} as unknown as Animation;

// Mock document.getAnimations
document.getAnimations = jest.fn(() => [mockAnimation, mockAnimation2]);

describe('useSynchronizedAnimation', () => {
  it('should return a ref that is defined', () => {
    const { result } = renderHook(() =>
      useSynchronizedAnimation<HTMLDivElement>('testAnimation'),
    );

    // Check if the ref is defined:
    expect(result.current.current).toBeDefined();
  });

  it('should syncronize animation times', () => {
    renderHook(() =>
      useSynchronizedAnimation<HTMLDivElement>('testAnimation2'),
    );

    const animations = document.getAnimations();

    // Check that animation times are equal:
    expect(animations[0].currentTime === animations[1].currentTime);
  });
});
