import classes from './typography.module.css';

export const LineHeight = ({ value }: { value: string }) => {
  return (
    <div style={{ lineHeight: value }} className={classes.preview}>
      line <br /> height
    </div>
  );
};

export const FontSize = ({ value }: { value: string }) => {
  return (
    <div style={{ fontSize: value }} className={classes.preview}>
      Aa
    </div>
  );
};

export const FontWeight = ({ value }: { value: string; text: string }) => {
  return (
    <div style={{ fontWeight: value }} className={classes.preview}>
      weight
    </div>
  );
};
export const FontFamily = ({ value }: { value: string }) => {
  return (
    <div style={{ fontFamily: value }} className={classes.preview}>
      {value}
    </div>
  );
};

export const LetterSpacing = ({ value }: { value: string }) => {
  return (
    <div style={{ letterSpacing: value }} className={classes.preview}>
      letter spacing
    </div>
  );
};
