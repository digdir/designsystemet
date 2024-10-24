import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

import type { PopoverProps } from './';
import { Popover } from './';

const contentText = 'popover content';

const render = async (props: PopoverProps = {}) => {
  /* Flush microtasks */
  await act(async () => {});
  const user = userEvent.setup();

  return {
    user,
    ...renderRtl(
      <Popover.Context>
        <Popover.Trigger>trigger</Popover.Trigger>
        <Popover {...props}>{contentText}</Popover>
      </Popover.Context>,
    ),
  };
};

describe('Popover', () => {
  it('should render popover on trigger-click when closed', async () => {
    const { user } = await render();
    const popoverTrigger = screen.getByRole('button');

    expect(screen.queryByText(contentText)).not.toBeVisible();

    await act(async () => await user.click(popoverTrigger));

    expect(screen.queryByText(contentText)).toBeVisible();
  });

  it('should close when we click the button twitce', async () => {
    const { user } = await render();
    const popoverTrigger = screen.getByRole('button');

    await act(async () => await user.click(popoverTrigger));

    expect(screen.queryByText(contentText)).toBeVisible();

    await act(async () => await user.click(popoverTrigger));

    expect(screen.queryByText(contentText)).not.toBeVisible();
  });

  it('should close when we click outside', async () => {
    const { user } = await render();
    const popoverTrigger = screen.getByRole('button');

    await act(async () => await user.click(popoverTrigger));

    expect(screen.queryByText(contentText)).toBeVisible();

    await act(async () => await user.click(document.body));

    expect(screen.queryByText(contentText)).not.toBeVisible();
  });

  it('should close when we press ESC', async () => {
    const { user } = await render();
    const popoverTrigger = screen.getByRole('button');

    await act(async () => await user.click(popoverTrigger));

    expect(screen.queryByText(contentText)).toBeVisible();

    await act(async () => await user.keyboard('[Escape]'));

    expect(screen.queryByText(contentText)).not.toBeVisible();
  });

  it('should close when we press SPACE', async () => {
    const { user } = await render();
    const popoverTrigger = screen.getByRole('button');

    await act(async () => await user.click(popoverTrigger));

    expect(screen.queryByText(contentText)).toBeVisible();

    await act(async () => await user.keyboard('[Space]'));

    expect(screen.queryByText(contentText)).not.toBeVisible();
  });

  it('should close when we press ENTER', async () => {
    const { user } = await render();
    const popoverTrigger = screen.getByRole('button');

    await act(async () => await user.click(popoverTrigger));

    expect(screen.queryByText(contentText)).toBeVisible();

    await act(async () => await user.keyboard('[Enter]'));

    expect(screen.queryByText(contentText)).not.toBeVisible();
  });

  it('should not close if we click inside the popover', async () => {
    const { user } = await render();
    const popoverTrigger = screen.getByRole('button');

    await act(async () => await user.click(popoverTrigger));

    expect(screen.queryByText(contentText)).toBeVisible();

    await act(async () => await user.click(screen.getByText(contentText)));

    expect(screen.queryByText(contentText)).toBeVisible();
  });

  it('should have correct id and popovertarget attributes', async () => {
    await render();
    const trigger = screen.getByRole('button');
    const popover = screen.getByText(contentText);

    expect(trigger.getAttribute('popovertarget')).toBe(popover.id);
  });
});
