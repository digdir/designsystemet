'use client';
import {
  Dialog,
  Heading,
  Paragraph,
  Select,
} from '@digdir/designsystemet-react';
import { useState } from 'react';

import type { Color } from '@digdir/designsystemet/color';
import {
  convertColor,
  getLightnessFromHex,
  getLuminanceFromLightness,
} from '@digdir/designsystemet/color';
import { getCssVariable } from '@digdir/designsystemet/color';
import { ClipboardButton } from '@repo/components';
import type { ChangeEvent } from 'react';

import classes from './ColorModal.module.css';
import { capitalizeFirstLetter, getColorCombinations } from './colorModalUtils';

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
  const { displayName, description, number, hex } = color;
  const [convertedColor, setConvertedColor] = useState<string>(
    convertColor(hex, 'oklch'),
  );
  const luminance = getLuminanceFromLightness(getLightnessFromHex(hex)).toFixed(
    3,
  );
  /* store user preference in localstorage? */
  const handleColorFormat = (event: ChangeEvent<HTMLSelectElement>) => {
    setConvertedColor(convertColor(hex, event.target.value));
  };

  return (
    <Dialog
      ref={colorModalRef}
      closedby='any'
      style={{
        maxWidth: '650px',
      }}
    >
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
        <div className={classes.description}>{description.long}</div>
        <div data-size='sm' className={classes.grid}>
          <Paragraph className={classes.key}>Hexkode</Paragraph>
          <Paragraph asChild className={classes.value}>
            <div>
              {hex} <ClipboardButton value={hex} />
            </div>
          </Paragraph>
          <Select defaultValue='oklch' onChange={handleColorFormat}>
            <Select.Option value='hct'>HCT</Select.Option>
            <Select.Option value='hsluv'>HSLUV</Select.Option>
            <hr />
            <Select.Option value='hsl'>HSL</Select.Option>
            <Select.Option value='oklab'>OKLAB</Select.Option>
            <Select.Option value='oklch'>OKLCH</Select.Option>
            <Select.Option value='p3'>P3</Select.Option>
            <Select.Option value='rgb'>RGB</Select.Option>
            <Select.Option value='rgba'>RGBA</Select.Option>
          </Select>
          <Paragraph asChild className={classes.value}>
            <div>
              {convertedColor}
              <ClipboardButton value={convertedColor} />
            </div>
          </Paragraph>
          <Paragraph className={classes.key}>CSS variabel</Paragraph>
          <Paragraph asChild className={classes.value}>
            <div>
              {getCssVariable(namespace, number)}
              <ClipboardButton value={getCssVariable(namespace, number)} />
            </div>
          </Paragraph>
          <Paragraph className={classes.key}>Relativ luminans</Paragraph>
          <Paragraph className={classes.value}>{luminance}</Paragraph>
          {number !== 9 && number !== 10 && number !== 11 && (
            <>
              <Paragraph className={classes.key}>Kan brukes mot</Paragraph>
              <Paragraph className={classes.value}>
                {getColorCombinations(number)}
              </Paragraph>
            </>
          )}
        </div>
      </Dialog.Block>
    </Dialog>
  );
};
