import { Divider } from '@digdir/designsystemet-react';
import { useThemeStore } from '~/store';
import { Scale } from '../scale/scale';
import classes from './colors.module.css';

export const Colors = () => {
  return (
    <div className={classes.rows}>
      <MainColors />
      <Divider />
      <NeutralColor />
      <Divider />
      <SupportColors />
    </div>
  );
};

const MainColors = () => {
  const colors = useThemeStore((state) => state.colors.main);

  return (
    <div className={classes.rows}>
      {colors.map((color, index) => (
        <div key={index} className={classes.row}>
          <div className={classes.scaleLabel}>{color.name}</div>
          <Scale
            colorScale={color.colors}
            showHeader={index === 0}
            namespace={color.name}
          />
        </div>
      ))}
    </div>
  );
};
const NeutralColor = () => {
  const colors = useThemeStore((state) => state.colors.neutral);

  return (
    <div className={classes.rows}>
      {colors.map((color, index) => (
        <div key={index} className={classes.row}>
          <div className={classes.scaleLabel}>{color.name}</div>
          <Scale colorScale={color.colors} namespace={color.name} />
        </div>
      ))}
    </div>
  );
};

const SupportColors = () => {
  const colors = useThemeStore((state) => state.colors.support);

  return (
    <div className={classes.rows}>
      {colors.map((color, index) => (
        <div key={index} className={classes.row}>
          <div className={classes.scaleLabel}>{color.name}</div>
          <Scale colorScale={color.colors} namespace={color.name} />
        </div>
      ))}
    </div>
  );
};
