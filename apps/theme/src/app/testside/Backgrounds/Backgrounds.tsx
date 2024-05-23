import { Heading } from '@digdir/designsystemet-react';

import { generateColorTheme } from '@/utils/themeUtils';

import classes from './Backgrounds.module.css';

export const Backgrounds = () => {
  const greyTheme = generateColorTheme('#1e2b3c');
  const blueTheme = generateColorTheme('#0163ba');
  const greenTheme = generateColorTheme('#06454a');
  const redTheme = generateColorTheme('#e32f24');

  return (
    <div className={classes.rows}>
      <div
        className={classes.column}
        style={{ backgroundColor: greyTheme.light[0] }}
      >
        <Heading
          className={classes.title}
          size='xsmall'
          style={{ color: greyTheme.light[12] }}
        >
          Light
        </Heading>
        <div className={classes.boxes}>
          <div
            className={classes.box}
            style={{ backgroundColor: greyTheme.light[1] }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: blueTheme.light[1] }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: greyTheme.light[1] }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: redTheme.light[1] }}
          ></div>
        </div>
      </div>
      <div
        className={classes.column}
        style={{ backgroundColor: greyTheme.dark[0] }}
      >
        <Heading
          className={classes.title}
          size='xsmall'
          style={{ color: greyTheme.dark[12] }}
        >
          Dark
        </Heading>
        <div className={classes.boxes}>
          <div
            className={classes.box}
            style={{ backgroundColor: greyTheme.dark[1] }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: blueTheme.dark[1] }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: greyTheme.dark[1] }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: redTheme.dark[1] }}
          ></div>
        </div>
      </div>
      <div
        className={classes.column}
        style={{ backgroundColor: greyTheme.contrast[0] }}
      >
        <Heading
          className={classes.title}
          size='xsmall'
          style={{ color: greyTheme.contrast[12] }}
        >
          Contrast
        </Heading>
        <div className={classes.boxes}>
          <div
            className={classes.box}
            style={{ backgroundColor: greyTheme.contrast[1] }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: blueTheme.contrast[1] }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: greenTheme.contrast[1] }}
          ></div>
          <div
            className={classes.box}
            style={{ backgroundColor: redTheme.contrast[1] }}
          ></div>
        </div>
      </div>
    </div>
  );
};
