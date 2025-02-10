import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

import type { DialogProps } from '.';
import { Dialog } from '.';

const CLOSE_LABEL = 'Lukk dialogvindu';
const HEADER_TITLE = 'Dialog header title';
const OPEN_Dialog = 'Open Dialog';

const Comp = (args: Partial<DialogProps>) => {
  return (
    <>
      <Dialog.TriggerContext>
        <Dialog.Trigger>{OPEN_Dialog}</Dialog.Trigger>
        <Dialog {...args} />
      </Dialog.TriggerContext>
    </>
  );
};

const render = async (props: Partial<DialogProps> = {}) => {
  /* Flush microtasks */
  await act(async () => {});
  const user = userEvent.setup();

  return {
    user,
    ...renderRtl(<Comp {...props} />),
  };
};

describe('Dialog', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should open the Dialog', async () => {
    const { user } = await render({
      children: (
        <>
          <Dialog.Block>{HEADER_TITLE}</Dialog.Block>
        </>
      ),
    });
    const spy = vi.spyOn(HTMLDialogElement.prototype, 'showModal');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const button = screen.getByRole('button', { name: OPEN_Dialog });
    await act(async () => await user.click(button));

    expect(spy).toHaveBeenCalledTimes(1);

    expect(screen.queryByRole('dialog')).toBeInTheDocument();
  });

  it('should open and close the Dialog', async () => {
    const { user } = await render();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const button = screen.getByRole('button', { name: OPEN_Dialog });
    await act(async () => await user.click(button));

    expect(screen.queryByRole('dialog')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: CLOSE_LABEL });
    await act(async () => await user.click(closeButton));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render the Dialog', async () => {
    await render({ open: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should render the close button', async () => {
    await render({ open: true });
    expect(
      screen.getByRole('button', { name: CLOSE_LABEL }),
    ).toBeInTheDocument();
  });

  it('should not render the close button when closeButton is false', async () => {
    await render({
      open: true,
      closeButton: false,
    });
    expect(
      screen.queryByRole('button', { name: CLOSE_LABEL }),
    ).not.toBeInTheDocument();
  });

  it('should render the header title', async () => {
    await render({
      open: true,
      children: (
        <>
          <Dialog.Block>{HEADER_TITLE}</Dialog.Block>
        </>
      ),
    });
    expect(screen.getByText(HEADER_TITLE)).toBeInTheDocument();
  });

  it('should render the children', async () => {
    const children = 'Dialog children';
    await render({ children, open: true });
    expect(screen.getByText(children)).toBeInTheDocument();
  });

  it('should call onClose when the Dialog is closed with ESC', async () => {
    const onClose = vi.fn();
    await render({ open: true, onClose });
    const dialog = screen.getByRole('dialog');
    await act(async () => await userEvent.type(dialog, '{Escape}'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when the Dialog is closed with the close button', async () => {
    const onClose = vi.fn();
    await render({ open: true, onClose });
    const closeButton = screen.getByRole('button', { name: CLOSE_LABEL });
    await act(async () => await userEvent.click(closeButton));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
