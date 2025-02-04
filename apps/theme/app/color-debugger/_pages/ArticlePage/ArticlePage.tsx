import type { ThemeInfo } from '@digdir/designsystemet/color';
import { useState } from 'react';
import { ColorFilter } from '../../ColorFilter/ColorFilter';
import { useDebugStore } from '../../debugStore';
import { ColorIndexes, ColorScaleNames } from '../../utils';
import { Accordion } from './Accordion/Accordion';
import { Alert } from './Alert/Alert';
import classes from './ArticlePage.module.css';
import { File } from './File/File';

type ArticlePageProps = {
  colorScales: ThemeInfo[][];
};

export const ArticlePage = ({ colorScales }: ArticlePageProps) => {
  const [activeColor, setActiveColor] = useState('Alle');
  const themeSettings = useDebugStore((state) => state.themeSettings);

  type ArticleProps = {
    scale: ThemeInfo;
    index1: number;
    index2: number;
  };

  const getAlertType = (
    index: number,
  ): 'success' | 'warning' | 'info' | 'error' => {
    if (index % 4 === 0) return 'success';
    if (index % 4 === 1) return 'warning';
    if (index % 4 === 2) return 'info';
    return 'error';
  };

  const Article = ({ scale, index1, index2 }: ArticleProps) => {
    return (
      <div
        className={classes.item}
        style={{
          backgroundColor:
            scale[themeSettings.general.colorScheme][
              ColorIndexes.backgroundDefault
            ].hex,
        }}
      >
        <div className={classes.top}>
          <div
            className={classes.topLeft}
            style={{
              color:
                scale[themeSettings.general.colorScheme][
                  ColorIndexes.textDefault
                ].hex,
            }}
          >
            {ColorScaleNames[index1]} {index2 + 1}
          </div>
          <div className={classes.topRight}>
            <button
              className={classes.btn}
              style={{
                backgroundColor:
                  scale[themeSettings.general.colorScheme][11].hex,
                color: scale[themeSettings.general.colorScheme][14].hex,
              }}
            >
              Sign up
            </button>
            <button
              className={classes.btn}
              style={{
                backgroundColor:
                  scale[themeSettings.general.colorScheme][
                    ColorIndexes.surfaceDefault
                  ].hex,
                color:
                  scale[themeSettings.general.colorScheme][
                    ColorIndexes.textSubtle
                  ].hex,
                border: `2px solid ${scale[themeSettings.general.colorScheme][ColorIndexes.textSubtle].hex}`,
              }}
            >
              Login
            </button>
          </div>
        </div>
        <div className={classes.content}>
          <File scale={scale} />

          <div
            style={{
              color:
                scale[themeSettings.general.colorScheme][
                  ColorIndexes.textDefault
                ].hex,
            }}
          >
            Receive also such of sleep inn they of move bed these owner to for
            preceding quite practice to again. With the or be to and merit.
          </div>

          <Alert type={getAlertType(index2)} />
          <div
            style={{
              color:
                scale[themeSettings.general.colorScheme][
                  ColorIndexes.textDefault
                ].hex,
            }}
          >
            Receive also such of sleep inn they of move bed these owner to for
            preceding quite practice to again. With the or be to and merit.
          </div>
          <Accordion scale={scale} />
        </div>
      </div>
    );
  };

  return (
    <div className={classes.page}>
      <div className={classes.pageHeading}>Article Design</div>
      <ColorFilter onFilterChange={(e) => setActiveColor(e)} />
      <div className={classes.items}>
        {colorScales.map((innerScale, index1) => (
          <div key={index1}>
            {(ColorScaleNames[index1] === activeColor ||
              activeColor === 'Alle') && (
              <>
                <div className={classes.title}>{ColorScaleNames[index1]}</div>
                <div className={classes.innerItems}>
                  {innerScale.map((scale, index2) => (
                    <Article
                      key={index2}
                      scale={scale}
                      index1={index1}
                      index2={index2}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
