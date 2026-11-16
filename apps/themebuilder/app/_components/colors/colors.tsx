import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
import { Scale } from '../color-scale/color-scale';
import classes from './colors.module.css';

export const Colors = () => {
  const { colors } = useThemebuilder();

  return (
    <div className={classes.rows}>
      {colors.map((color, index) => (
        <div key={color.name} className={classes.row}>
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
