import type { Color } from '@digdir/designsystemet/internal';
import {
  convertColor,
  getCssVariable,
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
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import classes from './color-modal.module.css';
import { capitalizeFirstLetter, getColorCombinations } from './util';

type ColorModalProps = {
  colorModalRef: React.Ref<HTMLDialogElement> | null;
  namespace: string;
  color: Color;
};

export const ColorModal = ({
  colorModalRef,
  namespace,
  color,
}: ColorModalProps) => {
  const { displayName, name, number, hex } = color;
  const [convertedColor, setConvertedColor] = useState<string>(
    convertColor(hex, 'oklch'),
  );
  const { t } = useTranslation();

  // TMP: Quick fix to give variable names without namespace specified
  const cssVariable = getCssVariable(namespace, name).replace(
    `--ds-color-${namespace}-`,
    `--ds-color-`,
  );
  const handleColorFormat = (event: ChangeEvent<HTMLSelectElement>) => {
    setConvertedColor(convertColor(hex, event.target.value));
  };

  return (
    <Dialog ref={colorModalRef} closedby='any' style={{ maxWidth: 650 }}>
      <Dialog.Block>
        <Heading data-size='xs'>
          {`${capitalizeFirstLetter(namespace)} ${displayName}`}
        </Heading>
      </Dialog.Block>
      <div
        className={classes.colorPreview}
        style={{ backgroundColor: hex }}
      ></div>
      <Dialog.Block className={classes.modalContent}>
        <Paragraph data-size='sm' className={classes.description}>
          {t(`color-metadata.${name}.long`)}
        </Paragraph>
        <Table
          data-size='sm'
          style={
            {
              '--dsc-table-border-width': '0',
              '--dsc-table-padding':
                'var(--ds-size-2) var(--ds-size-4) var(--ds-size-2) 0',
            } as React.CSSProperties
          }
        >
          <tbody>
            <tr>
              <th scope='row' style={{ width: '20ch' }}>
                {t('color-modal.hexcode')}
              </th>
              <td>
                <code>{hex}</code>
                <ClipboardButton value={hex} />
              </td>
            </tr>
            <tr>
              <th scope='row'>
                <Select
                  defaultValue='oklch'
                  onChange={handleColorFormat}
                  aria-label={t('color-modal.colorformat')}
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
              <th scope='row'>{t('color-modal.html-attribute')}</th>
              <td>
                <code>data-color="{namespace}"</code>
                <ClipboardButton value={`data-color="${namespace}"`} />
              </td>
            </tr>
            <tr>
              <th scope='row'>{t('color-modal.css-variable')}</th>
              <td>
                <code>{cssVariable}</code>
                <ClipboardButton value={cssVariable} />
              </td>
            </tr>
            <tr>
              <th scope='row'>{t('color-modal.relative-luminance')}</th>
              <td>{getLuminanceFromColor(hex).toFixed(3)}</td>
            </tr>
            {number !== 9 && number !== 10 && number !== 11 && (
              <tr>
                <th scope='row'>{t('color-modal.can-be-used-against')}</th>
                <td>
                  {/* @ts-ignore -- we trust the string passed to t() here */}
                  {t(getColorCombinations(number))}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Dialog.Block>
    </Dialog>
  );
};
