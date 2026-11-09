import type {
  SemanticColorNames,
  ThemeInfo,
} from '@digdir/designsystemet/internal';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
import { ColorButton } from '../color-button/color-button';
import { ColorInfoButton } from '../color-info-button/color-info-button';
import classes from './color-group.module.css';

type ColorGroupProps = {
  header: string;
  colorNames: SemanticColorNames[];
  colorScale: ThemeInfo;
  names?: string[];
  namespace: string;
};

export const ColorGroup = ({
  header,
  colorNames,
  names,
  colorScale,
  namespace,
}: ColorGroupProps) => {
  const { colorScheme } = useThemebuilder();

  return (
    <div>
      {header && <div className={classes.header}>{header}</div>}
      {header && names && (
        <div className={classes.names}>
          {names.map((name, index) => (
            <div key={index + 'name' + namespace}>{name}</div>
          ))}
        </div>
      )}

      <div className={classes.colors}>
        {colorNames.map((colorName) => {
          const color = colorScale[colorScheme][colorName];
          return (
            <div key={colorName} className={classes.step}>
              <ColorButton
                namespace={namespace}
                colorName={colorName}
                color={color}
              />
              <ColorInfoButton
                color={color}
                namespace={namespace}
                className={classes.info}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
