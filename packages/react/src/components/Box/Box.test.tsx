import React from 'react';
import { render as renderRtl, screen } from '@testing-library/react';

import type { BoxProps } from './Box';
import { Box } from './Box';

const render = (props?: BoxProps) => renderRtl(<Box {...props} />);

describe('Box', () => {
  it('should render a div with default classname', () => {
    render();
    const box = screen.getByRole('div');

    expect(box.classList).toContain('box');
    expect(box.classList).toContain('mediumShadow');
    expect(box.classList).toContain('mediumBorderRadius');
    expect(box.classList).toContain('defaultBackground');
  });
});
