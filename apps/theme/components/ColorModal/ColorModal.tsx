import { Modal } from '@digdir/designsystemet-react';
import type { ColorInfo, ColorType } from '@digdir/designsystemet/color';
import { getCssVariable, hexToHSL } from '@digdir/designsystemet/color';

import { CopyBtn } from '../CopyBtn/CopyBtn';

import classes from './ColorModal.module.css';

type ColorModalProps = {
  colorModalRef: React.RefObject<HTMLDialogElement>;
  color: { color: ColorInfo; type: ColorType };
};

const Field = ({
  label,
  value,
  copyBtn = false,
}: {
  label: string;
  value: string;
  copyBtn?: boolean;
}) => {
  return (
    <div className={classes.field}>
      <div className={classes.label}>{label}</div>
      <div className={classes.value}>{value}</div>
      {copyBtn && <CopyBtn text={value} />}
    </div>
  );
};

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const ColorModal = ({ colorModalRef, color }: ColorModalProps) => {
  return (
    <Modal
      ref={colorModalRef}
      style={{
        maxWidth: '1000px',
      }}
      className={classes.modal}
      onInteractOutside={() => colorModalRef.current?.close()}
    >
      <Modal.Header>
        {capitalizeFirstLetter(color.type) + ' ' + color.color.name}
      </Modal.Header>
      <Modal.Content className={classes.modalContent}>
        <div className={classes.container}>
          <div className={classes.left}>
            <Field
              label='Hexkode:'
              value={color.color.hex}
              copyBtn
            />
            <Field
              label='HSLuv:'
              value={
                hexToHSL(color.color.hex)[0].toFixed(0) +
                '° ' +
                hexToHSL(color.color.hex)[1].toFixed(0) +
                '% ' +
                hexToHSL(color.color.hex)[2].toFixed(0) +
                '%'
              }
            />
            <Field
              label='CSS variabel:'
              value={getCssVariable(color.type, color.color.number)}
              copyBtn
            />
            {/* <Field
              label='Illuminans terskel:'
              value='30-40%'
            />
            <div>
              Les mer om denne fargen <Link href='#'>her</Link>.
            </div> */}
          </div>
          <div
            className={classes.right}
            style={{ backgroundColor: color.color.hex }}
          ></div>
        </div>
      </Modal.Content>
    </Modal>
  );
};
