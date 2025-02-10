import type { ThemeInfo } from '@digdir/designsystemet/color';
import { useState } from 'react';
import { ColorFilter } from '../../ColorFilter/ColorFilter';
import { ColorInput } from '../../ColorInput/ColorInput';
import { useDebugStore } from '../../debugStore';
import { ColorIndexes, ColorScaleNames } from '../../utils';
import { Alert } from './Alert/Alert';
import classes from './ArticlePage.module.css';
import { File } from './File/File';

type ArticleProps = {
  scale: ThemeInfo;
  index1: number;
  index2: number;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
};

const Article = ({ scale, index1, index2 }: ArticleProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const statusColors = useDebugStore((state) => state.statusColors);
  const setStatusColors = useDebugStore((state) => state.setStatusColors);
  const themeSettings = useDebugStore((state) => state.themeSettings);

  const getAlertType = (
    index: number,
  ): 'success' | 'warning' | 'info' | 'error' => {
    if (index === 0) return 'success';
    if (index === 2) return 'warning';
    if (index === 3) return 'info';
    if (index === 4) return 'error';
    return 'error';
  };

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
              scale[themeSettings.general.colorScheme][ColorIndexes.textDefault]
                .hex,
          }}
        >
          {ColorScaleNames[index1]} {index2 + 1}
        </div>
        <div className={classes.topRight}>
          <button
            className={classes.btn}
            style={{
              backgroundColor: scale[themeSettings.general.colorScheme][11].hex,
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
        {index1 === 12 && (
          <>
            <ColorInput
              color={statusColors[getAlertType(index2)]}
              setColor={(color) =>
                setStatusColors({
                  ...statusColors,
                  [getAlertType(index2)]: color,
                })
              }
              position='top'
              showReset
              showPicker={showPicker}
              onColorClicked={() => {
                setShowPicker(!showPicker);
              }}
            />
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
          </>
        )}
        <div
          className={classes.section}
          style={{
            backgroundColor:
              scale[themeSettings.general.colorScheme][
                ColorIndexes.backgroundDefault
              ].hex,
          }}
        >
          <div className={classes.sectionContent}>
            <File scale={scale} />
          </div>
        </div>

        <div
          className={classes.section}
          style={{
            backgroundColor:
              scale[themeSettings.general.colorScheme][
                ColorIndexes.backgroundTinted
              ].hex,
          }}
        >
          <div className={classes.sectionContent}>
            <File scale={scale} />
          </div>
        </div>

        <div
          className={classes.section}
          style={{
            backgroundColor:
              scale[themeSettings.general.colorScheme][
                ColorIndexes.surfaceDefault
              ].hex,
          }}
        >
          <div className={classes.sectionContent}>
            <File scale={scale} />
          </div>
        </div>
      </div>
    </div>
  );
};

type ArticlePageProps = {
  colorScales: ThemeInfo[][];
};

export const ArticlePage = ({ colorScales }: ArticlePageProps) => {
  const [activeColor, setActiveColor] = useState('Alle');
  const themeSettings = useDebugStore((state) => state.themeSettings);

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
