import type { Color } from '@digdir/designsystemet/internal';
import {
  convertColor,
  getLuminanceFromColor,
} from '@digdir/designsystemet/internal';
import {
  Dialog,
  Heading,
  Paragraph,
  Select,
  Table,
} from '@digdir/designsystemet-react';
import { ClipboardButton } from '@internal/components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import classes from './color-step-dialog.module.css';
import { capitalizeFirstLetter, getColorCombinations } from './util';

type ColorStepDialogProps = {
  /** The name of the color the step belongs to */
  namespace: string;
  color: Color;
  onClose: () => void;
};

/** A dialog with details about one step of a color. It is open while it is rendered. */
export const ColorStepDialog = ({
  namespace,
  color,
  onClose,
}: ColorStepDialogProps) => {
  const { displayName, name, number, hex } = color;
  const [format, setFormat] = useState('oklch');
  const { t } = useTranslation();

  const convertedColor = convertColor(hex, format);
  const cssVariable = `--ds-color-${name}`;
  const combinations = getColorCombinations(number);

  return (
    <Dialog open closedby='any' className={classes.dialog} onClose={onClose}>
      <Dialog.Block>
        <Heading data-size='xs'>
          {`${capitalizeFirstLetter(namespace)} ${displayName}`}
        </Heading>
      </Dialog.Block>
      <div
        className={classes.colorPreview}
        style={{ backgroundColor: hex }}
      ></div>
      <Dialog.Block className={classes.content}>
        <Paragraph data-size='sm' className={classes.description}>
          {t(`color-metadata.${name}.long`)}
        </Paragraph>
        <Table data-size='sm' className={classes.table}>
          <tbody>
            <tr>
              <th scope='row' className={classes.label}>
                {t('colorStepDialog.hexcode')}
              </th>
              <td>
                <code>{hex}</code>
                <ClipboardButton value={hex} />
              </td>
            </tr>
            <tr>
              <th scope='row'>
                <Select
                  value={format}
                  onChange={(event) => setFormat(event.target.value)}
                  aria-label={t('colorStepDialog.colorformat')}
                >
                  <Select.Option value='hct'>HCT</Select.Option>
                  <Select.Option value='hsluv'>HSLUV</Select.Option>
                  <hr />
                  <Select.Option value='hsl'>HSL</Select.Option>
                  <Select.Option value='hwb'>HWB</Select.Option>
                  <Select.Option value='oklch'>OKLCH</Select.Option>
                  <Select.Option value='p3'>P3</Select.Option>
                  <Select.Option value='rgb'>RGB</Select.Option>
                  <Select.Option value='xyz-d65'>XYZ-D65</Select.Option>
                </Select>
              </th>
              <td>
                <code>{convertedColor}</code>
                <ClipboardButton value={convertedColor} />
              </td>
            </tr>
            <tr>
              <th scope='row'>{t('colorStepDialog.html-attribute')}</th>
              <td>
                <code>data-color="{namespace}"</code>
                <ClipboardButton value={`data-color="${namespace}"`} />
              </td>
            </tr>
            <tr>
              <th scope='row'>{t('colorStepDialog.css-variable')}</th>
              <td>
                <code>{cssVariable}</code>
                <ClipboardButton value={cssVariable} />
              </td>
            </tr>
            <tr>
              <th scope='row'>{t('colorStepDialog.relative-luminance')}</th>
              <td>{getLuminanceFromColor(hex).toFixed(3)}</td>
            </tr>
            {combinations && (
              <tr>
                <th scope='row'>{t('colorStepDialog.can-be-used-against')}</th>
                <td>{t(combinations)}</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Dialog.Block>
    </Dialog>
  );
};
