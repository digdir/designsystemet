import React from 'react';
import { render as renderRtl, screen } from '@testing-library/react';

import type { ListProps } from './List';
import { List } from './List';
import { ListItem } from './ListItem';

const render = (props: Partial<ListProps> = {}) => {
  const allProps: ListProps = {
    children: (
      <>
        <ListItem>Test</ListItem>
      </>
    ),
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
    render({ as: 'ol' });
    const list = document.querySelector('ol');
    expect(list).toBeInTheDocument();
  });

  it('Renders the children', () => {
    render();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should have the passed className', () => {
    render({ className: 'test' });
    expect(screen.getByRole('list')).toHaveClass('test');
  });

  it('should have the passed size', () => {
    render({ size: 'large' });
    expect(screen.getByRole('list')).toHaveClass('large');
  });
});
