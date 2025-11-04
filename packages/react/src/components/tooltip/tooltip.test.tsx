import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

import type { TooltipProps } from './tooltip';
import { Tooltip } from './tooltip';

const render = async (props: Partial<TooltipProps> = {}) => {
  const allProps: TooltipProps = {
    children: <button data-testid='button'>My button</button>,
    content: 'Tooltip text',
    ...props,
  };
  /* Flush microtasks */
  await act(async () => {});
  const user = userEvent.setup();

  return {
    user,
    ...renderRtl(
      <Tooltip
        {...allProps}
        style={{
          //  @ts-ignore react does not want us to set css vars here
          '--dsc-tooltip-transition-duration': '0s',
        }}
      />,
    ),
  };
};

describe('Tooltip', () => {
  it('should render child', async () => {
    await render();
    const tooltipTrigger = screen.getByTestId('button');

    expect(tooltipTrigger).toBeInTheDocument();
  });

  it('should render tooltip on hover', async () => {
    const { user } = await render();
    const tooltipTrigger = screen.getByRole('button');

    expect(screen.getByText('Tooltip text')).not.toBeVisible();

    await act(async () => await user.hover(tooltipTrigger));

    const tooltip = await screen.findByText('Tooltip text');
    expect(tooltip).toBeVisible();
    expect(screen.getByText('Tooltip text')).toBeVisible();
  });

  it('should render tooltip on focus', async () => {
    const { user } = await render();

    expect(screen.queryByText('Tooltip text')).not.toBeVisible();
    await user.click(screen.getByTestId('button'));
    const tooltip = await screen.findByText('Tooltip text');
    expect(tooltip).toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).toBeVisible();
  });

  it('should render open when we pass open prop', async () => {
    await render({ open: true });

    expect(screen.getByRole('tooltip')).toBeVisible();
  });

  it('should have correct id and popovertarget attributes', async () => {
    await render({
      id: 'my-tooltip',
    });
    const trigger = screen.getByRole('button');
    const popover = screen.getByText('Tooltip text');

    expect(trigger.getAttribute('popovertarget')).toBe(popover.id);
  });

  it('should render span when children is a string', async () => {
    await render({ children: 'My string child' });
    const tooltipTrigger = screen.getByText('My string child');

    expect(tooltipTrigger.tagName).toBe('SPAN');
  });

  it('should be aria-describedby when there is text in the trigger', async () => {
    await render();
    const trigger = screen.getByRole('button');
    expect(trigger.getAttribute('aria-describedby')).toBeDefined();
  });

  it('should be aria-labelledby when there is no text in the trigger', async () => {
    await render({ children: <button /> });
    const trigger = screen.getByRole('button');
    expect(trigger.getAttribute('aria-labelledby')).toBeDefined();
  });
});
