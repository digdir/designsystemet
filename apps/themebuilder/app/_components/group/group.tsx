import { RovingFocusItem } from '@digdir/designsystemet-react';
import {
  type Color,
  type ColorNames,
  type ThemeInfo,
  colorMetadata,
  getColorMetadataByNumber,
} from '@digdir/designsystemet/color';
import cl from 'clsx/lite';

import { Color as ColorPreview } from '../color/color';

import { Fragment } from 'react';
import { useColorModalContext } from '~/_utils/color-modal-context';
import { useThemeStore } from '~/store';
import classes from './group.module.css';

type GroupProps = {
  header: string;
  colorNames: ColorNames[];
  colorScale: ThemeInfo;
  showColorMeta?: boolean;
  names?: string[];
  namespace: string;
};

export const Group = ({
  header,
  colorNames,
  showColorMeta,
  names,
  colorScale,
  namespace,
}: GroupProps) => {
  const colorScheme = useThemeStore((state) => state.colorScheme);
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
          const { number, hex } =
            colorScale[colorScheme][colorMetadata[colorName].number - 1];
          const color: Color = {
            ...getColorMetadataByNumber(number),
            number,
            hex,
          };
          return (
            <Fragment key={index + 'fragment' + namespace}>
              <RovingFocusItem value={namespace + number} asChild>
                <ColorPreview
                  color={hex}
                  colorName={colorName}
                  showColorMeta={showColorMeta}
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
