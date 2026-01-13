import classes from './color.module.css';

export const ColorLight = ({ colorVariable }: { colorVariable: string }) => {
  return (
    <div className={classes.colorBox}>
      <div
        style={{ backgroundColor: colorVariable }}
        className={classes.color}
      ></div>
    </div>
  );
};
