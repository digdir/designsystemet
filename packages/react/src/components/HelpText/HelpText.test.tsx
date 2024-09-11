import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

import type { HelpTextProps } from './HelpText';
import { HelpText } from './HelpText';

const render = (props: Partial<HelpTextProps> = {}) => {
  const allProps = {
    ...props,
  };
  renderRtl(
    <HelpText title={'Helptext for test'} {...allProps}>
      Help
    </HelpText>,
  );
};

const user = userEvent.setup();

describe('HelpText', () => {
  it('should render HelpText button', () => {
    render();
    const helpTextTrigger = screen.getByRole('button');

    expect(helpTextTrigger).toBeVisible();
  });

  it('should open HelpText on trigger-click when closed', async () => {
    render();
    const helpTextTrigger = screen.getByRole('button');

    expect(screen.queryByText('Help')).not.toBeVisible();
    await act(async () => {
      await user.click(helpTextTrigger);
    });
    expect(screen.queryByText('Help')).toBeVisible();
  });

  it('should close HelpText on trigger-click when open', async () => {
    render();
    const helpTextTrigger = screen.getByRole('button');

    await act(async () => {
      await user.click(helpTextTrigger);
    });
    expect(screen.queryByText('Help')).toBeVisible();
    await act(async () => {
      await user.click(helpTextTrigger);
    });
    expect(screen.queryByText('Help')).not.toBeVisible();
  });

  it('should open HelpText on SPACE pressed when closed', async () => {
    render();
    const helpTextTrigger = screen.getByRole('button');

    expect(screen.queryByText('Help')).not.toBeVisible();
    helpTextTrigger.focus();
    await act(async () => {
      await user.keyboard('[Space]');
    });
    expect(screen.queryByText('Help')).toBeVisible();
  });

  it('should close HelpText on ESC pressed when open', async () => {
    render();

    const helpTextTrigger = screen.getByRole('button');

    await act(async () => {
      await user.click(helpTextTrigger);
    });
    expect(screen.queryByText('Help')).toBeVisible();
    await act(async () => {
      await user.keyboard('[Escape]');
    });
    expect(screen.queryByText('Help')).not.toBeVisible();
  });
});
