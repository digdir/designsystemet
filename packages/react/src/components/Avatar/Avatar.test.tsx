import { render, screen } from '@testing-library/react';
import { Avatar } from './';

describe('Avatar', () => {
  it('should render correctly with default props', () => {
    render(<Avatar />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('should render correctly with custom props', () => {
    render(<Avatar size='lg' variant='square' />);
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveClass(
      'ds-avatar--lg ds-avatar--square',
    );
  });

  it('should render initials when name is set', () => {
    render(<Avatar name='Ola Nordmann' />);
    expect(screen.getByText('ON')).toBeInTheDocument();
  });

  it('should only have two initials', () => {
    render(<Avatar name='Ola Nordmann Kristoffersen' />);
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <Avatar>
        <img src='' alt='ola nordmann' data-testid='child-image' />
      </Avatar>,
    );
    /* look for image with correct id */
    expect(screen.getByTestId('child-image')).toBeInTheDocument();
  });

  it('children should have aria-hidden', () => {
    render(
      <Avatar>
        <img src='' alt='ola nordmann' data-testid='child-image' />
      </Avatar>,
    );
    expect(screen.getByTestId('child-image')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });
});