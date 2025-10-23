import {
  type Color,
  type ColorNames,
  type CssColor,
  colorMetadata,
  getColorMetadataByNumber,
  type ThemeInfo,
} from '@digdir/designsystemet/color';
import { RovingFocusItem } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { Fragment } from 'react';
import { useColorModalContext } from '~/_utils/color-modal-context';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
import { Color as ColorPreview } from '../color/color';
import classes from './group.module.css';

type GroupProps = {
  header: string;
  colorNames: ColorNames[];
  colorScale: ThemeInfo;
  names?: string[];
  namespace: string;
  overrides?: Record<string, { light?: CssColor; dark?: CssColor }>;
};

export const Group = ({
  header,
  colorNames,
  names,
  colorScale,
  namespace,
  overrides,
}: GroupProps) => {
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
          const { number, hex } =
            colorScale[colorScheme][colorMetadata[colorName].number - 1];

          const override = overrides?.[colorName];
          const overrideHex =
            override && (colorScheme === 'light' || colorScheme === 'dark')
              ? override[colorScheme]
              : undefined;

          const color: Color = {
            ...getColorMetadataByNumber(number),
            number,
            hex: overrideHex || hex,
          };
          return (
            <Fragment key={index + 'fragment' + namespace}>
              <RovingFocusItem value={namespace + number} asChild>
                <ColorPreview
                  color={overrideHex || hex}
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
