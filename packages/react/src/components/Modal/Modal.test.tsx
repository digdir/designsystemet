import { render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';

import type { ModalProps } from './';
import { Modal } from './';

const CLOSE_LABEL = 'Lukk dialogvindu';
const HEADER_TITLE = 'Modal header title';
const OPEN_MODAL = 'Open Modal';

const Comp = (args: Partial<ModalProps>) => {
  return (
    <>
      <Modal.Context>
        <Modal.Trigger>{OPEN_MODAL}</Modal.Trigger>
        <Modal {...args} />
      </Modal.Context>
    </>
  );
};

const render = async (props: Partial<ModalProps> = {}) => {
  /* Flush microtasks */
  await act(async () => {});
  const user = userEvent.setup();

  return {
    user,
    ...renderRtl(<Comp {...props} />),
  };
};

describe('Modal', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should open the modal', async () => {
    const { user } = await render({
      children: (
        <>
          <Modal.Header>{HEADER_TITLE}</Modal.Header>
        </>
      ),
    });
    const spy = vi.spyOn(HTMLDialogElement.prototype, 'showModal');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const button = screen.getByRole('button', { name: OPEN_MODAL });
    await act(async () => await user.click(button));

    expect(spy).toHaveBeenCalledTimes(1);

    expect(screen.queryByRole('dialog')).toBeInTheDocument();
  });

  it('should open and close the modal', async () => {
    const { user } = await render();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    const button = screen.getByRole('button', { name: OPEN_MODAL });
    await act(async () => await user.click(button));

    expect(screen.queryByRole('dialog')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: CLOSE_LABEL });
    await act(async () => await user.click(closeButton));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render the modal', async () => {
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
          <Modal.Header>{HEADER_TITLE}</Modal.Header>
        </>
      ),
    });
    expect(screen.getByText(HEADER_TITLE)).toBeInTheDocument();
  });

  it('should render the children', async () => {
    const children = 'Modal children';
    await render({ children, open: true });
    expect(screen.getByText(children)).toBeInTheDocument();
  });
});
