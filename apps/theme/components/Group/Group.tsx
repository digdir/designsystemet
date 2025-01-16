import { RovingFocusItem } from '@digdir/designsystemet-react';
import type { ThemeInfo } from '@digdir/designsystemet/color';
import cl from 'clsx/lite';

import { Color } from '../Color/Color';

import { ColorModal } from '@repo/components';
import { useRef } from 'react';
import { useThemeStore } from '../../store';
import classes from './Group.module.css';

import { Fragment } from 'react';

type GroupProps = {
  header: string;
  colors: number[];
  colorScale: ThemeInfo;
  showColorMeta?: boolean;
  names?: string[];
  namespace: string;
};

export const Group = ({
  header,
  colors,
  showColorMeta,
  names,
  colorScale,
  namespace,
}: GroupProps) => {
  const appearance = useThemeStore((state) => state.appearance);

  const colorModalRefs = useRef<(HTMLDialogElement | null)[]>([]);
  if (colorModalRefs.current.length !== colors.length) {
    colorModalRefs.current = Array(colors.length).fill(null);
  }

  const handleColorModalRef =
    (index: number) => (el: HTMLDialogElement | null) => {
      colorModalRefs.current[index] = el;
    };

  return (
    <div className={classes.group}>
      {header && <div className={cl(classes.header)}>{header}</div>}
      {header && names && (
        <div className={classes.names}>
          {names.map((name, index) => (
            <div key={index + 'name' + namespace}>{name}</div>
          ))}
        </div>
      )}

      <div className={cl(classes.colors)}>
        {colors.map((item, index) => {
          return (
            <Fragment key={index + 'fragment' + namespace}>
              <ColorModal
                colorModalRef={handleColorModalRef(index)}
                hex={colorScale[appearance][item].hex}
                namespace={namespace}
                weight={colorScale[appearance][item].number}
              />
              <RovingFocusItem
                value={namespace + colorScale[appearance][item].number}
                asChild
              >
                <Color
                  color={colorScale[appearance][item].hex}
                  colorNumber={item}
                  contrast={'dd'}
                  lightness={'dd'}
                  showColorMeta={showColorMeta}
                  onClick={() => colorModalRefs.current[index]?.showModal()}
                />
              </RovingFocusItem>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
