import { Modal } from '@/packages/react';
import type { CssColor } from '@adobe/leonardo-contrast-colors';

import { CopyBtn } from '../CopyBtn/CopyBtn';

import classes from './ColorModal.module.css';

type ColorModalProps = {
  colorModalRef: React.RefObject<HTMLDialogElement>;
  name: string;
  color: CssColor;
};

export const ColorModal = ({ colorModalRef, name, color }: ColorModalProps) => {
  return (
    <Modal
      ref={colorModalRef}
      style={{
        maxWidth: '1000px',
      }}
      className={classes.modal}
      onInteractOutside={() => colorModalRef.current?.close()}
    >
      <Modal.Header>{name}</Modal.Header>
      <Modal.Content className={classes.modalContent}>
        <div className={classes.container}>
          <div className={classes.left}>
            <div className={classes.field}>
              <div className={classes.label}>Hexkode:</div>
              <div className={classes.value}>{color}</div>
              <CopyBtn text={color} />
            </div>
          </div>
          <div
            className={classes.right}
            style={{ backgroundColor: color }}
          ></div>
        </div>
      </Modal.Content>
    </Modal>
  );
};
