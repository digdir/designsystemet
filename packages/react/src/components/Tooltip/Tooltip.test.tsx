import userEvent from '@testing-library/user-event';
import { act, render as renderRtl, screen, waitFor } from '@testing-library/react';

import type { TooltipProps } from './Tooltip';
import { Tooltip } from './Tooltip';

const render = async (props: Partial<TooltipProps> = {}) => {
  const allProps: TooltipProps = {
    children: <button>My button</button>,
    content: 'Tooltip text',
    ...props,
  };
  /* Flush microtasks */
  await act(async () => {});
  const user = userEvent.setup();

  return {
    user,
    ...renderRtl(<Tooltip {...allProps} />),
  };
};

describe('Tooltip', () => {
  describe('should render children', () => {
    it('should render child', async () => {
      await render();
      const tooltipTrigger = screen.getByRole('button', { name: 'My button' });

      expect(tooltipTrigger).toBeInTheDocument();
    });
  });

  describe('should render tooltip', () => {
    it('should render tooltip on hover', async () => {
      const { user } = await render();
      const tooltipTrigger = screen.getByRole('button', { name: 'My button' });

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      await act(async () => await user.hover(tooltipTrigger));
      const tooltip = await screen.findByText('Tooltip text');
      expect(tooltip).toBeInTheDocument();
      expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    });

    it('should render tooltip on focus', async () => {
      await render();
      const tooltipTrigger = screen.getByRole('button', { name: 'My button' });

      expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
      act(() => tooltipTrigger.focus());
      const tooltip = await screen.findByText('Tooltip text');
      expect(tooltip).toBeInTheDocument();
      expect(screen.queryByRole('tooltip')).toBeInTheDocument();
    });

    it('should close tooltip on escape', async () => {
      const { user } = await render();
      const tooltipTrigger = screen.getByRole('button', { name: 'My button' });

      expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
      await act(async () => {
        await user.hover(tooltipTrigger);
      });
      const tooltip = await screen.findByText('Tooltip text');
      expect(tooltip).toBeInTheDocument();
      await act(async () => {
        await user.keyboard('[Escape]');
      });
      expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
    });
  });

  it('should render open when we pass open prop', async () => {
    await render({ open: true });
    const tooltipTrigger = screen.getByRole('button', { name: 'My button' });

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(tooltipTrigger).toHaveAttribute('aria-describedby');
  });

  it('delay', async () => {
    const user = userEvent.setup();

    await render({ delay: 300 });

    await user.hover(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).toBeNull();

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).toBeVisible();
    });
  });
});
