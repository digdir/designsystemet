import type { CssColor } from '@digdir/designsystemet/color';
import cl from 'clsx/lite';
import { useEffect, useState } from 'react';
import { useColor } from 'react-color-palette';
import { ColorInput } from '../ColorInput/ColorInput';
import { useDebugStore } from '../debugStore';
import { generateColorSchemes } from '../logic/theme';
import classes from './ColorScale.module.css';

export const ColorScale = () => {
  const luminance = useDebugStore((state) => state.luminance);
  const themeSettings = useDebugStore((state) => state.themeSettings);
  const [color, setColor] = useColor('#0062BA');
  const [scale, setScale] = useState(
    generateColorSchemes(color.hex as CssColor, luminance, themeSettings),
  );
  const [showPicker, setShowPicker] = useState(false);

  type ItemProps = {
    item: { name: string; hex: string };
  };

  useEffect(() => {
    setScale(
      generateColorSchemes(color.hex as CssColor, luminance, themeSettings),
    );
  }, [luminance, themeSettings, color]);

  const Item = ({ item }: ItemProps) => {
    return (
      <div className={classes.item}>
        <div className={classes.name}>{item.name}</div>
        <div
          className={classes.color}
          style={{ backgroundColor: item.hex }}
        ></div>
      </div>
    );
  };

  type GroupProps = {
    name: string;
    items: { name: string; hex: string }[];
  };

  const Group = ({ name, items }: GroupProps) => {
    return (
      <div className={cl(classes.group, classes['group-' + items.length])}>
        <div className={classes.title}>{name}</div>
        <div className={classes.items}>
          {items?.map((item, index) => (
            <Item key={index} item={item} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.heading}>Color scale</div>
        <div>
          <ColorInput
            color={color}
            setColor={setColor}
            onColorClicked={() => {
              setShowPicker(!showPicker);
            }}
            showPicker={showPicker}
          />
        </div>
      </div>
      <div className={cl(classes.scale, classes.panel)}>
        <Group
          name='Background'
          items={[
            {
              name: 'Default',
              hex: scale[themeSettings.general.colorScheme][0].hex,
            },
            {
              name: 'Tinted',
              hex: scale[themeSettings.general.colorScheme][1].hex,
            },
          ]}
        />
        <Group
          name='Surface'
          items={[
            {
              name: 'Default',
              hex: scale[themeSettings.general.colorScheme][2].hex,
            },
            {
              name: 'Tinted',
              hex: scale[themeSettings.general.colorScheme][3].hex,
            },
            {
              name: 'Hover',
              hex: scale[themeSettings.general.colorScheme][4].hex,
            },
            {
              name: 'Active',
              hex: scale[themeSettings.general.colorScheme][5].hex,
            },
          ]}
        />

        <Group
          name='Border'
          items={[
            {
              name: 'Subtle',
              hex: scale[themeSettings.general.colorScheme][6].hex,
            },
            {
              name: 'Default',
              hex: scale[themeSettings.general.colorScheme][7].hex,
            },
            {
              name: 'Strong',
              hex: scale[themeSettings.general.colorScheme][8].hex,
            },
          ]}
        />
        <Group
          name='Text'
          items={[
            {
              name: 'Subtle',
              hex: scale[themeSettings.general.colorScheme][9].hex,
            },
            {
              name: 'Default',
              hex: scale[themeSettings.general.colorScheme][10].hex,
            },
          ]}
        />

        <Group
          name='Base'
          items={[
            {
              name: 'Default',
              hex: scale[themeSettings.general.colorScheme][11].hex,
            },
            {
              name: 'Hover',
              hex: scale[themeSettings.general.colorScheme][12].hex,
            },
            {
              name: 'Active',
              hex: scale[themeSettings.general.colorScheme][13].hex,
            },
            {
              name: 'Con S',
              hex: scale[themeSettings.general.colorScheme][14].hex,
            },
            {
              name: 'Con D',
              hex: scale[themeSettings.general.colorScheme][15].hex,
            },
          ]}
        />
      </div>
    </div>
  );
};
