import {
  type ColorInfo,
  generateThemeForColor,
  getColorNameFromNumber,
  getContrastFromHex,
} from '@/packages/cli/dist/src/colors';
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
  const theme = generateThemeForColor('#0062BA');
  const indexOne = [1, 2, 3, 4, 5];
  const indexTwo = [6, 7, 8, 12, 13];
  const [reducedLight, setReducedLight] = useState({
    themeRange1: theme.light.filter((color) => indexOne.includes(color.number)),
    themeRange2: theme.light.filter((color) => indexTwo.includes(color.number)),
  });
  const colors = useThemeStore((state) => state.colors);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedBaseColor, setSelectedBaseColor] = useState('');

  const indexBaseOne = [9, 10, 11];
  const indexBaseTwo = [14, 15];
  const [reducedBaseLight, setReducedBaseLight] = useState({
    themeRange1: theme.light.filter((color) =>
      indexBaseOne.includes(color.number),
    ),
    themeRange2: theme.light.filter((color) =>
      indexBaseTwo.includes(color.number),
    ),
  });

  useEffect(() => {
    const newTheme =
      colors.main.find((color) => color.name === selectedColor)?.colors ||
      theme;

    setReducedLight({
      themeRange1: newTheme.light.filter((color) =>
        indexOne.includes(color.number),
      ),
      themeRange2: newTheme.light.filter((color) =>
        indexTwo.includes(color.number),
      ),
    });
  }, [selectedColor, colors.main]);

  useEffect(() => {
    const newTheme =
      colors.main.find((color) => color.name === selectedBaseColor)?.colors ||
      theme;

    setReducedBaseLight({
      themeRange1: newTheme.light.filter((color) =>
        indexBaseOne.includes(color.number),
      ),
      themeRange2: newTheme.light.filter((color) =>
        indexBaseTwo.includes(color.number),
      ),
    });
  }, [selectedBaseColor, colors.main]);

  const ThCell = ({ color }: { color: ColorInfo }) => {
    return (
      <th className={classes.th}>
        <div className={classes.header}>
          {getColorNameFromNumber(color.number)}
          <div className={classes.headerHex}>{color.hex}</div>
        </div>
      </th>
    );
  };

  const Tag = ({
    color1,
    color2,
  }: { color1: ColorInfo; color2: ColorInfo }) => {
    const contrast = getContrastFromHex(color1.hex, color2.hex);
    let type = 'AAA';

    if (contrast < 3) {
      type = 'FAIL';
    } else if (contrast < 4.5) {
      type = 'AA18';
    } else if (contrast < 7) {
      type = 'AA';
    }

    return <div className={cl(classes.tag, classes[type])}>{type}</div>;
  };

  const TdCell = ({
    color1,
    color2,
  }: { color1: ColorInfo; color2: ColorInfo }) => {
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
          <Tag color1={color1} color2={color2} />
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
        <Heading data-size='xs'> Se kontraster</Heading>
        <Paragraph data-size='sm'>
          Her ser du kontrastene mellom de ulike stegene i fargeskalaene dine.
        </Paragraph>
        <Heading data-size='2xs' className={classes.subHeading}>
          Tagger og betydning
        </Heading>
        <div className={classes.tagGroup}>
          <div className={cl(classes.tag, classes.AAA)}>AAA</div>
          <Paragraph data-size='sm'>
            Tekst og bakgrunn må ha minst 7:1 kontrast for å dekke WCAG AAA
            kravet.
          </Paragraph>
        </div>
        <div className={classes.tagGroup}>
          <div className={cl(classes.tag, classes.AA)}>AA</div>
          <Paragraph data-size='sm'>
            Tekst og bakgrunn må ha minst 4,5:1 kontrast for å dekke WCAG AA
            kravet.
          </Paragraph>
        </div>
        <div className={classes.tagGroup}>
          <div className={cl(classes.tag, classes.AA18)}>AA18</div>
          <Paragraph data-size='sm'>
            Tekst og bakgrunn må ha minst 3:1 kontrast og ha en font på 18px
            eller mer for å dekke WCAG AA kravet.
          </Paragraph>
        </div>
        <div className={classes.tagGroup}>
          <div className={cl(classes.tag, classes.FAIL)}>FAIL</div>
          <Paragraph data-size='sm'>
            Dekker ingen kontrastkrav i WCAG og må brukes kun dekorativt.
          </Paragraph>
        </div>
      </div>
      <div className='panelRight'>
        <Heading data-size='xs'>
          Text og Border mot Background og Surface
        </Heading>
        <Paragraph data-size='sm'>
          Når du bytter mellom fargeskalaene dine så vil du se at kontrastene
          mellom fargene i seksjonen under er nesten helt like. Dette betyr at
          du trenger bare lære deg disse reglene en gang.
        </Paragraph>
        <Field className={classes.fieldGroup}>
          <Select
            data-size='sm'
            className={classes.select}
            onChange={(e) => {
              setSelectedColor(e.target.value);
            }}
          >
            {colors.main.map((color, index) => (
              <Select.Option key={index} value={color.name}>
                {color.name}
              </Select.Option>
            ))}
          </Select>
        </Field>
        <table className={classes.table}>
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
        </table>
        <Heading data-size='xs'>Base fargene</Heading>
        <Paragraph data-size='sm'>Base fargene er litt spesielle</Paragraph>
        <Field className={classes.fieldGroup}>
          <Select
            data-size='sm'
            className={classes.select}
            onChange={(e) => {
              setSelectedBaseColor(e.target.value);
            }}
          >
            {colors.main.map((color, index) => (
              <Select.Option key={index} value={color.name}>
                {color.name}
              </Select.Option>
            ))}
          </Select>
        </Field>
        <table className={classes.table}>
          <tr>
            <th />
            {reducedBaseLight.themeRange1.map((color, index) => (
              <ThCell key={index} color={reducedBaseLight.themeRange1[index]} />
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
        </table>
      </div>
    </div>
  );
};
