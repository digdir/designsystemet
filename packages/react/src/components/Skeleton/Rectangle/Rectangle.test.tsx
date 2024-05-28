import { render, screen } from '@testing-library/react';

import { Skeleton } from '..';

beforeAll(() => {
  document.getAnimations = () => [];
});

describe('Skeleton.Rectangle', () => {
  it('should render skeleton', () => {
    render(<Skeleton.Rectangle data-testid={'skeleton-rectangle'} />);

    expect(screen.getByTestId('skeleton-rectangle'));
  });
});
