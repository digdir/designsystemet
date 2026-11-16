import type {
  SemanticColorNames,
  ThemeInfo,
} from '@digdir/designsystemet/internal';
import cl from 'clsx/lite';
import { useTranslation } from 'react-i18next';
import { useColorModalContext } from '~/_components/color-modal/color-modal-context';
import { useThemebuilder } from '~/_hooks/use-themebuilder';
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
  const { t } = useTranslation();
  const { openColorModal } = useColorModalContext();

  return (
    <div>
      {header && <div className={cl(classes.header)}>{header}</div>}
      {header && names && (
        <div className={classes.names}>
          {names.map((name) => (
            <div key={name}>{name}</div>
          ))}
        </div>
      )}

      <div className={cl(classes.colors)}>
        {colorNames.map((colorName) => {
          const color = colorScale[colorScheme][colorName];
          const { hex } = color;
          return (
            <ColorButton
              key={colorName}
              color={hex}
              colorName={colorName}
              aria-label={t('colorGroup.see-more', {
                namespace,
                color: color?.displayName,
              })}
              onClick={() => openColorModal(color, namespace)}
            />
          );
        })}
      </div>
    </div>
  );
};
