import { render, screen } from '@testing-library/react';

import { Skeleton } from '.';

beforeAll(() => {
  document.getAnimations = () => [];
});

describe('Skeleton.Text', () => {
  it('should render skeleton', () => {
    render(<Skeleton.Text data-testid={'skeleton-text'} />);

    expect(screen.getByTestId('skeleton-text'));
  });
});

describe('Skeleton.Circle', () => {
  it('should render skeleton', () => {
    render(<Skeleton.Circle data-testid={'skeleton-circle'} />);

    expect(screen.getByTestId('skeleton-circle'));
  });
});

describe('Skeleton.Rectangle', () => {
  it('should render skeleton', () => {
    render(<Skeleton.Rectangle data-testid={'skeleton-rectangle'} />);

    expect(screen.getByTestId('skeleton-rectangle'));
  });
});
