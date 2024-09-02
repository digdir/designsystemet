import { render as renderRtl, screen } from '@testing-library/react';

import type { ListProps } from './List';

import { List } from '.';
import { Heading } from '../Typography/Heading';

const render = (props: Partial<ListProps> = {}) => {
  const allProps: ListProps = {
    children: <List.Item>Test</List.Item>,
    ...props,
  };
  return renderRtl(<List {...allProps} />);
};

describe('List', () => {
  it('Renders the list', () => {
    render();

    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('Renders an unordered list', () => {
    render();
    const list = document.querySelector('ul');
    expect(list).toBeInTheDocument();
  });

  it('Renders an ordered list', () => {
    render({ variant: 'ordered' });
    const list = document.querySelector('ol');
    expect(list).toBeInTheDocument();
  });

  it('Renders the children', () => {
    render();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should have the passed size', () => {
    render({ size: 'lg' });
    expect(screen.getByRole('list')).toHaveAttribute('data-ds-size', 'lg');
  });

  it('should have aria-labelledby when previous element is heading', () => {
    renderRtl(
      <>
        <Heading>Title</Heading>
        <List />
      </>,
    );
    expect(screen.getByRole('list')).toHaveAttribute(
      'aria-labelledby',
      screen.getByRole('heading').getAttribute('id'),
    );
  });
  it('should have aria-labelledby when heading is with passed id', () => {
    renderRtl(
      <>
        <Heading id='passedId'>Title</Heading>
        <List />
      </>,
    );
    expect(screen.getByRole('list')).toHaveAttribute(
      'aria-labelledby',
      'passedId',
    );
  });
  it('should not have aria-labelledby when heading is missing', () => {
    render();
    expect(screen.getByRole('list')).not.toHaveAttribute('aria-labelledby');
  });
  it('should not have aria-labelledby when list has aria-label', () => {
    renderRtl(
      <>
        <Heading>Title</Heading>
        <List aria-label='Custom list label' />
      </>,
    );
    expect(screen.getByRole('list')).not.toHaveAttribute('aria-labelledby');
  });
});
