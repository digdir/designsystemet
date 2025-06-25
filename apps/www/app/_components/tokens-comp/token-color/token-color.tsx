import cl from 'clsx/lite';

import classes from './token-color.module.css';

export const ColorDark = ({ colorVariable }: { colorVariable: string }) => {
  return (
    <>
      <div className={classes.colorBox} data-color-scheme='dark'>
        <div
          style={{ backgroundColor: colorVariable }}
          className={cl(classes.color)}
        ></div>
      </div>
    </>
  );
};

export const ColorLight = ({ colorVariable }: { colorVariable: string }) => {
  return (
    <>
      <div className={classes.colorBox} data-color-scheme='light'>
        <div
          style={{ backgroundColor: colorVariable }}
          className={cl(classes.color)}
        ></div>
      </div>
    </>
  );
};
