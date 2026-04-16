import { act, render, screen } from '@testing-library/react';

import type { DialogProps } from './';
import { Dialog } from './';

const CLOSE_LABEL = 'Lukk dialogvindu';
const HEADER_TITLE = 'Dialog header title';
const OPEN_Dialog = 'Open Dialog';

const Comp = (args: Partial<DialogProps>) => (
  <Dialog.TriggerContext>
    <Dialog.Trigger>{OPEN_Dialog}</Dialog.Trigger>
    <Dialog {...args} />
  </Dialog.TriggerContext>
);

describe('Dialog', () => {
  it('should open the Dialog', async () => {
    render(
      <Comp>
        <Dialog.Block>{HEADER_TITLE}</Dialog.Block>
      </Comp>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const button = screen.getByRole('button', { name: OPEN_Dialog });
    await act(async () => button.click());

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should open and close the Dialog', async () => {
    render(<Comp />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const button = screen.getByRole('button', { name: OPEN_Dialog });
    await act(async () => button.click());
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: CLOSE_LABEL });
    await act(async () => closeButton.click());
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render the Dialog', () => {
    render(<Comp open />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should render the close button', () => {
    render(<Comp open />);
    expect(
      screen.getByRole('button', { name: CLOSE_LABEL }),
    ).toBeInTheDocument();
  });

  it('should not render the close button when closeButton is false', () => {
    render(<Comp open closeButton={false} />);
    expect(
      screen.queryByRole('button', { name: CLOSE_LABEL }),
    ).not.toBeInTheDocument();
  });

  it('should render the header title', () => {
    render(
      <Comp open>
        <Dialog.Block>{HEADER_TITLE}</Dialog.Block>
      </Comp>,
    );
    expect(screen.getByText(HEADER_TITLE)).toBeInTheDocument();
  });

  it('should render the children', () => {
    const children = 'Dialog children';
    render(<Comp open>{children}</Comp>);
    expect(screen.getByText(children)).toBeInTheDocument();
  });

  it('should call onClose when the Dialog is closed with ESC', async () => {
    const onClose = vi.fn();
    render(<Comp open onClose={onClose} />);
    const dialog = screen.getByRole('dialog');
    const esc = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
    await act(async () => dialog.dispatchEvent(esc));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when the Dialog is closed with the close button', async () => {
    const onClose = vi.fn();
    render(<Comp onClose={onClose} />);

    await act(async () =>
      screen.getByRole('button', { name: OPEN_Dialog }).click(),
    );
    await act(async () =>
      screen.getByRole('button', { name: CLOSE_LABEL }).click(),
    );
    vi.waitFor(
      () => expect(onClose).toHaveBeenCalledTimes(1), // Let native <dialog> close trigger
    );
  });

  it('a custom data-command=close button should close the dialog', async () => {
    const onClose = vi.fn();
    window.dsWarnings = false; // Suppress warnings about data-command being deprecated

    render(
      <Comp onClose={onClose} closeButton={false}>
        <Dialog.Block>
          <button data-command='close' data-testid='closebutton'>
            Close
          </button>
        </Dialog.Block>
      </Comp>,
    );

    screen.getByRole('button', { name: OPEN_Dialog }).click();
    await act(async () => screen.getByTestId('closebutton').click());
    expect(onClose).toHaveBeenCalledTimes(1);
    window.dsWarnings = true; // Re-enable warnings after test
  });
});
