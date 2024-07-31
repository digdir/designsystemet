import { render as renderRtl, screen } from '@testing-library/react';
import { act } from 'react';
import userEvent from '@testing-library/user-event';

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

    expect(helpTextTrigger).toBeInTheDocument();
  });

  it('should open HelpText on trigger-click when closed', async () => {
    render();
    const helpTextTrigger = screen.getByRole('button');

    expect(screen.queryByText('Help')).not.toBeInTheDocument();
    await act(async () => {
      await user.click(helpTextTrigger);
    });
    expect(screen.queryByText('Help')).toBeInTheDocument();
  });

  it('should close HelpText on trigger-click when open', async () => {
    render();
    const helpTextTrigger = screen.getByRole('button');

    await act(async () => {
      await user.click(helpTextTrigger);
    });
    expect(screen.queryByText('Help')).toBeInTheDocument();
    await act(async () => {
      await user.click(helpTextTrigger);
    });
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
  });

  it('should open HelpText on SPACE pressed when closed', async () => {
    render();
    const helpTextTrigger = screen.getByRole('button');

    expect(screen.queryByText('Help')).not.toBeInTheDocument();
    helpTextTrigger.focus();
    await act(async () => {
      await user.keyboard('[Space]');
    });
    expect(screen.queryByText('Help')).toBeInTheDocument();
  });

  it('should close HelpText on ESC pressed when open', async () => {
    render();

    const helpTextTrigger = screen.getByRole('button');

    await act(async () => {
      await user.click(helpTextTrigger);
    });
    expect(screen.queryByText('Help')).toBeInTheDocument();
    await act(async () => {
      await user.keyboard('[Escape]');
    });
    expect(screen.queryByText('Help')).not.toBeInTheDocument();
  });

  it('should have `aria-expanded` set to `false` when closed', () => {
    render();
    const helpTextTrigger = screen.getByRole('button');

    expect(helpTextTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('should have `aria-expanded` set to `true` when open', async () => {
    render();
    const helpTextTrigger = screen.getByRole('button');

    await act(async () => {
      await user.click(helpTextTrigger);
    });
    expect(helpTextTrigger).toHaveAttribute('aria-expanded', 'true');
  });
});
