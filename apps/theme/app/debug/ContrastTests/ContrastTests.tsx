import { getContrastFromHex } from '@/packages/cli/dist/src';
import cl from 'clsx/lite';
import { useDebugStore } from '../debugStore';
import { generateColorSchemes } from '../logic/theme';
import classes from './ContrastTests.module.css';

type ItemProps = {
  text: string;
  color1: string;
  color2: string;
  limit: number;
};

export const ContrastTests = () => {
  const luminance = useDebugStore((state) => state.luminance);
  const theme = generateColorSchemes('#008000', luminance, {
    baseModifier: 8,
    interpolationMode: 'rgb',
  });

  const Item = ({ text, color1, color2, limit }: ItemProps) => {
    const contrast = getContrastFromHex(color1, color2);
    return (
      <div className={cl(classes.item, contrast > limit && classes.itemPassed)}>
        <div className={classes.circle}>{contrast.toFixed(1)}</div>
        <div className={classes.textContainer}>
          <div>{text}</div>
        </div>
      </div>
    );
  };

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <div className={classes.column}>
          <div>Text Default: Light</div>
          <div className={classes.items}>
            <Item
              color1={theme.light[0].hex}
              color2={theme.light[12].hex}
              limit={4.5}
              text='Text Default against Background Default: 4.5:1'
            />
            <Item
              color1={theme.light[1].hex}
              color2={theme.light[12].hex}
              limit={4.5}
              text='Text Default against Background Subtle: 4.5:1'
            />
            <Item
              color1={theme.light[2].hex}
              color2={theme.light[12].hex}
              limit={4.5}
              text='Text Default against Surface Default Subtle: 4.5:1'
            />
            <Item
              color1={theme.light[3].hex}
              color2={theme.light[12].hex}
              limit={4.5}
              text='Text Default against Surface Hover : 4.5:1'
            />
            <Item
              color1={theme.light[4].hex}
              color2={theme.light[12].hex}
              limit={4.5}
              text='Text Default against Surface Active : 4.5:1'
            />
          </div>
        </div>
        <div className={classes.column}>
          <div>Text Default: Dark</div>
          <div className={classes.items}>
            <Item
              color1={theme.dark[0].hex}
              color2={theme.dark[12].hex}
              limit={4.5}
              text='Text Default against Background Default: 4.5:1'
            />
            <Item
              color1={theme.dark[1].hex}
              color2={theme.dark[12].hex}
              limit={4.5}
              text='Text Default against Background Subtle: 4.5:1'
            />
            <Item
              color1={theme.dark[2].hex}
              color2={theme.dark[12].hex}
              limit={4.5}
              text='Text Default against Surface Default Subtle: 4.5:1'
            />
            <Item
              color1={theme.dark[3].hex}
              color2={theme.dark[12].hex}
              limit={4.5}
              text='Text Default against Surface Hover : 4.5:1'
            />
            <Item
              color1={theme.dark[4].hex}
              color2={theme.dark[12].hex}
              limit={4.5}
              text='Text Default against Surface Active : 4.5:1'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
