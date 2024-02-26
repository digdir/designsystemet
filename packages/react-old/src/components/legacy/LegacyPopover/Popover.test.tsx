import userEvent from '@testing-library/user-event';
import { act, render as renderRtl, screen } from '@testing-library/react';

import type { LegacyPopoverProps } from './Popover';
import { popoverVariants, LegacyPopover } from './Popover';

const render = (props: Partial<LegacyPopoverProps> = {}) => {
  const allProps: LegacyPopoverProps = {
    children: (
      <div>
        <button>My button</button>
        Popover text
      </div>
    ),
    trigger: <button>Open</button>,
    ...props,
  };
  renderRtl(<LegacyPopover {...allProps} />);
};

const user = userEvent.setup();

describe('Popover', () => {
  describe('trigger uncontrolled', () => {
    it('should render trigger', () => {
      render();
      const popoverTrigger = screen.getByRole('button', { name: 'Open' });

      expect(popoverTrigger).toBeInTheDocument();
    });

    it('should open popover on trigger click when closed', async () => {
      render();
      const popoverTrigger = screen.getByRole('button', { name: 'Open' });

      expect(screen.queryByText('Popover text')).not.toBeInTheDocument();
      await act(async () => user.click(popoverTrigger));
      expect(screen.queryByText('Popover text')).toBeInTheDocument();
    });

    it('should close popover on trigger click when open', async () => {
      render({ initialOpen: true });
      const popoverTrigger = screen.getByRole('button', { name: 'Open' });

      expect(screen.queryByText('Popover text')).toBeInTheDocument();
      await act(async () => user.click(popoverTrigger));
      expect(screen.queryByText('Popover text')).not.toBeInTheDocument();
    });

    it('should open popover on SPACE pressed when closed', async () => {
      render();
      const popoverTrigger = screen.getByRole('button', { name: 'Open' });

      expect(screen.queryByText('Popover text')).not.toBeInTheDocument();
      popoverTrigger.focus();
      await act(async () => {
        await user.keyboard('[Space]');
      });
      expect(screen.queryByText('Popover text')).toBeInTheDocument();
    });

    it('should close popover on ESC pressed click when open', async () => {
      render({ initialOpen: true });

      expect(screen.queryByText('Popover text')).toBeInTheDocument();
      await act(async () => {
        await user.keyboard('[Escape]');
      });
      expect(screen.queryByText('Popover text')).not.toBeInTheDocument();
    });
  });

  it('should show popover content when initialOpen=true', () => {
    render({ initialOpen: true });

    expect(screen.queryByText('Popover text')).toBeInTheDocument();
  });

  it('should not show popover content when initialOpen=false', () => {
    render({ initialOpen: false });

    expect(screen.queryByText('Popover text')).not.toBeInTheDocument();
  });

  it('should retain focus on trigger when popover opens', async () => {
    render();

    const popoverTrigger = screen.getByRole('button', { name: 'Open' });
    expect(screen.queryByText('Popover text')).not.toBeInTheDocument();
    popoverTrigger.focus();
    await act(async () => {
      await user.keyboard('[Space]');
    });
    expect(popoverTrigger).toHaveFocus();
  });

  it('should focus focasable content on tab', async () => {
    render();

    const popoverTrigger = screen.getByRole('button', { name: 'Open' });
    expect(screen.queryByText('Popover text')).not.toBeInTheDocument();
    popoverTrigger.focus();
    await act(async () => {
      await user.keyboard('[Space]');
    });
    const contentButton = screen.getByRole('button', { name: 'My button' });
    await act(async () => {
      await user.keyboard('[Tab]');
    });
    expect(contentButton).toHaveFocus();
  });

  test.each(popoverVariants)(
    'should render popover with correct variant when variant is %s',
    (variant) => {
      render({ variant: variant, initialOpen: true });
      const otherColors = popoverVariants.filter((v) => v !== variant);

      const popoverContent = screen.getByRole('dialog');
      expect(popoverContent).toBeInTheDocument();

      expect(popoverContent.classList).toContain(variant);
      otherColors.forEach((v) => {
        expect(popoverContent.classList).not.toContain(v);
      });
    },
  );
});
