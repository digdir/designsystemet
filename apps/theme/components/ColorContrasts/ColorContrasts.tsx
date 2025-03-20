import {
  type Color,
  type ColorNames,
  generateColorSchemes,
  getColorMetadataByNumber,
  getContrastFromHex,
} from '@digdir/designsystemet';
import {
  Field,
  Heading,
  Paragraph,
  Select,
} from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { useEffect, useState } from 'react';
import { useThemeStore } from '../../store';
import classes from './ColorContrasts.module.css';

export const ColorContrasts = () => {
  const colors = useThemeStore((state) => state.colors);
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const [selectedColor, setSelectedColor] = useState('dominant');
  const [selectedBaseColor, setSelectedBaseColor] = useState('dominant');

  const initialTheme =
    colors?.main[0]?.colors || generateColorSchemes('#0062BA');

  const staticHorNames: ColorNames[] = [
    'background-default',
    'background-tinted',
    'surface-default',
    'surface-tinted',
    'surface-hover',
  ];
  const staticVerNames: ColorNames[] = [
    'border-subtle',
    'border-default',
    'border-strong',
    'text-subtle',
    'text-default',
  ];

  // Pick the range of colors for the static contrast section from initialTheme
  const [reducedLight, setReducedLight] = useState({
    horizontalRange: initialTheme[colorScheme].filter((color) =>
      staticHorNames.includes(color.name),
    ),
    verticalRange: initialTheme[colorScheme].filter((color) =>
      staticVerNames.includes(color.name),
    ),
  });

  const baseHorNames: ColorNames[] = [
    'background-default',
    'background-tinted',
    'surface-default',
    'base-contrast-subtle',
    'base-contrast-default',
  ];
  const baseVerNames: ColorNames[] = [
    'base-default',
    'base-hover',
    'base-active',
  ];

  // Pick the range of colors for the base contrast section from initialTheme
  const [reducedBaseLight, setReducedBaseLight] = useState({
    horizontalRange: initialTheme[colorScheme].filter((color) =>
      baseHorNames.includes(color.name),
    ),
    verticalRange: initialTheme[colorScheme].filter((color) =>
      baseVerNames.includes(color.name),
    ),
  });

  useEffect(() => {
    const newTheme =
      (['main', 'neutral', 'support'] as Array<keyof typeof colors>)
        .flatMap((group) => colors[group])
        .find((color) => color.name === selectedColor)?.colors || initialTheme;

    setReducedLight({
      horizontalRange: newTheme[colorScheme].filter((color) =>
        staticHorNames.includes(color.name),
      ),
      verticalRange: newTheme[colorScheme].filter((color) =>
        staticVerNames.includes(color.name),
      ),
    });
  }, [selectedColor, colors, colorScheme]);

  useEffect(() => {
    const newTheme =
      (['main', 'neutral', 'support'] as Array<keyof typeof colors>)
        .flatMap((group) => colors[group])
        .find((color) => color.name === selectedBaseColor)?.colors ||
      initialTheme;

    setReducedBaseLight({
      horizontalRange: newTheme[colorScheme].filter((color) =>
        baseHorNames.includes(color.name),
      ),
      verticalRange: newTheme[colorScheme].filter((color) =>
        baseVerNames.includes(color.name),
      ),
    });
  }, [selectedBaseColor, colors, colorScheme]);

  const ThCell = ({ color }: { color: Color }) => {
    return (
      <th className={classes.th}>
        <div className={classes.header}>
          {getColorMetadataByNumber(color.number).displayName}
          <div className={classes.headerHex}>{color.hex}</div>
        </div>
      </th>
    );
  };

  const Tag = ({ color1, color2 }: { color1: Color; color2: Color }) => {
    const contrast = getContrastFromHex(color1.hex, color2.hex);
    let type = 'AAA';

    if (contrast < 3) {
      type = 'DECO';
    } else if (contrast < 4.5) {
      type = 'AA18';
    } else if (contrast < 7) {
      type = 'AA';
    }

    return <div className={cl(classes.tag, classes[type])}>{type}</div>;
  };

  const TdCell = ({ color1, color2 }: { color1: Color; color2: Color }) => {
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
            <Tag color1={color1} color2={color2} />
          </div>
          <div className={classes.contrast}>
            {Math.floor(getContrastFromHex(color1.hex, color2.hex) * 10) / 10}
            :1
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='panelContainer'>
      <div className='panelLeft'>
        <div className='panelTop'>
          <Heading data-size='xs'>Kontraster mellom farger</Heading>
          <Paragraph data-size='sm'>
            Her vises kontrastene mellom de ulike trinnene i fargeskalaene, samt
            om fargene oppfyller WCAG-kravene.
          </Paragraph>

          <div className={classes.tagGroups}>
            <div className={classes.tagGroup}>
              <div className={cl(classes.tag, classes.AAA)}>AAA</div>
              <Paragraph data-size='sm'>
                Tekst og bakgrunn må ha en kontrast på minst 7:1 for å oppfylle
                WCAG AAA-kravet.
              </Paragraph>
            </div>
            <div className={classes.tagGroup}>
              <div className={cl(classes.tag, classes.AA)}>AA</div>
              <Paragraph data-size='sm'>
                Tekst og bakgrunn må ha en kontrast på minst 4.5:1 for å
                oppfylle WCAG AA-kravet.
              </Paragraph>
            </div>
            <div className={classes.tagGroup}>
              <div className={cl(classes.tag, classes.AA18)}>AA18</div>
              <Paragraph data-size='sm'>
                Tekst og bakgrunn må ha en kontrast på minst 3:1 og en
                skriftstørrelse på 18 px eller større for å oppfylle WCAG
                AA-kravet.
              </Paragraph>
            </div>
            <div className={classes.tagGroup}>
              <div className={cl(classes.tag, classes.FAIL)}>DECO</div>
              <Paragraph data-size='sm'>
                Oppfyller ingen kontrastkrav i WCAG og bør kun brukes til
                dekorative formål.
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
      <div className='panelRight'>
        <Heading data-size='2xs'>
          Text og Border mot Background og Surface
        </Heading>
        <Paragraph data-size='sm' className={classes.desc}>
          Når du bytter mellom fargeskalaene, vil du se at kontrastene mellom
          fargene i seksjonen nedenfor er nesten identiske. Dette gjør at du kun
          trenger å vurdere kontrastene for én fargeskala for å forstå hvordan
          alle fungerer. Siden kontrastene er konsistente, kan du også kombinere
          ulike farger på tvers av skalaene.
        </Paragraph>
        <Field className={classes.fieldGroup}>
          <Select
            data-size='sm'
            className={classes.select}
            onChange={(e) => {
              setSelectedColor(e.target.value);
            }}
            aria-label='Velg farge for å se kontraster'
          >
            {(['main', 'neutral', 'support'] as Array<keyof typeof colors>).map(
              (group) =>
                colors[group].map((color, index) => (
                  <Select.Option key={index} value={color.name}>
                    {color.name}
                  </Select.Option>
                )),
            )}
          </Select>
        </Field>

        <div className={classes.tableContainer}>
          <table className={classes.table}>
            <tbody>
              <tr>
                <th />
                {reducedLight.horizontalRange.map((color, index) => (
                  <ThCell
                    key={index}
                    color={reducedLight.horizontalRange[index]}
                  />
                ))}
              </tr>
              {reducedLight.verticalRange.map((color2, index) => (
                <tr key={index}>
                  <ThCell color={color2} />
                  {reducedLight.horizontalRange.map((color1, index) => (
                    <td key={index} className={classes.td}>
                      <TdCell color1={color1} color2={color2} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Heading data-size='2xs'>Base fargene</Heading>
        <Paragraph data-size='sm' className={classes.desc}>
          Fargene som blir valgt i verktøyet får tokenet Base Default i hver
          fargeskala. Dette betyr at det er viktig å velge en farge som har over
          3:1 kontrast mot overflatefarger om den skal brukes som en viktig,
          meningsbærende farge. Verktøyet lager også to kontrastfarger som trygt
          kan brukes oppå base fargene. Disse kontrastfargene blir enten lyse
          eller mørke avhengig av base fargen.
        </Paragraph>
        <Field className={classes.fieldGroup}>
          <Select
            data-size='sm'
            className={classes.select}
            onChange={(e) => {
              setSelectedBaseColor(e.target.value);
            }}
            aria-label='Velg farge for å se kontraster'
          >
            {(['main', 'neutral', 'support'] as Array<keyof typeof colors>).map(
              (group) =>
                colors[group].map((color, index) => (
                  <Select.Option key={index} value={color.name}>
                    {color.name}
                  </Select.Option>
                )),
            )}
          </Select>
        </Field>
        <div className={classes.tableContainer}>
          <table className={classes.table}>
            <tbody>
              <tr>
                <th />
                {reducedBaseLight.horizontalRange.map((color, index) => (
                  <ThCell
                    key={index}
                    color={reducedBaseLight.horizontalRange[index]}
                  />
                ))}
              </tr>
              {reducedBaseLight.verticalRange.map((color2, index) => (
                <tr key={index}>
                  <ThCell color={color2} />
                  {reducedBaseLight.horizontalRange.map((color1, index) => (
                    <td key={index} className={classes.td}>
                      <TdCell color1={color1} color2={color2} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
