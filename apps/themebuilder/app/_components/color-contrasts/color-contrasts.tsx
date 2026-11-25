import type {
  Color,
  SemanticColorNames,
} from '@digdir/designsystemet/internal';
import { getContrastFromHex } from '@digdir/designsystemet/internal';
import {
  Field,
  Heading,
  Paragraph,
  Select,
} from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '~/_hooks/use-color-scheme';
import {
  getContrastLevel,
  getContrastTargets,
  getMinContrast,
  textAndBorderSteps,
} from '~/model/contrast';
import { useThemeStore } from '~/model/theme-store';
import classes from './color-contrasts.module.css';

const baseFills: SemanticColorNames[] = [
  'base-default',
  'base-hover',
  'base-active',
];
const baseContrasts: SemanticColorNames[] = [
  'base-contrast-subtle',
  'base-contrast-default',
];

const levels = [
  { level: 'AAA', description: 'colorContrasts.aaa-description' },
  { level: 'AA', description: 'colorContrasts.aa-description' },
  { level: 'AA18', description: 'colorContrasts.aa18-description' },
  { level: 'DECO', description: 'colorContrasts.deco-description' },
] as const;

export const ColorContrasts = () => {
  const { t } = useTranslation();
  return (
    <div className='panelContainer'>
      <div className='panelLeft'>
        <div className='panelTop'>
          <Heading data-size='xs'>{t('colorContrasts.title')}</Heading>
          <Paragraph data-size='sm'>
            {t('colorContrasts.description')}
          </Paragraph>

          <div>
            {levels.map(({ level, description }) => (
              <div key={level} className={classes.tagGroup}>
                <div className={cl(classes.tag, classes[level])}>{level}</div>
                <Paragraph data-size='sm'>{t(description)}</Paragraph>
              </div>
            ))}
            <div className={classes.tagGroup}>
              <div className={classes.requirement}>
                {t('colorContrasts.min-contrast', { ratio: 'x' })}
              </div>
              <Paragraph data-size='sm'>
                {t('colorContrasts.min-contrast-description')}
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
      <div className='panelRight'>
        <ContrastTable
          title={t('colorContrasts.text-vs-background')}
          description={t('colorContrasts.text-vs-background-desc')}
          vertical={textAndBorderSteps}
          horizontal={getContrastTargets(textAndBorderSteps)}
        />
        <ContrastTable
          title={t('colorContrasts.base-colors')}
          description={t('colorContrasts.base-colors-description')}
          vertical={baseFills}
          horizontal={[
            // Not required by the spec, but the base color should have 3:1 against these to be meaningful
            'background-default',
            'background-tinted',
            'surface-default',
            ...baseContrasts,
          ]}
        />
      </div>
    </div>
  );
};

/** The contrast between every `vertical` and `horizontal` step of a color that is chosen above the table */
const ContrastTable = ({
  title,
  description,
  vertical,
  horizontal,
}: {
  title: string;
  description: string;
  vertical: SemanticColorNames[];
  horizontal: SemanticColorNames[];
}) => {
  const { t } = useTranslation();
  const [colorScheme] = useColorScheme();
  const { colors } = useThemeStore();
  const [selectedName, setSelectedName] = useState('');
  /* The first color is shown until one is chosen, and when the chosen one is removed from the theme */
  const selected =
    colors.find((color) => color.name === selectedName) || colors[0];
  const scale = selected.colors[colorScheme];

  return (
    <>
      <Heading data-size='2xs'>{title}</Heading>
      <Paragraph data-size='sm' className={classes.desc}>
        {description}
      </Paragraph>
      <Field className={classes.fieldGroup}>
        <Select
          data-size='sm'
          className={classes.select}
          onChange={(e) => setSelectedName(e.target.value)}
          aria-label={t('colorContrasts.select-color')}
          value={selected.name}
        >
          {colors.map((color) => (
            <Select.Option key={color.name} value={color.name}>
              {color.name}
            </Select.Option>
          ))}
        </Select>
      </Field>
      <section
        className={cl(classes.tableContainer, 'ds-focus')}
        tabIndex={0}
        aria-label={title}
      >
        <table className={classes.table}>
          <tbody>
            <tr>
              <th />
              {horizontal.map((color) => (
                <ThCell key={color} color={scale[color]} />
              ))}
            </tr>
            {vertical.map((color2) => (
              <tr key={color2}>
                <ThCell color={scale[color2]} />
                {horizontal.map((color1) => (
                  <td key={color1} className={classes.td}>
                    <TdCell
                      color1={scale[color1]}
                      color2={scale[color2]}
                      minContrast={getMinContrast(color1, color2)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
};

const ThCell = ({ color }: { color: Color }) => (
  <th className={classes.th}>
    <div className={classes.header}>
      {color.displayName}
      <div className={classes.headerHex}>{color.hex}</div>
    </div>
  </th>
);

const TdCell = ({
  color1,
  color2,
  minContrast,
}: {
  color1: Color;
  color2: Color;
  minContrast?: number;
}) => {
  const { t } = useTranslation();
  const contrast = getContrastFromHex(color1.hex, color2.hex);
  const formattedContrast = Math.floor(contrast * 10) / 10;
  const level = getContrastLevel(contrast);

  return (
    <div className={classes.cell}>
      <div className={classes.colors}>
        <div
          className={classes.color}
          style={{ backgroundColor: color2.hex }}
        ></div>
        <div
          className={classes.color}
          style={{ backgroundColor: color1.hex }}
        ></div>
      </div>
      <div className={classes.meta}>
        <div className={classes.tagContainer}>
          <div className={cl(classes.tag, classes[level])}>{level}</div>
        </div>
        <div className={classes.contrast}>{formattedContrast}:1</div>
      </div>
      {minContrast !== undefined &&
        (contrast < minContrast ? (
          <div className={cl(classes.requirement, classes.failed)}>
            {t('colorContrasts.min-contrast-failed', { ratio: minContrast })}
          </div>
        ) : (
          <div className={classes.requirement}>
            {t('colorContrasts.min-contrast', { ratio: minContrast })}
          </div>
        ))}
    </div>
  );
};
