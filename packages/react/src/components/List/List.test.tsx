import { render as renderRtl, screen } from '@testing-library/react';

import type { ListProps } from './ListRoot';

import { List } from '.';

const render = (props: Partial<ListProps> = {}) => {
  const allProps: ListProps = {
    children: (
      <List.Unordered>
        <List.Item>Test</List.Item>
      </List.Unordered>
    ),
    ...props,
  };
  return renderRtl(<List.Root {...allProps} />);
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
    render({
      children: (
        <List.Ordered>
          <List.Item>Test</List.Item>
        </List.Ordered>
      ),
    });
    const list = document.querySelector('ol');
    expect(list).toBeInTheDocument();
  });

  it('Renders the children', () => {
    render();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should have the passed size', () => {
    render({ size: 'lg' });
    expect(screen.getByRole('list')).toHaveClass('ds-list--lg');
  });

  it('should have the passed heading', () => {
    render({
      children: <List.Heading>Heading</List.Heading>,
    });
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('should have aria-labelledby when heading is passed', () => {
    render({
      children: (
        <>
          <List.Heading>Heading</List.Heading>
          <List.Ordered></List.Ordered>
        </>
      ),
    });
    expect(screen.getByRole('list')).toHaveAttribute('aria-labelledby');
  });
  it('should have aria-labelledby when heading is with passed id', () => {
    render({
      children: (
        <>
          <List.Heading id='passedId'>Heading</List.Heading>
          <List.Ordered></List.Ordered>
        </>
      ),
    });
    expect(screen.getByRole('list')).toHaveAttribute(
      'aria-labelledby',
      'passedId',
    );
  });
  it('should not have aria-labelledby when heading is missing', () => {
    render({
      children: (
        <>
          <List.Ordered></List.Ordered>
        </>
      ),
    });
    expect(screen.getByRole('list')).not.toHaveAttribute('aria-labelledby');
  });
});
