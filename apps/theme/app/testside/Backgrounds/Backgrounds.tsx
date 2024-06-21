import { Heading } from '@digdir/designsystemet-react';
import type { ThemeInfo } from '@digdir/designsystemet/color';

import classes from './Backgrounds.module.css';

type BackgroundsProps = {
  theme1: ThemeInfo;
  theme2: ThemeInfo;
  theme3: ThemeInfo;
  theme4: ThemeInfo;
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
        style={{ backgroundColor: theme1.light[0].hex }}
      >
        <Heading
          className={classes.title}
          size='xs'
          style={{ color: theme1.light[12].hex }}
        >
          Light
        </Heading>
        <div className={classes.boxes}>
          <div
            className={classes.box}
            style={{ backgroundColor: theme1.light[1].hex }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: theme2.light[1].hex }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: theme1.light[1].hex }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: theme4.light[1].hex }}
          ></div>
        </div>
      </div>
      <div
        className={classes.column}
        style={{ backgroundColor: theme1.dark[0].hex }}
      >
        <Heading
          className={classes.title}
          size='xs'
          style={{ color: theme1.dark[12].hex }}
        >
          Dark
        </Heading>
        <div className={classes.boxes}>
          <div
            className={classes.box}
            style={{ backgroundColor: theme1.dark[1].hex }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: theme2.dark[1].hex }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: theme1.dark[1].hex }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: theme4.dark[1].hex }}
          ></div>
        </div>
      </div>
      <div
        className={classes.column}
        style={{ backgroundColor: theme1.contrast[0].hex }}
      >
        <Heading
          className={classes.title}
          size='xs'
          style={{ color: theme1.contrast[12].hex }}
        >
          Contrast
        </Heading>
        <div className={classes.boxes}>
          <div
            className={classes.box}
            style={{ backgroundColor: theme1.contrast[1].hex }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: theme2.contrast[1].hex }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: theme3.contrast[1].hex }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: theme4.contrast[1].hex }}
          ></div>
        </div>
      </div>
    </div>
  );
};
