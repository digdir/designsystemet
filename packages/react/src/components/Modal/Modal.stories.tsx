import type { Meta, StoryFn } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useRef, useState } from 'react';

import { Button, Combobox, Heading, Paragraph, Textfield } from '..';

import { Modal } from '.';

export default {
  title: 'Komponenter/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
    customStyles: {
      display: 'grid',
      alignItems: 'start',
      justifyItems: 'center',
      story: {
        boxSizing: 'border-box',
        height: '100cqh',
        width: '100cqw',
      },
    },
    chromatic: {
      modes: {
        mobile: {
          viewport: { height: 600 },
        },
        desktop: {
          viewport: { height: 1080 },
        },
      },
    },
  },
  play: async (ctx) => {
    // When not in Docs mode, automatically open the modal
    const canvas = within(ctx.canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    // Wait for modal to fade in before running tests
    const modal = canvas.getByRole('dialog');
    await new Promise<void>((resolve) => {
      modal.addEventListener('animationend', () => {
        resolve();
      });
    });

    await expect(modal).toBeInTheDocument();
    await expect(modal).toHaveAttribute('open');
  },
} satisfies Meta;

export const Preview: StoryFn<typeof Modal> = (args) => (
  <Modal.Context>
    <Modal.Trigger>Open Modal</Modal.Trigger>
    <Modal {...args}>
      <Heading style={{ marginBottom: 'var(--ds-spacing-2)' }}>
        Modal header
      </Heading>
      <Paragraph style={{ marginBottom: 'var(--ds-spacing-2)' }}>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis
        doloremque obcaecati assumenda odio ducimus sunt et.
      </Paragraph>
      <Paragraph size='sm'>Modal footer</Paragraph>
    </Modal>
  </Modal.Context>
);

export const WithoutModalContext: StoryFn<typeof Modal> = (args) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button onClick={() => modalRef.current?.showModal()}>Open Modal</Button>
      <Modal {...args} ref={modalRef}>
        <Paragraph size='sm'>Modal subtittel</Paragraph>
        <Heading style={{ marginBottom: 'var(--ds-spacing-2)' }}>
          Modal header
        </Heading>
        <Paragraph style={{ marginBottom: 'var(--ds-spacing-2)' }}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis
          doloremque obcaecati assumenda odio ducimus sunt et.
        </Paragraph>
        Modal footer
      </Modal>
    </>
  );
};

export const BackdropClose: StoryFn<typeof Modal> = () => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <Modal.Context>
      <Modal.Trigger>Open Modal</Modal.Trigger>
      <Modal ref={modalRef} backdropClose>
        <Heading>Modal med backdropClose og en veldig lang tittel</Heading>
        <Paragraph>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis
          doloremque obcaecati assumenda odio ducimus sunt et.
        </Paragraph>
        <Paragraph size='sm'>Modal footer</Paragraph>
      </Modal>
    </Modal.Context>
  );
};

