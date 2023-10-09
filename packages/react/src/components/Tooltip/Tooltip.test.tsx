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
  describe('should render tooltip', () => {
    it('should render tooltip on hover', async () => {
      render();
      const tooltipTrigger = screen.getByRole('button', { name: 'My button' });

      expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
      await act(async () => user.hover(tooltipTrigger));
      expect(screen.queryByText('Tooltip text')).toBeInTheDocument();
    });

    it('should render tooltip on focus', async () => {
      render();
      const tooltipTrigger = screen.getByRole('button', { name: 'My button' });

      expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
      tooltipTrigger.focus();
      await act(async () => {
        await user.tab();
      });
      expect(screen.queryByText('Tooltip text')).toBeInTheDocument();
    });

    it('should render tooltip on click', async () => {
      render();
      const tooltipTrigger = screen.getByRole('button', { name: 'My button' });

      expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
      await act(async () => user.click(tooltipTrigger));
      expect(screen.queryByText('Tooltip text')).toBeInTheDocument();
    });
  });

  it('should render open when we pass open prop', () => {
    render({ open: true });
    const tooltipTrigger = screen.getByRole('button', { name: 'My button' });

    expect(screen.queryByText('Tooltip text')).toBeInTheDocument();
    expect(tooltipTrigger).toHaveAttribute('aria-describedby');
  });
});
