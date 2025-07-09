import classes from './color.module.css';

export const ColorDark = ({ colorVariable }: { colorVariable: string }) => {
  return (
    <div className={classes.colorBox} data-color-scheme='dark'>
      <div
        style={{ backgroundColor: colorVariable }}
        className={classes.color}
      ></div>
    </div>
  );
};

export const ColorLight = ({ colorVariable }: { colorVariable: string }) => {
  return (
    <div className={classes.colorBox} data-color-scheme='light'>
      <div
        style={{ backgroundColor: colorVariable }}
        className={classes.color}
      ></div>
    </div>
  );
};
