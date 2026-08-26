import type {
  SemanticColorNames,
  ThemeInfo,
} from '@digdir/designsystemet/color';
import { RovingFocusItem } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { Fragment } from 'react';
import { useColorModalContext } from '~/_utils/color-modal-context';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
import { ColorButton } from '../color-button/color-button';
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
  const { openColorModal } = useColorModalContext();

  return (
    <div>
      {header && <div className={cl(classes.header)}>{header}</div>}
      {header && names && (
        <div className={classes.names}>
          {names.map((name, index) => (
            <div key={index + 'name' + namespace}>{name}</div>
          ))}
        </div>
      )}

      <div className={cl(classes.colors)}>
        {colorNames.map((colorName, index) => {
          const color = colorScale[colorScheme][colorName];
          const { number, hex } = color;
          return (
            <Fragment key={index + 'fragment' + namespace}>
              <RovingFocusItem value={namespace + number} asChild>
                <ColorButton
                  color={hex}
                  colorName={colorName}
                  aria-label={`Se mer om ${namespace} ${color?.displayName}`}
                  onClick={() => openColorModal(color, namespace)}
                />
              </RovingFocusItem>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
