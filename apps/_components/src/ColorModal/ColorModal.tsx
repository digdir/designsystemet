import { Dialog, Heading, Paragraph } from '@digdir/designsystemet-react';
import type { ColorNumber } from '@digdir/designsystemet/color';
import {
  getColorInfoFromPosition,
  getCssVariable,
  hexToHsluv,
} from '@digdir/designsystemet/color';
import { ClipboardButton } from '@repo/components';

import classes from './ColorModal.module.css';
import {
  capitalizeFirstLetter,
  getColorCombinations,
  getColorDescription,
} from './colorModalUtils';

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
      {label && (
        <Paragraph data-size='sm' className={classes.label}>
          {label}
        </Paragraph>
      )}
      <Paragraph data-size='sm' className={classes.value}>
        {value}
      </Paragraph>
      {copyBtn && <ClipboardButton value={value} />}
    </div>
  );
};

type ColorModalProps = {
  colorModalRef: React.Ref<HTMLDialogElement> | null;
  hex: string;
  namespace: string;
  weight: ColorNumber;
};

export const ColorModal = ({
  colorModalRef,
  hex,
  namespace,
  weight,
}: ColorModalProps) => {
  return (
    <Dialog
      ref={colorModalRef}
      style={{
        maxWidth: '1100px',
      }}
      backdropClose
    >
      <Dialog.Block>
        <Heading data-size='xs'>
          {`${capitalizeFirstLetter(namespace)} ${capitalizeFirstLetter(getColorInfoFromPosition(weight).displayName)}`}
        </Heading>
      </Dialog.Block>
      <Dialog.Block className={classes.modalContent}>
        <div className={classes.description}>
          {getColorDescription({
            weight,
            namespace,
          })}
        </div>
        <div className={classes.container}>
          <table className={classes.infoTable}>
            <tbody>
              <tr>
                <th scope='row'>Hexkode:</th>
                <td>{hex}</td>
                <td>
                  <ClipboardButton value={hex} />
                </td>
              </tr>
              <tr>
                <th scope='row'>HSLuv:</th>
                <td colSpan={2}>
                  {hexToHsluv(hex)[0].toFixed(0) +
                    '° ' +
                    hexToHsluv(hex)[1].toFixed(0) +
                    '% ' +
                    hexToHsluv(hex)[2].toFixed(0) +
                    '%'}
                </td>
              </tr>
              <tr>
                <th scope='row'>CSS variabel:</th>
                <td>{getCssVariable(namespace, weight)}</td>
                <td>
                  <ClipboardButton value={getCssVariable(namespace, weight)} />
                </td>
              </tr>
              {weight !== 9 && weight !== 10 && weight !== 11 && (
                <tr>
                  <th scope='row'>Brukes mot:</th>
                  <td colSpan={2}>{getColorCombinations(weight)}</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className={classes.right} style={{ backgroundColor: hex }}></div>
        </div>
      </Dialog.Block>
    </Dialog>
  );
};
