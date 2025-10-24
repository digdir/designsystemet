import {
  type Color,
  generateColorSchemes,
  getContrastFromHex,
} from '@digdir/designsystemet';
import {
  Field,
  Heading,
  Paragraph,
  Select,
  Skeleton,
} from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
import classes from './color-contrasts.module.css';

const initialTheme = generateColorSchemes('#0062BA');
const colorGroups = ['main', 'neutral', 'support'] as const;

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
            {' '}
            <div className={classes.tagGroup}>
              <div className={cl(classes.tag, classes.AAA)}>AAA</div>
              <Paragraph data-size='sm'>
                {t('colorContrasts.aaa-description')}
              </Paragraph>
            </div>
            <div className={classes.tagGroup}>
              <div className={cl(classes.tag, classes.AA)}>AA</div>
              <Paragraph data-size='sm'>
                {t('colorContrasts.aa-description')}
              </Paragraph>
            </div>
            <div className={classes.tagGroup}>
              <div className={cl(classes.tag, classes.AA18)}>AA18</div>
              <Paragraph data-size='sm'>
                {t('colorContrasts.aa18-description')}{' '}
              </Paragraph>
            </div>
            <div className={classes.tagGroup}>
              <div className={cl(classes.tag, classes.DECO)}>DECO</div>
              <Paragraph data-size='sm'>
                {t('colorContrasts.deco-description')}
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
      <div className='panelRight'>
        <ColorContrastMapper
          variant='text-vs-background'
          vertical={[
            'border-subtle',
            'border-default',
            'border-strong',
            'text-subtle',
            'text-default',
          ]}
          horizontal={[
            'background-default',
            'background-tinted',
            'surface-default',
            'surface-tinted',
            'surface-hover',
          ]}
        />
        <ColorContrastMapper
          variant='base-colors'
          vertical={['base-default', 'base-hover', 'base-active']}
          horizontal={[
            'background-default',
            'background-tinted',
            'surface-default',
            'base-contrast-subtle',
            'base-contrast-default',
          ]}
        />
      </div>
    </div>
  );
};

const ColorContrastMapper = ({
  vertical,
  horizontal,
  variant,
}: {
  vertical: string[];
  horizontal: string[];
  variant: string;
}) => {
  const { t } = useTranslation();
  const { colorScheme, colors, severityColors, severityEnabled } =
    useThemebuilder();
  const [selectedColor, setSelectedColor] = useState('dominant');

  const getMappedTheme = () => {
    const mappedColors: { [key: string]: Color } = {};

    let colorTheme = colors?.main[0]?.colors || initialTheme;

    if (selectedColor !== 'dominant') {
      for (const group of colorGroups) {
        for (const color of colors[group]) {
          if (color.name === selectedColor) {
            colorTheme = color.colors;
            break;
          }
        }
      }

      // Check severity colors if enabled
      if (severityEnabled) {
        for (const color of severityColors) {
          if (color.name === selectedColor) {
            colorTheme = color.colors;
            break;
          }
        }
      }
    }

    for (const [, value] of Object.entries(colorTheme[colorScheme])) {
      mappedColors[value.name] = value;
    }

    return mappedColors;
  };

  const mappedTheme = getMappedTheme();

  if (Object.keys(mappedTheme).length === 0) return <Skeleton height={400} />;

  return (
    <>
      {' '}
      <Heading data-size='2xs'>
        {variant === 'base-colors'
          ? t('colorContrasts.base-colors')
          : t('colorContrasts.text-vs-background')}
      </Heading>
      <Paragraph data-size='sm' className={classes.desc}>
        {variant === 'base-colors'
          ? t('colorContrasts.base-colors-description')
          : t('colorContrasts.text-vs-background-desc')}
      </Paragraph>
      <Field className={classes.fieldGroup}>
        <Select
          data-size='sm'
          className={classes.select}
          onChange={(e) => {
            setSelectedColor(e.target.value);
          }}
          aria-label={t('colorContrasts.select-color')}
          value={selectedColor}
        >
          {colorGroups.flatMap((group) =>
            colors[group as keyof typeof colors].map((color, colorIndex) => (
              <Select.Option key={`${group}-${colorIndex}`} value={color.name}>
                {color.name}
              </Select.Option>
            )),
          )}
          {severityEnabled &&
            severityColors.map((color, index) => (
              <Select.Option key={`severity-${index}`} value={color.name}>
                {color.name}
              </Select.Option>
            ))}
        </Select>
      </Field>
      <div className={classes.tableContainer}>
        <table className={classes.table}>
          <tbody>
            <tr>
              <th />
              {horizontal.map((color, index) => (
                <ThCell key={index} color={mappedTheme[color]} />
              ))}
            </tr>
            {vertical.map((color2, index) => (
              <tr key={index}>
                <ThCell color={mappedTheme[color2]} />
                {horizontal.map((color1, index) => (
                  <td key={index} className={classes.td}>
                    <TdCell
                      color1={mappedTheme[color1]}
                      color2={mappedTheme[color2]}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

const ContrastTag = ({ contrast }: { contrast: number }) => {
  let className: 'AAA' | 'AA' | 'AA18' | 'DECO' = 'AAA';
  let displayText = 'AAA';

  if (contrast < 3) {
    className = 'DECO';
    displayText = 'DECO';
  } else if (contrast < 4.5) {
    className = 'AA18';
    displayText = 'AA18';
  } else if (contrast < 7) {
    className = 'AA';
    displayText = 'AA';
  }

  return (
    <div className={cl(classes.tag, classes[className])}>{displayText}</div>
  );
};
const TdCell = ({ color1, color2 }: { color1: Color; color2: Color }) => {
  const contrast = getContrastFromHex(color1.hex, color2.hex);
  const formattedContrast = Math.floor(contrast * 10) / 10;

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
          <ContrastTag contrast={contrast} />
        </div>
        <div className={classes.contrast}>{formattedContrast}:1</div>
      </div>
    </div>
  );
};
