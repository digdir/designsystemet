import { Heading, Paragraph, ToggleGroup } from '@digdir/designsystemet-react';
import type { ThemeInfo } from '@digdir/designsystemet/color';
import {
  ComponentIcon,
  OpenSourceIcon,
  PiggybankFillIcon,
} from '@navikt/aksel-icons';
import cl from 'clsx/lite';
import { useEffect, useRef, useState } from 'react';
import { useThemeStore } from '../../store';
import { generateColorVars } from '../../utils/generateColorVars';
import { GradientSpace } from '../GradientSpace/GradientSpace ';
import { Card } from './Card/Card';
import classes from './ColorDetail.module.css';
import { People } from './People/People';

export const ColorDetail = () => {
  const colors = useThemeStore((state) => state.colors);
  const [activeColors, setActiveColors] = useState<ThemeInfo>(
    colors.main[0].colors,
  );
  const pageRef = useRef<HTMLDivElement>(null);
  const colorScheme = useThemeStore((state) => state.colorScheme);
  const activeColorScale = useThemeStore((state) => state.activeColorScale);
  const setActiveColorScale = useThemeStore(
    (state) => state.setActiveColorScale,
  );

  useEffect(() => {
    const pageElement = pageRef.current;
    if (pageElement) {
      const styles = generateColorVars(activeColors, colorScheme);
      for (const [key, value] of Object.entries(styles)) {
        pageElement.style.setProperty(key, value);
      }
    }
  }, [activeColors, colors, colorScheme]);

  useEffect(() => {
    setActiveColors(
      colors.main.find((color) => color.name === activeColorScale)?.colors ||
        colors.support.find((color) => color.name === activeColorScale)
          ?.colors ||
        colors.neutral.find((color) => color.name === activeColorScale)
          ?.colors ||
        colors.status.find((color) => color.name === activeColorScale)
          ?.colors ||
        colors.main[0].colors,
    );
  }, [colors, activeColorScale]);

  return (
    <div className={classes.page}>
      <Heading className={classes.title}>Detaljvisning av fargeskala</Heading>
      <Paragraph className={classes.desc}>
        Her kan du se og redigere fargeskalaen din
      </Paragraph>
      <div
        className={classes.panel}
        data-color-scheme={colorScheme}
        ref={pageRef}
      >
        <div className={classes.header}>
          <div className={classes.subHeader}>Velg fargeskala</div>
          <ToggleGroup
            value={activeColorScale}
            name='toggle-group-nuts'
            onChange={setActiveColorScale}
            data-size='sm'
          >
            {colors.main.map((color) => (
              <ToggleGroup.Item key={color.name} value={color.name}>
                {color.name}
              </ToggleGroup.Item>
            ))}
            {colors.neutral.map((color) => (
              <ToggleGroup.Item key={color.name} value={color.name}>
                {color.name}
              </ToggleGroup.Item>
            ))}
            {colors.support.map((color) => (
              <ToggleGroup.Item key={color.name} value={color.name}>
                {color.name}
              </ToggleGroup.Item>
            ))}
            {colors.status.map((color) => (
              <ToggleGroup.Item key={color.name} value={color.name}>
                {color.name}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup>
        </div>
        <div className={classes.container}>
          <div className={classes.left}>
            <div className={classes.cards}>
              <Card
                type={1}
                title='Surface eksempel'
                desc='Knows, something and been me expectations '
                icon={<OpenSourceIcon />}
              />
              <Card
                type={2}
                title='Surface eksempel'
                desc='Knows, something and been me expectations '
                icon={<ComponentIcon />}
              />
              <Card
                type={3}
                title='Surface eksempel'
                desc='Knows, something and been me expectations '
                icon={<PiggybankFillIcon />}
              />
            </div>
            <div className={classes.lists}>
              <div className={classes.card}>
                <div className={classes.cardHeading}>Border fargene</div>
                <div className={classes.bars}>
                  <div className={cl(classes.barItem, classes.barOne)}>
                    <div className={classes.barHeading}>Border subtle</div>
                  </div>
                  <div className={cl(classes.barItem, classes.barTwo)}>
                    <div className={classes.barHeading}>Border default</div>
                  </div>
                  <div className={cl(classes.barItem, classes.barThree)}>
                    <div className={classes.barHeading}>Border strong</div>
                  </div>
                </div>
              </div>
              <div className={cl(classes.card, classes.cardCentered)}>
                <div className={classes.circle}>50</div>
              </div>
            </div>
          </div>
          <div className={classes.right}>
            <People />
          </div>
        </div>
        <GradientSpace themeInfo={activeColors} colorScheme={colorScheme} />
      </div>
    </div>
  );
};
