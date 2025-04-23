import { Field, Label, Select } from '@digdir/designsystemet-react';
import type { ThemeInfo } from '@digdir/designsystemet/color';
import {
  ComponentIcon,
  OpenSourceIcon,
  PiggybankFillIcon,
} from '@navikt/aksel-icons';
import { useEffect, useRef, useState } from 'react';
import { useThemeStore } from '../../store';
import { generateColorVars } from '../../utils/generateColorVars';
import { Card } from './Card/Card';
import classes from './ColorDetail.module.css';
import { People } from './People/People';

export const ColorDetail = () => {
  const colors = useThemeStore((state) => state.colors);
  const [activeColorName, setActiveColorName] = useState(colors.main[0].name);
  const [activeColors, setActiveColors] = useState<ThemeInfo>(
    colors.main[0].colors,
  );
  const pageRef = useRef<HTMLDivElement>(null);
  const colorMetadata = useThemeStore((state) => state.colorMetadata);

  useEffect(() => {
    const pageElement = pageRef.current;
    if (pageElement) {
      const styles = generateColorVars(activeColors, 'light');
      for (const [key, value] of Object.entries(styles)) {
        pageElement.style.setProperty(key, value);
      }
    }
  }, [activeColors, colors, colorMetadata]);

  useEffect(() => {
    setActiveColors(
      colors.main.find((color) => color.name === activeColorName)?.colors ||
        colors.support.find((color) => color.name === activeColorName)
          ?.colors ||
        colors.neutral.find((color) => color.name === activeColorName)
          ?.colors ||
        colors.main[0].colors,
    );
  }, [colors]);

  return (
    <div className={classes.page} ref={pageRef}>
      <div className={classes.header}>
        <Field>
          <Label>Farge</Label>
          <Select
            defaultValue={activeColorName}
            onChange={(e) => {
              setActiveColorName(e.target.value);
              setActiveColors(
                colors.main.find((color) => color.name === e.target.value)
                  ?.colors ||
                  colors.support.find((color) => color.name === e.target.value)
                    ?.colors ||
                  colors.neutral.find((color) => color.name === e.target.value)
                    ?.colors ||
                  colors.main[0].colors,
              );
            }}
          >
            {colors.main.map((color) => (
              <option key={color.name} value={color.name}>
                {color.name}
              </option>
            ))}
            {colors.neutral.map((color) => (
              <option key={color.name} value={color.name}>
                {color.name}
              </option>
            ))}
            {colors.support.map((color) => (
              <option key={color.name} value={color.name}>
                {color.name}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <div className={classes.container}>
        <div className={classes.left}>
          <div className={classes.cards}>
            <Card
              type={1}
              title='Card example one'
              desc='Knows, something and been me expectations '
              icon={<OpenSourceIcon />}
            />
            <Card
              type={2}
              title='Card example two'
              desc='Knows, something and been me expectations '
              icon={<ComponentIcon />}
            />
            <Card
              type={3}
              title='Card example three'
              desc='Knows, something and been me expectations '
              icon={<PiggybankFillIcon />}
            />
          </div>
          <div className={classes.lists}>lists</div>
        </div>
        <div className={classes.right}>
          <People />
        </div>
      </div>
    </div>
  );
};
