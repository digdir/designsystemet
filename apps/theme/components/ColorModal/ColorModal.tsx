import {
  Accordion,
  Heading,
  Paragraph,
  Modal,
} from '@digdir/designsystemet-react';
import type {
  ColorInfo,
  ColorNumber,
  ColorType,
} from '@digdir/designsystemet/color';
import {
  areColorsContrasting,
  getApcaContrastLc,
  getColorNameFromNumber,
  getCssVariable,
  hexToHsluv,
} from '@digdir/designsystemet/color';
import {
  ExclamationmarkTriangleFillIcon,
  CheckmarkCircleFillIcon,
} from '@navikt/aksel-icons';
import type { CssColor } from '@adobe/leonardo-contrast-colors';

import { CopyBtn } from '../CopyBtn/CopyBtn';

import classes from './ColorModal.module.css';

type ColorModalProps = {
  colorModalRef: React.RefObject<HTMLDialogElement>;
  color: { color: ColorInfo; type: ColorType };
  colorTheme: ColorInfo[];
};

const Field = ({
  label,
  value,
  copyBtn = false,
}: {
  label: string;
  value: string;
  copyBtn?: boolean;
}) => {
  return (
    <div className={classes.field}>
      {label && (
        <Paragraph
          size='sm'
          className={classes.label}
        >
          {label}
        </Paragraph>
      )}
      <Paragraph
        size='sm'
        className={classes.value}
      >
        {value}
      </Paragraph>
      {copyBtn && <CopyBtn text={value} />}
    </div>
  );
};

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const ColorDescription = ({ color }: { color: ColorInfo }) => {
  let description = color.name;
  if (color.number === 1) {
    description += ' er den mest nøytrale bakgrunnsfargen.';
  } else if (color.number === 2) {
    description += ' er en bakgrunnsfarge som har et hint av farge i seg.';
  } else if (color.number === 3) {
    description +=
      ' brukes på flater som ligger oppå bakgrunnsfargene i en nøytral state. Fargen brukes i Card komponenten.';
  } else if (color.number === 4) {
    description +=
      ' brukes på interaktive elementer som ligger oppå bakgrunnsfargene i en hover state.';
  } else if (color.number === 5) {
    description +=
      ' brukes på interaktive elementer som ligger oppå bakgrunnsfargene i en active state.';
  } else if (color.number === 6) {
    description +=
      ' er den lyseste border-fargen og brukes for å skille elementer fra hverandre. Fargen brukessom border-farge i Divider komponenten og i Tabeller.';
  } else if (color.number === 7) {
    description +=
      ' er en border-farge som brukes når man ønsker god kontrast mot bakgrunnsfargene. Fargen brukes som border-farge i TextField komponenten.';
  } else if (color.number === 8) {
    description +=
      ' er den mørkeste border-fargen som brukes når man ønsker god kontrast.';
  } else if (color.number === 9) {
    description += ` er den lyseste tekstfargen og brukes på tekst som skal være litt mindre synlig eller for å skape variasjon i typografien.`;
  } else if (color.number === 12) {
    description +=
      ' er den lyseste tekstfargen og brukes på tekst som skal være litt mindre synlig eller for å skape variasjon i typografien.';
  } else if (color.number === 13) {
    description +=
      ' er den mørkeste tekstfargen og brukes på tekst som skal være mest synlig. Denne fargen bør brukes på mesteparten av teksten på en side.';
  }
  return <div className={classes.description}>{description}</div>;
};

const getColorCombinations = (colorNumber: number) => {
  let text = '';
  if (colorNumber === 1 || colorNumber === 2) {
    text += 'Alle fargene.';
  } else if (colorNumber === 3 || colorNumber === 4 || colorNumber === 5) {
    text += 'Background subtle- og Default.';
  } else if (colorNumber === 6) {
    text += 'Background fargene og Surface Default.';
  } else if (colorNumber === 7 || colorNumber === 8) {
    text += 'Background fargene og Surface Default';
  } else if (colorNumber === 12) {
    text += 'Background fargene og Surface Default.';
  } else if (colorNumber === 13) {
    text += 'Background- og Surface Fargene.';
  }
  return text;
};

const ContrastItem = ({
  error,
  text,
  subText,
}: {
  text: string;
  error: boolean;
  subText: string;
}) => {
  return (
    <div className={classes.contrastItem}>
      {error ? (
        <ExclamationmarkTriangleFillIcon
          title='a11y-title'
          fontSize='1.3rem'
          className={classes.contrastError}
        />
      ) : (
        <CheckmarkCircleFillIcon
          title='a11y-title'
          fontSize='1.3rem'
        />
      )}
      {text} <span className={classes.contrastItemSubText}>{subText}</span>
    </div>
  );
};

