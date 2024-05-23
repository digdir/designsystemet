'use client';
import { Heading } from '@digdir/designsystemet-react';
import type { CssColor } from '@adobe/leonardo-contrast-colors';

import { generateColorScale } from '@/utils/themeUtils';

import { ContrastBox } from '../ContrastBox/ContrastBox';

import classes from './BaseContrast.module.css';

export const BaseContrast = () => {
  const scale1 = generateColorScale('#0062BA', 'light');
  const scale2 = generateColorScale('#1E98F5', 'light');
  const scale3 = generateColorScale('#E5AA20', 'light');
  const scale4 = generateColorScale('#f3e02e', 'light');
  const scale5 = generateColorScale('#DE251B', 'light');
  const scale6 = generateColorScale('#F45F63', 'light');
  const scale7 = generateColorScale('#054449', 'light');
  const scale8 = generateColorScale('#7befb2', 'light');
  const scale9 = generateColorScale('#410464', 'light');
  const scale10 = generateColorScale('#A845E1', 'light');
  const scale11 = generateColorScale('#109E96', 'light');
  const scale12 = generateColorScale('#30E3D9', 'light');
  return (
    <div className={classes.container}>
      <BaseColumn
        title='Base: #0062BA'
        colorScale={scale1}
      />
      <BaseColumn
        title='Base: #1E98F5'
        colorScale={scale2}
      />
      <BaseColumn
        title='Base: #E5AA20'
        colorScale={scale3}
      />
      <BaseColumn
        title='Base: #f3e02e'
        colorScale={scale4}
      />
      <BaseColumn
        title='Base: #DE251B'
        colorScale={scale5}
      />
      <BaseColumn
        title='Base: #F45F63'
        colorScale={scale6}
      />
      <BaseColumn
        title='Base: #054449'
        colorScale={scale7}
      />
      <BaseColumn
        title='Base: #410464'
        colorScale={scale8}
      />
      <BaseColumn
        title='Base: #7befb2'
        colorScale={scale9}
      />
      <BaseColumn
        title='Base: #A845E1'
        colorScale={scale10}
      />
      <BaseColumn
        title='Base: #109E96'
        colorScale={scale11}
      />
      <BaseColumn
        title='Base: #30E3D9'
        colorScale={scale12}
      />
    </div>
  );
};

type BaseColumnProps = {
  colorScale: CssColor[];
  title: string;
};

const BaseColumn = ({ colorScale, title }: BaseColumnProps) => {
  return (
    <div className={classes.column}>
      <Heading size='small'>{title}</Heading>
      <div className={classes.boxes}>
        <BaseBox
          title='Light'
          colorScale={colorScale}
        />
        <BaseBox
          title='Dark'
          colorScale={colorScale}
        />
        <BaseBox
          title='Contrast'
          colorScale={colorScale}
        />
      </div>
    </div>
  );
};

type BaseBoxProps = {
  colorScale: CssColor[];
  title: string;
};

const BaseBox = ({ colorScale, title }: BaseBoxProps) => {
  return (
    <div className={classes.box}>
      <Heading
        className={classes.boxTitle}
        size='xsmall'
      >
        {title}
      </Heading>
      <div
        className={classes.item}
        style={{ backgroundColor: colorScale[8] }}
      >
        <div className={classes.colorRow}>
          <div className={classes.colorItem}>
            <div style={{ color: colorScale[13] }}>Contrast 1</div>
            {ContrastBox(colorScale[8], colorScale[13])}
          </div>
          <div className={classes.colorItem}>
            <div style={{ color: colorScale[14] }}>Contrast 2</div>
            {ContrastBox(colorScale[8], colorScale[14])}
          </div>
        </div>
      </div>
      <div
        className={classes.item}
        style={{ backgroundColor: colorScale[9] }}
      >
        <div className={classes.colorRow}>
          <div className={classes.colorItem}>
            <div style={{ color: colorScale[13] }}>Contrast 1</div>
            {ContrastBox(colorScale[9], colorScale[13])}
          </div>
          <div className={classes.colorItem}>
            <div style={{ color: colorScale[14] }}>Contrast 2</div>
            {ContrastBox(colorScale[9], colorScale[14])}
          </div>
        </div>
      </div>
      <div
        className={classes.item}
        style={{ backgroundColor: colorScale[10] }}
      >
        <div className={classes.colorRow}>
          <div className={classes.colorItem}>
            <div style={{ color: colorScale[13] }}>Contrast 1</div>
            {ContrastBox(colorScale[10], colorScale[13])}
          </div>
          <div className={classes.colorItem}>
            <div style={{ color: colorScale[14] }}>Contrast 2</div>
            {ContrastBox(colorScale[10], colorScale[14])}
          </div>
        </div>
      </div>
    </div>
  );
};
