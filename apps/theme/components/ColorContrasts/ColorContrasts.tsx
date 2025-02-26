import {
  type Color,
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

  const indexOne = [1, 2, 3, 4, 5];
  const indexTwo = [7, 8, 9, 10, 11];
  const [reducedLight, setReducedLight] = useState({
    themeRange1: initialTheme[colorScheme].filter((color) =>
      indexOne.includes(color.number),
    ),
    themeRange2: initialTheme[colorScheme].filter((color) =>
      indexTwo.includes(color.number),
    ),
  });

  const indexBaseOne = [1, 2, 4, 15, 16];
  const indexBaseTwo = [12, 13, 14];
  const [reducedBaseLight, setReducedBaseLight] = useState({
    themeRange1: initialTheme[colorScheme].filter((color) =>
      indexBaseOne.includes(color.number),
    ),
    themeRange2: initialTheme[colorScheme].filter((color) =>
      indexBaseTwo.includes(color.number),
    ),
  });

  useEffect(() => {
    const newTheme =
      (['main', 'neutral', 'support'] as Array<keyof typeof colors>)
        .flatMap((group) => colors[group])
        .find((color) => color.name === selectedColor)?.colors || initialTheme;

    setReducedLight({
      themeRange1: newTheme[colorScheme].filter((color) =>
        indexOne.includes(color.number),
      ),
      themeRange2: newTheme[colorScheme].filter((color) =>
        indexTwo.includes(color.number),
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
      themeRange1: newTheme[colorScheme].filter((color) =>
        indexBaseOne.includes(color.number),
      ),
      themeRange2: newTheme[colorScheme].filter((color) =>
        indexBaseTwo.includes(color.number),
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
              Tekst og bakgrunn må ha en kontrast på minst 4.5:1 for å oppfylle
              WCAG AA-kravet.
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
        <table className={classes.table}>
          <tbody>
            <tr>
              <th />
              {reducedLight.themeRange1.map((color, index) => (
                <ThCell key={index} color={reducedLight.themeRange1[index]} />
              ))}
            </tr>
            {reducedLight.themeRange2.map((color2, index) => (
              <tr key={index}>
                <ThCell color={color2} />
                {reducedLight.themeRange1.map((color1, index) => (
                  <td key={index} className={classes.td}>
                    <TdCell color1={color1} color2={color2} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
        <table className={classes.table}>
          <tbody>
            <tr>
              <th />
              {reducedBaseLight.themeRange1.map((color, index) => (
                <ThCell
                  key={index}
                  color={reducedBaseLight.themeRange1[index]}
                />
              ))}
            </tr>
            {reducedBaseLight.themeRange2.map((color2, index) => (
              <tr key={index}>
                <ThCell color={color2} />
                {reducedBaseLight.themeRange1.map((color1, index) => (
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
  );
};
