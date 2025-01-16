import { RovingFocusItem } from '@digdir/designsystemet-react';
import type { ThemeInfo } from '@digdir/designsystemet/color';
import cl from 'clsx/lite';

import { Color } from '../Color/Color';

import { ColorModal } from '@repo/components';
import { useRef } from 'react';
import { useThemeStore } from '../../store';
import classes from './Group.module.css';

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

  const colorModalRef = useRef<HTMLDialogElement>(null);

  return (
    <div className={classes.group}>
      {header && <div className={cl(classes.header)}>{header}</div>}
      {header && names && (
        <div className={classes.names}>
          {names.map((name, index) => (
            <div key={index}>{name}</div>
          ))}
        </div>
      )}

      <div className={cl(classes.colors)}>
        {colors.map((item, index) => {
          return (
            <>
              <ColorModal
                key={index + 'modal'}
                colorModalRef={colorModalRef}
                hex={
                  appearance === 'light'
                    ? colorScale.light[item].hex
                    : colorScale.dark[item].hex
                }
                namespace={namespace}
                weight={colorScale.light[item].number}
              />
              <RovingFocusItem key={index} value={'3'} asChild>
                <Color
                  color={
                    appearance === 'light'
                      ? colorScale.light[item].hex
                      : colorScale.dark[item].hex
                  }
                  colorNumber={item}
                  contrast={'dd'}
                  lightness={'dd'}
                  showColorMeta={showColorMeta}
                  name='33'
                  onClick={() => colorModalRef.current?.showModal()}
                />
              </RovingFocusItem>
            </>
          );
        })}
      </div>
    </div>
  );
};