export const WithHeaderAndFooter: StoryFn<typeof Modal> = () => (
  <Modal.Context>
    <Modal.Trigger>Open Modal</Modal.Trigger>
    <Modal>
      <Modal.Block>
        <Paragraph size='sm'>Her er det også divider</Paragraph>
        <Heading>Vi kan legge divider under header</Heading>
      </Modal.Block>
      <Modal.Block>
        <Paragraph style={{ marginBottom: 'var(--ds-spacing-2)' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
          sodales eros justo. Aenean non mi ipsum. Cras viverra elit nec
          vulputate mattis. Nunc placerat euismod pulvinar. Sed nec fringilla
          nulla, sit amet ultricies ante. Morbi egestas venenatis massa, eu
          interdum leo rutrum eu. Nulla varius, mi ac feugiat lacinia, magna
          eros ullamcorper arcu, vel tincidunt erat leo nec tortor. Sed ut dui
          arcu. Morbi commodo ipsum hendrerit est imperdiet imperdiet. Etiam sed
          maximus nisi. Quisque posuere posuere orci, non egestas risus
          facilisis a. Vivamus non tempus felis, in maximus lorem. Class aptent
          taciti sociosqu ad litora torquent per conubia nostra, per inceptos
          himenaeos.
        </Paragraph>
        <Paragraph>
          Etiam nec tincidunt est. Integer semper sodales efficitur.
          Pellentesque pellentesque varius leo id congue. Integer lacinia
          porttitor massa id euismod. Maecenas porta, magna nec interdum
          eleifend, risus magna condimentum neque, a gravida nisl risus a elit.
          Donec accumsan metus et lectus placerat varius. Donec tristique odio
          arcu. Donec cursus leo a dui auctor pulvinar. Sed in elit urna. Nunc
          vitae magna sed nibh elementum dignissim et ut massa.
        </Paragraph>
      </Modal.Block>
      <Modal.Block>Og over footer</Modal.Block>
    </Modal>
  </Modal.Context>
);

export const ModalWithForm: StoryFn<typeof Modal> = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [input, setInput] = useState('');

  return (
    <Modal.Context>
      <Modal.Trigger>Open Modal</Modal.Trigger>
      <Modal ref={modalRef} onClose={() => setInput('')} backdropClose>
        <Heading style={{ marginBottom: 'var(--ds-spacing-2)' }}>
          Modal med skjema
        </Heading>
        <Textfield
          // @ts-expect-error We want the native "autofocus" and Reacts onMount smartness (see https://react.dev/reference/react-dom/components/input#input)
          autofocus='true'
          label='Navn'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div
          style={{
            display: 'flex',
            gap: 'var(--ds-spacing-4)',
            marginTop: 'var(--ds-spacing-4)',
          }}
        >
          <Button
            onClick={() => {
              window.alert(`Du har sendt inn skjema med navn: ${input}`);
              modalRef.current?.close();
            }}
          >
            Send inn skjema
          </Button>
          <Button variant='secondary' onClick={() => modalRef.current?.close()}>
            Avbryt
          </Button>
        </div>
      </Modal>
    </Modal.Context>
  );
};

export const ModalWithMaxWidth: StoryFn<typeof Modal> = () => (
  <Modal.Context>
    <Modal.Trigger>Open Modal</Modal.Trigger>
    <Modal style={{ maxWidth: 1200 }}>
      <Heading style={{ marginBottom: 'var(--ds-spacing-2)' }}>
        Modal med en veldig lang bredde
      </Heading>
      <Paragraph>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis
        doloremque obcaecati assumenda odio ducimus sunt et.
      </Paragraph>
    </Modal>
  </Modal.Context>
);

export const ModalWithCombobox: StoryFn<typeof Modal> = () => {
  const modalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Modal.Context>
        <Modal.Trigger>Open Modal</Modal.Trigger>
        <Modal style={{ overflow: 'visible' }} ref={modalRef}>
          <Modal.Block>
            <Heading>Modal med combobox</Heading>
          </Modal.Block>
          <Modal.Block>
            <Combobox portal={false} label='Velg sted' autoFocus>
              <Combobox.Empty>Fant ingen treff</Combobox.Empty>
              <Combobox.Option value='leikanger'>Leikanger</Combobox.Option>
              <Combobox.Option value='oslo'>Oslo</Combobox.Option>
              <Combobox.Option value='bronnoysund'>Brønnøysund</Combobox.Option>
              <Combobox.Option value='stavanger'>Stavanger</Combobox.Option>
              <Combobox.Option value='trondheim'>Trondheim</Combobox.Option>
              <Combobox.Option value='tromso'>Tromsø</Combobox.Option>
              <Combobox.Option value='bergen'>Bergen</Combobox.Option>
              <Combobox.Option value='moirana'>Mo i Rana</Combobox.Option>
            </Combobox>
          </Modal.Block>
          <Modal.Block>
            <Button
              variant='secondary'
              onClick={() => modalRef.current?.close()}
            >
              Avbryt
            </Button>
          </Modal.Block>
        </Modal>
      </Modal.Context>
    </>
  );
};
