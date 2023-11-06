import React, { useRef } from 'react';
import { act, render as renderRtl, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from '../Button';

import type { ModalProps } from './Modal';

import { Modal } from './';

const HEADER_TITLE = 'Modal header title';

const Comp = (args: Partial<ModalProps>) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    console.log(modalRef.current);
    modalRef.current?.showModal();
  };

  return (
    <>
      <Button onClick={openModal}>Open Modal</Button>
      <Modal
        headerTitle={HEADER_TITLE}
        {...args}
        open
        ref={modalRef}
      >
        {args.children}
      </Modal>
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
  it('should render the modal', async () => {
    await render();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should render the close button', async () => {
    await render();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('should not render the close button when closeButton is false', async () => {
    await render({ closeButton: false });
    expect(
      screen.queryByRole('button', { name: /close/i }),
    ).not.toBeInTheDocument();
  });

  it('should render the header title', async () => {
    await render();
    expect(screen.getByText(HEADER_TITLE)).toBeInTheDocument();
  });

  it('should render the header subtitle', async () => {
    const headerSubtitle = 'Modal header subtitle';
    await render({ headerSubtitle });
    expect(screen.getByText(headerSubtitle)).toBeInTheDocument();
  });

  it('should render the children', async () => {
    const children = 'Modal children';
    await render({ children });
    expect(screen.getByText(children)).toBeInTheDocument();
  });

  it('should render the header divider', async () => {
    await render({ headerDivider: true });
    expect(document.querySelector(`.divider`)).toBeInTheDocument();
  });

  it('should not render the header divider', async () => {
    await render({ headerDivider: false });
    expect(document.querySelector(`.divider`)).toBeNull();
  });
});
