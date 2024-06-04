import { Heading } from '@/packages/react';

import type { ThemeType } from '../../../utils/themeUtils';

import classes from './Backgrounds.module.css';

type BackgroundsProps = {
  theme1: ThemeType;
  theme2: ThemeType;
  theme3: ThemeType;
  theme4: ThemeType;
};

export const Backgrounds = ({
  theme1,
  theme2,
  theme3,
  theme4,
}: BackgroundsProps) => {
  return (
    <div className={classes.rows}>
      <div
        className={classes.column}
        style={{ backgroundColor: theme1.light[0].hexColor }}
      >
        <Heading
          className={classes.title}
          size='xsmall'
          style={{ color: theme1.light[12].hexColor }}
        >
          Light
        </Heading>
        <div className={classes.boxes}>
          <div
            className={classes.box}
            style={{ backgroundColor: theme1.light[1].hexColor }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: theme2.light[1].hexColor }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: theme1.light[1].hexColor }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: theme4.light[1].hexColor }}
          ></div>
        </div>
      </div>
      <div
        className={classes.column}
        style={{ backgroundColor: theme1.dark[0].hexColor }}
      >
        <Heading
          className={classes.title}
          size='xsmall'
          style={{ color: theme1.dark[12].hexColor }}
        >
          Dark
        </Heading>
        <div className={classes.boxes}>
          <div
            className={classes.box}
            style={{ backgroundColor: theme1.dark[1].hexColor }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: theme2.dark[1].hexColor }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: theme1.dark[1].hexColor }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: theme4.dark[1].hexColor }}
          ></div>
        </div>
      </div>
      <div
        className={classes.column}
        style={{ backgroundColor: theme1.contrast[0].hexColor }}
      >
        <Heading
          className={classes.title}
          size='xsmall'
          style={{ color: theme1.contrast[12].hexColor }}
        >
          Contrast
        </Heading>
        <div className={classes.boxes}>
          <div
            className={classes.box}
            style={{ backgroundColor: theme1.contrast[1].hexColor }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: theme2.contrast[1].hexColor }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: theme3.contrast[1].hexColor }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: theme4.contrast[1].hexColor }}
          ></div>
        </div>
      </div>
    </div>
  );
};
