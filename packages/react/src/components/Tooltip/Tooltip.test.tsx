import React from 'react';
import userEvent from '@testing-library/user-event';
import { act, render as renderRtl, screen } from '@testing-library/react';

import type { TooltipProps } from './Tooltip';
import { Tooltip } from './Tooltip';

const render = (props: Partial<TooltipProps> = {}) => {
  const allProps: TooltipProps = {
    children: <button>My button</button>,
    content: 'Tooltip text',
    ...props,
  };
  renderRtl(<Tooltip {...allProps} />);
};

const user = userEvent.setup();

describe('Tooltip', () => {
  describe('should render children', () => {
    it('should render children', () => {
      render();
      const tooltipTrigger = screen.getByRole('button', { name: 'My button' });

      expect(tooltipTrigger).toBeInTheDocument();
    });
  });
});
