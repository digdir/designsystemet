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
    it('should render child', () => {
      render();
      const tooltipTrigger = screen.getByRole('button', { name: 'My button' });

      expect(tooltipTrigger).toBeInTheDocument();
    });
  });
  describe('should render tooltip', () => {
    it('should render tooltip on hover', async () => {
      render();
      const tooltipTrigger = screen.getByRole('button', { name: 'My button' });

      expect(screen.getByRole('tooltip')).not.toBeInTheDocument();
      await act(async () => await user.hover(tooltipTrigger));
      expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    });

    it('should render tooltip on focus', () => {
      render();
      const tooltipTrigger = screen.getByRole('button', { name: 'My button' });

      expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
      tooltipTrigger.focus();
      expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    });

    it('should render tooltip on click', async () => {
      render();
      const tooltipTrigger = screen.getByRole('button', { name: 'My button' });

      expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
      await act(async () => user.click(tooltipTrigger));
      expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('should render open when we pass open prop', () => {
    render({ open: true });
    const tooltipTrigger = screen.getByRole('button', { name: 'My button' });

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(tooltipTrigger).toHaveAttribute('aria-describedby');
  });

  it('delay', async () => {
    const user = userEvent.setup();

    render({ delay: 300 });

    await act(async () => {
      await user.hover(screen.getByRole('button'));
      await new Promise((r) => setTimeout(r, 250));
      expect(screen.queryByRole('tooltip')).toBeNull();
      await new Promise((r) => setTimeout(r, 600));
    });

    expect(screen.getByRole('tooltip')).toBeVisible();
  });
});
