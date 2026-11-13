import {
  type Color,
  type ColorScale,
  generateColorSchemes,
  getContrastFromHex,
  type SemanticColorNames,
  semanticColorSpec,
} from '@digdir/designsystemet/internal';
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

const specSteps = Object.values(semanticColorSpec);
const namesOf = (steps: typeof specSteps) => steps.map((step) => step.name);

/** The minimum contrast the color spec requires between two steps, if any */
const getMinContrast = (a: SemanticColorNames, b: SemanticColorNames) => {
  const ratios = [
    ...(semanticColorSpec[a].minContrast ?? []).filter(({ against }) =>
      against.includes(b),
    ),
    ...(semanticColorSpec[b].minContrast ?? []).filter(({ against }) =>
      against.includes(a),
    ),
  ].map(({ ratio }) => ratio);
  return ratios.length > 0 ? Math.max(...ratios) : undefined;
};

/** Every step that one of `steps` has a contrast requirement against, in scale order */
const getContrastTargets = (steps: SemanticColorNames[]) =>
  namesOf(
    specSteps.filter(({ name }) =>
      steps.some((step) =>
        semanticColorSpec[step].minContrast?.some(({ against }) =>
          against.includes(name),
        ),
      ),
    ),
  );

const textAndBorders = namesOf(
  specSteps.filter(({ group }) => group === 'border' || group === 'text'),
);
const baseSteps = specSteps.filter(({ group }) => group === 'base');
/** Base steps with a contrast requirement are the ones used on top of the others */
const baseContrasts = namesOf(baseSteps.filter((step) => step.minContrast));
const baseFills = namesOf(baseSteps.filter((step) => !step.minContrast));

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
            <div className={classes.tagGroup}>
              <div className={classes.requirement}>
                {t('colorContrasts.min-contrast', { ratio: 4.5 })}
              </div>
              <Paragraph data-size='sm'>
                {t('colorContrasts.min-contrast-description')}
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
      <div className='panelRight'>
        <ColorContrastMapper
          variant='text-vs-background'
          vertical={textAndBorders}
          horizontal={getContrastTargets(textAndBorders)}
        />
        <ColorContrastMapper
          variant='base-colors'
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

const ColorContrastMapper = ({
  vertical,
  horizontal,
  variant,
}: {
  vertical: SemanticColorNames[];
  horizontal: SemanticColorNames[];
  variant: string;
}) => {
  const { t } = useTranslation();
  const { colorScheme, colors, severityColors } = useThemebuilder();
  const [selectedColor, setSelectedColor] = useState('dominant');

  const getMappedTheme = (): ColorScale => {
    let colorTheme = colors?.[0]?.colors || initialTheme;

    if (selectedColor !== 'dominant') {
      for (const color of colors) {
        if (color.name === selectedColor) {
          colorTheme = color.colors;
          break;
        }
      }

      for (const color of severityColors) {
        if (color.name === selectedColor) {
          colorTheme = color.colors;
          break;
        }
      }
    }

    return colorTheme[colorScheme];
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
          {colors.map((color, colorIndex) => (
            <Select.Option key={`color-${colorIndex}`} value={color.name}>
              {color.name}
            </Select.Option>
          ))}
          {severityColors.map((color, index) => (
            <Select.Option key={`severity-${index}`} value={color.name}>
              {color.name}
            </Select.Option>
          ))}
        </Select>
      </Field>
      <section
        className={cl(classes.tableContainer, 'ds-focus')}
        tabIndex={0}
        aria-label={
          variant === 'base-colors'
            ? t('colorContrasts.base-colors')
            : t('colorContrasts.text-vs-background')
        }
      >
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
