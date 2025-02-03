import type { ThemeInfo } from '@digdir/designsystemet/color';
import { useState } from 'react';
import { ColorFilter } from '../../ColorFilter/ColorFilter';
import { ColorScaleNames } from '../../utils';
import { Accordion } from './Accordion/Accordion';
import { Alert } from './Alert/Alert';
import classes from './ArticlePage.module.css';

type ArticlePageProps = {
  colorScales: ThemeInfo[][];
  index: number;
};

export const ArticlePage = ({ colorScales }: ArticlePageProps) => {
  const [activeColor, setActiveColor] = useState('Alle');

  type ArticleProps = {
    scale: ThemeInfo;
    index: number;
  };

  const getAlertType = (
    index: number,
  ): 'success' | 'warning' | 'info' | 'error' => {
    if (index % 4 === 0) return 'success';
    if (index % 4 === 1) return 'warning';
    if (index % 4 === 2) return 'info';
    return 'error';
  };

  const Article = ({ scale, index }: ArticleProps) => {
    return (
      <div className={classes.item}>
        <div className={classes.top}>
          <div className={classes.topLeft}>Logo</div>
          <div className={classes.topRight}>
            <button
              className={classes.btn}
              style={{
                backgroundColor: scale.light[11].hex,
                color: scale.light[14].hex,
              }}
            >
              Login
            </button>
            <button
              className={classes.btn}
              style={{
                backgroundColor: scale.light[11].hex,
                color: scale.light[14].hex,
              }}
            >
              Signin
            </button>
          </div>
        </div>
        <div className={classes.content}>
          <Alert type={getAlertType(index)} />
          <div>
            Receive also such of sleep inn they of move bed these owner to for
            preceding quite practice to again. With the or be to and merit.
          </div>
          <Accordion scale={scale} />
          <div>
            Receive also such of sleep inn they of move bed these owner to for
            preceding quite practice to again. With the or be to and merit.
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={classes.page}>
      <div className={classes.pageHeading}>Article Design</div>
      <ColorFilter onFilterChange={(e) => setActiveColor(e)} />
      <div className={classes.items}>
        {colorScales.map((innerScale, index) => (
          <div key={index}>
            {(ColorScaleNames[index] === activeColor ||
              activeColor === 'Alle') && (
              <>
                <div className={classes.title}>{ColorScaleNames[index]}</div>
                <div className={classes.innerItems}>
                  {innerScale.map((scale, index2) => (
                    <Article key={index2} scale={scale} index={index2} />
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
