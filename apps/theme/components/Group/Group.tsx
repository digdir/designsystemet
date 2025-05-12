import { RovingFocusItem } from '@digdir/designsystemet-react';
import {
  type Color,
  type ColorNames,
  type ThemeInfo,
  colorMetadata,
  getColorMetadataByNumber,
} from '@digdir/designsystemet/color';
import cl from 'clsx/lite';

import { Color as ColorPreview } from '../Color/Color';

import { ColorModal } from '@internal/components';
import { createRef, useRef } from 'react';
import { useThemeStore } from '../../store';
import classes from './Group.module.css';

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

  const colorModalRefs = useRef<React.RefObject<HTMLDialogElement | null>[]>(
    [],
  );
  if (colorModalRefs.current.length !== colorNames.length) {
    colorModalRefs.current = Array(colorNames.length)
      .fill(null)
      .map(() => createRef<HTMLDialogElement>());
  }

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
            <div className={classes.test} key={index + 'fragment' + namespace}>
              <ColorModal
                colorModalRef={colorModalRefs.current[index]}
                namespace={namespace}
                color={color}
              />
              <RovingFocusItem value={namespace + number} asChild>
                <ColorPreview
                  color={hex}
                  colorName={colorName}
                  showColorMeta={showColorMeta}
                  aria-label={`Se mer om ${namespace} ${color?.displayName}`}
                  onClick={() =>
                    colorModalRefs.current[index]?.current?.showModal()
                  }
                />
              </RovingFocusItem>
            </div>
          );
        })}
      </div>
    </div>
  );
};
