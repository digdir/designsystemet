import type {
  CssColor,
  SemanticColorNames,
} from '@digdir/designsystemet/internal';
import {
  convertColor,
  generateColorSchemes,
  getCssVariable,
  getLuminanceFromColor,
} from '@digdir/designsystemet/internal';
import {
  Button,
  Dialog,
  Heading,
  Paragraph,
  Select,
} from '@digdir/designsystemet-react';
import { ClipboardButton } from '@internal/components';
import { ArrowRightIcon, ArrowUndoIcon } from '@navikt/aksel-icons';
import { useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useColorOverride } from '~/_hooks/use-color-override';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
import classes from './color-modal.module.css';
import { capitalizeFirstLetter, getColorCombinations } from './util';

type ColorModalProps = {
  colorModalRef: React.Ref<HTMLDialogElement> | null;
  /** Color name, e.g. `accent` */
  namespace: string;
  /** Semantic token name of the step, e.g. `background-default` */
  tokenName: SemanticColorNames;
};

export const ColorModal = ({
  colorModalRef,
  namespace,
  tokenName,
}: ColorModalProps) => {
  const { t } = useTranslation();
  const headingId = useId();
  const overrideRef = useRef<HTMLDivElement>(null);
  const [colorFormat, setColorFormat] = useState('oklch');
  const { colors, severityColors, colorScheme } = useThemebuilder();
  const { isOverridden, resetOverride } = useColorOverride(
    namespace,
    tokenName,
  );

  /* Look up the step from loader data on every render so overrides are reflected */
  const colorTheme = [...colors, ...severityColors].find(
    (theme) => theme.name === namespace,
  );
  const color = colorTheme?.colors[colorScheme][tokenName];

  if (!color) return null;

  const { displayName, name, number, hex } = color;

  /* The loader replaces the generated hex with the override, so regenerate
     the scale from the base color (same as the loader) to show the original */
  const generatedHex =
    isOverridden && colorTheme?.hex
      ? generateColorSchemes(colorTheme.hex as CssColor)[colorScheme][tokenName]
          .hex
      : undefined;
  const convertedColor = convertColor(hex, colorFormat);
  const cssVariable = getCssVariable(namespace, number);

  return (
    <Dialog
      ref={colorModalRef}
      closedby='any'
      aria-labelledby={headingId}
      style={{
        maxWidth: '650px',
      }}
    >
      <Dialog.Block>
        <Heading id={headingId} data-size='xs'>
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
        <div
          ref={overrideRef}
          tabIndex={-1}
          aria-live='polite'
          className={classes.override}
          data-overridden={isOverridden || undefined}
        >
          {isOverridden ? (
            <>
              <div className={classes.overrideText}>
                <Paragraph data-size='sm'>
                  {t(`color-modal.override.overridden-${colorScheme}`)}{' '}
                  {t('color-modal.override.check-contrast')}
                </Paragraph>
                {generatedHex && (
                  <Paragraph data-size='sm' className={classes.fromTo}>
                    <span className='ds-sr-only'>
                      {t('color-modal.override.from')}
                    </span>
                    <span
                      className={classes.fromToSwatch}
                      style={{ backgroundColor: generatedHex }}
                    />
                    <code>{generatedHex}</code>
                    <ArrowRightIcon aria-hidden />
                    <span className='ds-sr-only'>
                      {t('color-modal.override.to')}
                    </span>
                    <span
                      className={classes.fromToSwatch}
                      style={{ backgroundColor: hex }}
                    />
                    <code>{hex}</code>
                  </Paragraph>
                )}
              </div>
              <Button
                variant='secondary'
                data-size='sm'
                onClick={() => {
                  resetOverride();
                  /* The button disappears after reset, keep focus in the section */
                  overrideRef.current?.focus();
                }}
              >
                <ArrowUndoIcon aria-hidden />
                {t('color-modal.override.reset')}
              </Button>
            </>
          ) : (
            <Paragraph data-size='sm'>
              {t(`color-modal.override.hint-${colorScheme}`)}
            </Paragraph>
          )}
        </div>
        <div data-size='sm' className={classes.grid}>
          <Paragraph className={classes.key}>
            {t('color-modal.hexcode')}
          </Paragraph>
          <Paragraph asChild className={classes.value}>
            <div>
              <code>{hex}</code>
              <ClipboardButton value={hex} />
            </div>
          </Paragraph>
          <Select
            value={colorFormat}
            onChange={(event) => setColorFormat(event.target.value)}
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
          <Paragraph className={classes.value}>
            <code>{convertedColor}</code>
            <ClipboardButton value={convertedColor} />
          </Paragraph>
          <Paragraph className={classes.key}>
            {t('color-modal.css-variable')}
          </Paragraph>
          <Paragraph className={classes.value}>
            <code>{cssVariable}</code>
            <ClipboardButton value={cssVariable} />
          </Paragraph>
          <Paragraph className={classes.key}>
            {t('color-modal.relative-luminance')}
          </Paragraph>
          <Paragraph className={classes.value}>
            {getLuminanceFromColor(hex).toFixed(3)}
          </Paragraph>
          {number !== 9 && number !== 10 && number !== 11 && (
            <>
              <Paragraph className={classes.key}>
                {t('color-modal.can-be-used-against')}
              </Paragraph>
              <Paragraph className={classes.value}>
                {/* @ts-ignore -- we trust the string passed to t() here */}
                {t(getColorCombinations(number))}
              </Paragraph>
            </>
          )}
        </div>
      </Dialog.Block>
    </Dialog>
  );
};
