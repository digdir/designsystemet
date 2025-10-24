import { Divider } from '@digdir/designsystemet-react';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
import { Scale } from '../scale/scale';
import classes from './colors.module.css';

export const Colors = () => {
  const { severityEnabled } = useThemebuilder();

  return (
    <div className={classes.rows}>
      <MainColors />
      <Divider />
      <NeutralColor />
      <Divider />
      <SupportColors />
      {severityEnabled && (
        <>
          <Divider />
          <SeverityColors />
        </>
      )}
    </div>
  );
};

const MainColors = () => {
  const {
    colors: { main },
  } = useThemebuilder();

  return (
    <div className={classes.rows}>
      {main.map((color, index) => (
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
  const {
    colors: { neutral },
  } = useThemebuilder();

  return (
    <div className={classes.rows}>
      {neutral.map((color, index) => (
        <div key={index} className={classes.row}>
          <div className={classes.scaleLabel}>{color.name}</div>
          <Scale colorScale={color.colors} namespace={color.name} />
        </div>
      ))}
    </div>
  );
};

const SupportColors = () => {
  const {
    colors: { support },
  } = useThemebuilder();

  return (
    <div className={classes.rows}>
      {support.map((color, index) => (
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
