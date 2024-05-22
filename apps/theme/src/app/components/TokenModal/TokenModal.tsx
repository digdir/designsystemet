'use client';

import { Heading, Modal, Tabs } from '@digdir/designsystemet-react';
import { useEffect, useRef, useState } from 'react';
import { CodeSnippet } from '../CodeSnippet/CodeSnippet';
import { modeType } from '@/types';
import { CssColor } from '@adobe/leonardo-contrast-colors';
import { generateColorScale } from '@/utils/themeUtils';
import classes from './TokenModal.module.css';

type TokenModalProps = {
  accentColor: CssColor;
  neutralColor: CssColor;
  brand1Color: CssColor;
  brand2Color: CssColor;
  brand3Color: CssColor;
};

export const TokenModal = ({
  accentColor,
  neutralColor,
  brand1Color,
  brand2Color,
  brand3Color,
}: TokenModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [JSONTheme, setJSONTheme] = useState('');
  const [css, setCss] = useState(
    '@root { --color-1: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; --color-2: #F45F63; }',
  );

  const generateJsonForColor = (colorArray: CssColor[]) => {
    const obj: { [key: string]: { value: string; type: string } } = {};
    for (let i = 0; i < colorArray.length; i++) {
      if (i === 13 && colorArray.length >= 14) {
        obj['contrast-1'] = {
          value: colorArray[i],
          type: 'color',
        };
      } else if (i === 14 && colorArray.length >= 15) {
        obj['contrast-2'] = {
          value: colorArray[i],
          type: 'color',
        };
      } else {
        obj[i + 1] = { value: colorArray[i], type: 'color' };
      }
    }
    return obj;
  };

  const genereateGlobalsJson = (theme: modeType) => {
    const blueColors = generateColorScale('#0A71C0', theme);
    const greenColors = generateColorScale('#07991A', theme);
    const orangeColors = generateColorScale('#D46223', theme);
    const purpleColors = generateColorScale('#663299', theme);
    const redColors = generateColorScale('#E51C1D', theme);
    const yellowColors = generateColorScale('#EABF28', theme);

    const obj = {
      global: {
        blue: generateJsonForColor(blueColors),
        green: generateJsonForColor(greenColors),
        orange: generateJsonForColor(orangeColors),
        purple: generateJsonForColor(purpleColors),
        red: generateJsonForColor(redColors),
        yellow: generateJsonForColor(yellowColors),
      },
    };

    const json = JSON.stringify(obj, null, '\t');
    setJSONTheme(json);
  };

  const generateThemeJson = (theme: modeType) => {
    const accentColors = generateColorScale(accentColor, theme);
    const neutralColors = generateColorScale(neutralColor, theme);
    const brand1Colors = generateColorScale(brand1Color, theme);
    const brand2Colors = generateColorScale(brand2Color, theme);
    const brand3Colors = generateColorScale(brand3Color, theme);

    const obj = {
      theme: {
        accent: generateJsonForColor(accentColors),
        neutral: generateJsonForColor(neutralColors),
        brand1: generateJsonForColor(brand1Colors),
        brand2: generateJsonForColor(brand2Colors),
        brand3: generateJsonForColor(brand3Colors),
      },
    };

    const json = JSON.stringify(obj, null, '\t');
    setJSONTheme(json);
  };

  useEffect(() => {
    generateThemeJson('light');
  }, []);

  return (
    <Modal.Root>
      <Modal.Trigger
        onClick={() => {
          generateThemeJson('light');
          return modalRef.current?.showModal();
        }}
      >
        Kopier tema
      </Modal.Trigger>
      <Modal.Dialog
        ref={modalRef}
        onInteractOutside={() => modalRef.current?.close()}
        style={{
          maxWidth: '1400px',
        }}
        className={classes.modal}
      >
        <Modal.Header>Kopier tema</Modal.Header>
        <Modal.Content className={classes.modalContent}>
          <div className={classes.content}>
            <div className={classes.column}>
              <Heading
                className={classes.title}
                size='xsmall'
              >
                Json til Figma
              </Heading>
              <div className={classes.tabs}>
                <Tabs
                  defaultValue='value1'
                  size='small'
                >
                  <Tabs.List>
                    <Tabs.Tab
                      onClick={() => generateThemeJson('light')}
                      value='value1'
                    >
                      Light
                    </Tabs.Tab>
                    <Tabs.Tab
                      onClick={() => generateThemeJson('dark')}
                      value='value2'
                    >
                      Dark
                    </Tabs.Tab>
                    <Tabs.Tab
                      onClick={() => generateThemeJson('contrast')}
                      value='value3'
                    >
                      Contrast
                    </Tabs.Tab>
                    <Tabs.Tab
                      onClick={() => genereateGlobalsJson('light')}
                      value='value4'
                    >
                      G: Light
                    </Tabs.Tab>
                    <Tabs.Tab
                      onClick={() => genereateGlobalsJson('dark')}
                      value='value5'
                    >
                      G: Dark
                    </Tabs.Tab>
                    <Tabs.Tab
                      onClick={() => genereateGlobalsJson('contrast')}
                      value='value6'
                    >
                      G: Contrast
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs>
              </div>
              <div className={classes.snippet}>
                <CodeSnippet language='css'>{JSONTheme}</CodeSnippet>
              </div>
            </div>
            <div className={classes.column}>
              <Heading
                className={classes.title}
                size='xsmall'
              >
                CSS variabler
              </Heading>
              <div className={classes.snippet}>
                {/* <CodeSnippet language='css'>{css}</CodeSnippet> */}
              </div>
            </div>
          </div>
        </Modal.Content>
      </Modal.Dialog>
    </Modal.Root>
  );
};
