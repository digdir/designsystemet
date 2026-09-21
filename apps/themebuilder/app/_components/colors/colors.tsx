import { Divider } from '@digdir/designsystemet-react';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
import { Scale } from '../color-scale/color-scale';
import classes from './colors.module.css';

export const Colors = () => {
  const { severityEnabled } = useThemebuilder();

  return (
    <div className={classes.rows}>
      <ThemeColors />
      <Divider />
      <NeutralColor />
      {severityEnabled && (
        <>
          <Divider />
          <SeverityColors />
        </>
      )}
    </div>
  );
};

const ThemeColors = () => {
  const { colors } = useThemebuilder();

  return (
    <div className={classes.rows}>
      {colors
        .filter((c) => c.name !== 'neutral')
        .map((color, index) => (
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
  const { colors } = useThemebuilder();

  return (
    <div className={classes.rows}>
      {colors
        .filter((c) => c.name === 'neutral')
        .map((color, index) => (
          <div key={index} className={classes.row}>
            <div className={classes.scaleLabel}>{color.name}</div>
            <Scale colorScale={color.colors} namespace={color.name} />
          </div>
        ))}
    </div>
  );
};

const SeverityColors = () => {
  const { severityColors } = useThemebuilder();

  return (
    <div className={classes.rows}>
      {severityColors.map((color, index) => (
        <div key={index} className={classes.row}>
          <div className={classes.scaleLabel}>{color.name}</div>
          <Scale colorScale={color.colors} namespace={color.name} />
        </div>
      ))}
    </div>
  );
};
