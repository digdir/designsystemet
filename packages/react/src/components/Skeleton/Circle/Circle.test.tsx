import { render, screen } from '@testing-library/react';

import { Skeleton } from '..';

beforeAll(() => {
  document.getAnimations = () => [];
});

describe('Skeleton.Circle', () => {
  it('should render skeleton', () => {
    render(<Skeleton.Circle data-testid={'skeleton-circle'} />);

    expect(screen.getByTestId('skeleton-circle'));
  });
});
