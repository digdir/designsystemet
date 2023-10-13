import React, { useState } from 'react';
import { act, render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { PopoverProps } from './Popover';

import { Popover } from './';

const Comp = (args: Partial<PopoverProps>) => {
  const ref = React.useRef(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        ref={ref}
        onClick={() => setOpen(!open)}
      >
        trigger
      </button>
      <Popover
        open={open || args?.open}
        {...args}
        anchorEl={ref.current}
      >
        <Popover.Content>popover content</Popover.Content>
      </Popover>
    </>
  );
};

const render = (props: Partial<PopoverProps> = {}) => {
  renderRtl(<Comp {...props} />);
};

const user = userEvent.setup();

describe('Popover', () => {
  it('should render popover on trigger-click when closed', async () => {
    render();
    const popoverTrigger = screen.getByRole('button');

    expect(screen.queryByText('popover content')).not.toBeInTheDocument();
    await act(async () => {
      await user.click(popoverTrigger);
    });
    expect(screen.queryByText('popover content')).toBeInTheDocument();
  });

  it('should close when we click the button twitce', async () => {
    render();
    const popoverTrigger = screen.getByRole('button');

    await act(async () => {
      await user.click(popoverTrigger);
    });
    expect(screen.queryByText('popover content')).toBeInTheDocument();
    await act(async () => {
      await user.click(popoverTrigger);
    });
    expect(screen.queryByText('popover content')).not.toBeInTheDocument();
  });

  it('should close when we click outside', async () => {
    render();
    const popoverTrigger = screen.getByRole('button');

    await act(async () => {
      await user.click(popoverTrigger);
    });
    expect(screen.queryByText('popover content')).toBeInTheDocument();
    await act(async () => {
      await user.click(document.body);
    });
    expect(screen.queryByText('popover content')).not.toBeInTheDocument();
  });

  it('should close when we press ESC', async () => {
    render();

    const popoverTrigger = screen.getByRole('button');

    await act(async () => {
      await user.click(popoverTrigger);
    });
    expect(screen.queryByText('popover content')).toBeInTheDocument();
    await act(async () => {
      await user.keyboard('[Escape]');
    });
    expect(screen.queryByText('popover content')).not.toBeInTheDocument();
  });

  it('should close when we press SPACE', async () => {
    render();
    const popoverTrigger = screen.getByRole('button');

    await act(async () => {
      await user.click(popoverTrigger);
    });
    expect(screen.queryByText('popover content')).toBeInTheDocument();
    await act(async () => {
      await user.keyboard('[Space]');
    });
    expect(screen.queryByText('popover content')).not.toBeInTheDocument();
  });
});
