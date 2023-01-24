import React from 'react';
import userEvent from '@testing-library/user-event';
import { act, render as renderRtl, screen } from '@testing-library/react';

import type { PopoverProps } from './Popover';
import { PopoverVariant, Popover } from './Popover';

const render = (props: Partial<PopoverProps> = {}) => {
  const allProps = {
    children: <div data-testid='popover-content'>Popover text</div>,
    trigger: <button>Open</button>,
    ...props,
  };
  renderRtl(<Popover {...allProps} />);
};

const user = userEvent.setup();

describe('popover', () => {
  describe('trigger uncontrolled', () => {
    it('should render trigger', async () => {
      await act(async () => {
        render();
      });
      const popoverTrigger = screen.getByRole('button', { name: 'Open' });

      expect(popoverTrigger).toBeInTheDocument();
    });

    it('should open popover on trigger click when closed', async () => {
      await act(async () => {
        render();
      });
      const popoverTrigger = screen.getByRole('button', { name: 'Open' });

      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
      await act(async () => {
        await user.click(popoverTrigger);
      });
      expect(screen.queryByTestId('popover-content')).toBeInTheDocument();
    });

    it('should close popover on trigger click when open', async () => {
      await act(async () => {
        render({ initialOpen: true });
      });
      const popoverTrigger = screen.getByRole('button', { name: 'Open' });

      expect(screen.queryByTestId('popover-content')).toBeInTheDocument();
      await act(async () => {
        await user.click(popoverTrigger);
      });
      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
    });

    it('should open popover on SPACE pressed when closed', async () => {
      await act(async () => {
        render();
      });
      const popoverTrigger = screen.getByRole('button', { name: 'Open' });

      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
      popoverTrigger.focus();
      await act(async () => {
        await user.keyboard('[Space]');
      });
      expect(screen.queryByTestId('popover-content')).toBeInTheDocument();
    });

    it('should close popover on ESC pressed click when open', async () => {
      await act(async () => {
        render({ initialOpen: true });
      });

      expect(screen.queryByTestId('popover-content')).toBeInTheDocument();
      await act(async () => {
        await user.keyboard('[Escape]');
      });
      expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
    });
  });

  it('should show popover content when initialOpen=true', async () => {
    await act(async () => {
      render({ initialOpen: true });
    });
    expect(screen.getByTestId('popover-content')).toBeInTheDocument();
  });

  it('should not show popover content when initialOpen=false', async () => {
    await act(async () => {
      render({ initialOpen: false });
    });

    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
  });

  test.each(Object.values(PopoverVariant))(
    'should render popover with correct variant',
    async (variant) => {
      await act(async () => {
        render({ variant: variant, initialOpen: true });
      });
      const otherColors = Object.values(PopoverVariant).filter(
        (v) => v !== variant,
      );

      expect(screen.queryByTestId('popover-content-test-id')).toBeInTheDocument;
      const popoverContent = screen.getByTestId('popover-content-test-id');

      expect(popoverContent.classList.contains(variant)).toBe(true);
      otherColors.forEach((v) => {
        expect(popoverContent.classList.contains(v)).toBe(false);
      });
    },
  );
});
