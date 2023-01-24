import React from 'react';
import { act, render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { HelpTextProps } from './HelpText';
import { HelpText } from './HelpText';

const render = (props: Partial<HelpTextProps> = {}) => {
  const allProps = {
    children: 'Help',
    ...props,
  };
  renderRtl(<HelpText {...allProps} />);
};

const user = userEvent.setup();

describe('HelpText', () => {
  it('should render HelpText button', async () => {
    await act(async () => {
      render();
    });
    const helpTextTrigger = screen.getByRole('button');

    expect(helpTextTrigger).toBeInTheDocument();
  });

  it('should open HelpText on trigger click when closed', async () => {
    await act(async () => {
      render();
    });
    const helpTextTrigger = screen.getByRole('button');

    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
    await act(async () => {
      await user.click(helpTextTrigger);
    });
    expect(screen.queryByTestId('popover-content')).toBeInTheDocument();
  });

  it('should close HelpText on trigger click when open', async () => {
    await act(async () => {
      render();
    });
    const helpTextTrigger = screen.getByRole('button');

    expect(screen.queryByTestId('popover-content')).toBeInTheDocument();
    await act(async () => {
      await user.click(helpTextTrigger);
    });
    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
  });

  it('should open HelpText on SPACE pressed when closed', async () => {
    await act(async () => {
      render();
    });
    const helpTextTrigger = screen.getByRole('button');

    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
    helpTextTrigger.focus();
    await act(async () => {
      await user.keyboard('[Space]');
    });
    expect(screen.queryByTestId('popover-content')).toBeInTheDocument;
  });

  it('should close HelpText on ESC pressed click when open', async () => {
    await act(async () => {
      render();
    });

    expect(screen.queryByTestId('popover-content')).toBeInTheDocument;
    await act(async () => {
      await user.keyboard('[Escape]');
    });
    expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument;
  });
});