const ContrastBox = ({
  title,
  selectedColor,
  contrastColor,
  colorNumber,
}: {
  title: string;
  selectedColor: CssColor;
  contrastColor: CssColor;
  colorNumber: ColorNumber;
}) => {
  return (
    <div className={classes.contrastBox}>
      <Heading
        level={2}
        className={classes.contrastTitle}
      >
        {title}
      </Heading>
      <h3 className={classes.contrastSubTitle}>WCAG 2</h3>
      {colorNumber !== 12 && colorNumber !== 13 && (
        <div className={classes.contrastContainer}>
          <ContrastItem
            text='AA'
            subText='(3:1)'
            error={
              !areColorsContrasting(selectedColor, contrastColor, 'decorative')
            }
          />
        </div>
      )}
      <div className={classes.contrastContainer}>
        <ContrastItem
          text='AA'
          subText='(4.5:1)'
          error={!areColorsContrasting(selectedColor, contrastColor, 'aa')}
        />
      </div>
      <div className={classes.contrastContainer}>
        <ContrastItem
          text='AAA'
          subText='(7:1)'
          error={!areColorsContrasting(selectedColor, contrastColor, 'aaa')}
        />
      </div>

      {(colorNumber === 12 || colorNumber === 13) && (
        <>
          <h3 className={classes.contrastSubTitle}>APCA</h3>
          <div className={classes.contrastContainer}>
            <ContrastItem
              text='Lc75'
              subText='(18px / 400)'
              error={
                (getApcaContrastLc(selectedColor, contrastColor) as number) <=
                75
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

const Boxes = ({
  selectedColor,
  colorTheme,
}: {
  selectedColor: ColorInfo;
  colorTheme: ColorInfo[];
}) => {
  let contrastColors: ColorNumber[] = [];
  const selectedNumber = selectedColor.number;

  if (
    selectedNumber === 1 ||
    selectedNumber === 2 ||
    selectedNumber === 3 ||
    selectedNumber === 4 ||
    selectedNumber === 5
  ) {
    contrastColors = [6, 7, 8, 12, 13];
  } else if (
    selectedNumber === 6 ||
    selectedNumber === 7 ||
    selectedNumber === 8 ||
    selectedNumber === 9 ||
    selectedNumber === 10 ||
    selectedNumber === 11 ||
    selectedNumber === 12 ||
    selectedNumber === 13
  ) {
    contrastColors = [1, 2, 3, 4, 5];
  }
  return (
    <>
      {contrastColors.map((colorNumber) => (
        <ContrastBox
          key={colorNumber}
          colorNumber={selectedNumber}
          title={getColorNameFromNumber(colorNumber)}
          selectedColor={selectedColor.hex}
          contrastColor={colorTheme[colorNumber - 1].hex}
        />
      ))}
    </>
  );
};

export const ColorModal = ({
  colorModalRef,
  color,
  colorTheme,
}: ColorModalProps) => {
  return (
    <Modal.Root>
      <Modal.Dialog
        ref={colorModalRef}
        style={{
          maxWidth: '1050px',
        }}
        className={classes.modal}
        onInteractOutside={() => colorModalRef.current?.close()}
      >
        <Modal.Header>
          {capitalizeFirstLetter(color.type) + ' ' + color.color.name}
        </Modal.Header>
        <Modal.Content className={classes.modalContent}>
          <ColorDescription color={color.color} />
          <div className={classes.container}>
            <div className={classes.left}>
              <Field
                label='Hexkode:'
                value={color.color.hex}
                copyBtn
              />
              <Field
                label='HSLuv:'
                value={
                  hexToHsluv(color.color.hex)[0].toFixed(0) +
                  '° ' +
                  hexToHsluv(color.color.hex)[1].toFixed(0) +
                  '% ' +
                  hexToHsluv(color.color.hex)[2].toFixed(0) +
                  '%'
                }
              />
              <Field
                label='CSS variabel:'
                value={getCssVariable(color.type, color.color.number)}
                copyBtn
              />
              {/* <Field
              label='Illuminans terskel:'
              value='30-40%'
            />
            <div>
              Les mer om denne fargen <Link href='#'>her</Link>.
            </div> */}
              {!color.color.name.includes('Base') && (
                <Field
                  label='Brukes mot:'
                  value={getColorCombinations(color.color.number)}
                />
              )}
              <Field
                label=''
                value='Mer informasjon om fargen kommer.'
              />
            </div>
            <div
              className={classes.right}
              style={{ backgroundColor: color.color.hex }}
            ></div>
          </div>
          <Accordion.Root
            color='neutral'
            className={classes.accordion}
          >
            <Accordion.Item>
              <Accordion.Heading
                level={3}
                className={classes.accordionHeading}
              >
                Vis kontrastgrenser mot relevante farger
              </Accordion.Heading>
              <Accordion.Content className={classes.accordionContent}>
                <Boxes
                  selectedColor={color.color}
                  colorTheme={colorTheme}
                />
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </Modal.Content>
      </Modal.Dialog>
    </Modal.Root>
  );
};
