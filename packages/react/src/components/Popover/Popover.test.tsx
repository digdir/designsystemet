import { act, render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { PopoverRootProps } from './PopoverRoot';

import { Popover } from './';

const contentText = 'popover content';

const Comp = (args: Partial<PopoverRootProps>) => {
  return (
    <Popover.Root {...args}>
      <Popover.Trigger>trigger</Popover.Trigger>
      <Popover.Content>{contentText}</Popover.Content>
    </Popover.Root>
  );
};

const render = async (props: Partial<PopoverRootProps> = {}) => {
  /* Flush microtasks */
  await act(async () => {});
  const user = userEvent.setup();

  return {
    user,
    ...renderRtl(<Comp {...props} />),
  };
};

describe('Popover', () => {
  it('should render popover on trigger-click when closed', async () => {
    const { user } = await render();
    const popoverTrigger = screen.getByRole('button');

    expect(screen.queryByText(contentText)).not.toBeInTheDocument();

    await user.click(popoverTrigger);

    expect(screen.queryByText(contentText)).toBeInTheDocument();
  });

  it('should close when we click the button twitce', async () => {
    const { user } = await render();
    const popoverTrigger = screen.getByRole('button');

    await user.click(popoverTrigger);

    expect(screen.queryByText(contentText)).toBeInTheDocument();

    await user.click(popoverTrigger);

    expect(screen.queryByText(contentText)).not.toBeInTheDocument();
  });

  it('should close when we click outside', async () => {
    const { user } = await render();
    const popoverTrigger = screen.getByRole('button');

    await user.click(popoverTrigger);

    expect(screen.queryByText(contentText)).toBeInTheDocument();

    await user.click(document.body);

    setTimeout(() => {
      expect(screen.queryByText(contentText)).not.toBeInTheDocument();
    }, 1000);
  });

  it('should close when we press ESC', async () => {
    const { user } = await render();
    const popoverTrigger = screen.getByRole('button');

    await user.click(popoverTrigger);

    expect(screen.queryByText(contentText)).toBeInTheDocument();

    await user.keyboard('[Escape]');

    setTimeout(() => {
      expect(screen.queryByText(contentText)).not.toBeInTheDocument();
    }, 1000);
  });

  it('should close when we press SPACE', async () => {
    const { user } = await render();
    const popoverTrigger = screen.getByRole('button');

    await user.click(popoverTrigger);

    expect(screen.queryByText(contentText)).toBeInTheDocument();

    await user.keyboard('[Space]');

    expect(screen.queryByText(contentText)).not.toBeInTheDocument();
  });

  it('should close when we press ENTER', async () => {
    const { user } = await render();
    const popoverTrigger = screen.getByRole('button');

    await user.click(popoverTrigger);

    expect(screen.queryByText(contentText)).toBeInTheDocument();

    await user.keyboard('[Enter]');

    expect(screen.queryByText(contentText)).not.toBeInTheDocument();
  });

  it('should not close if we click inside the popover', async () => {
    const { user } = await render();
    const popoverTrigger = screen.getByRole('button');

    await user.click(popoverTrigger);

    expect(screen.queryByText(contentText)).toBeInTheDocument();

    await user.click(screen.getByText(contentText));

    expect(screen.queryByText(contentText)).toBeInTheDocument();
  });

  it('should have correct aria attributes', async () => {
    const { user } = await render();
    const popoverTrigger = screen.getByRole('button');

    await user.click(popoverTrigger);

    const popoverContent = screen.getByText(contentText);

    expect(popoverTrigger.getAttribute('aria-controls')).toBe(
      popoverContent.id,
    );
    expect(popoverContent.getAttribute('aria-labelledby')).toBe(
      popoverTrigger.id,
    );
  });
});
