import classes from './RangeBar.module.css';

type RangeBarProps = {
  min: number;
  rangeMin: number;
  rangeMax: number;
  barActiveColor?: string;
};

export const RangeBar = ({
  min,
  rangeMin,
  rangeMax,
  barActiveColor = '#ff8484',
}: RangeBarProps) => {
  return (
    <div className={classes.bar}>
      <div
        className={classes.min}
        style={{ width: min + '%', backgroundColor: barActiveColor }}
      ></div>
      <div
        className={classes.range}
        style={{
          marginLeft: rangeMin - min + '%',
          width: rangeMax - rangeMin + '%',
          backgroundColor: barActiveColor,
        }}
      ></div>
    </div>
  );
};
