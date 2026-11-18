import type {
  Color,
  SemanticColorNames,
  ThemeInfo,
} from '@digdir/designsystemet/internal';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '~/_hooks/use-color-scheme';
import { ColorButton } from '../color-button/color-button';
import classes from './color-group.module.css';

type ColorGroupProps = {
  /** The name of the group. When set, it is shown above the steps together with their names. */
  header?: string;
  colorNames: SemanticColorNames[];
  /** The names of the steps, in the order of `colorNames` */
  names: string[];
  colorScale: ThemeInfo;
  /** The name of the color */
  namespace: string;
  onSelect: (step: Color) => void;
};

/** The steps of one group of a color scale, such as Background or Border */
export const ColorGroup = ({
  header,
  colorNames,
  names,
  colorScale,
  namespace,
  onSelect,
}: ColorGroupProps) => {
  const [colorScheme] = useColorScheme();
  const { t } = useTranslation();

  return (
    <div>
      {header && (
        <>
          <div className={classes.header}>{header}</div>
          <div className={classes.names}>
            {names.map((name) => (
              <div key={name}>{name}</div>
            ))}
          </div>
        </>
      )}

      <div className={classes.colors}>
        {colorNames.map((colorName) => {
          const color = colorScale[colorScheme][colorName];
          return (
            <ColorButton
              key={colorName}
              color={color.hex}
              aria-label={t('colorGroup.see-more', {
                namespace,
                color: color.displayName,
              })}
              onClick={() => onSelect(color)}
            />
          );
        })}
      </div>
    </div>
  );
};
