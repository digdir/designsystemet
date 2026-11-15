import {
  Button,
  Input,
  Search,
  ToggleGroup,
} from '@digdir/designsystemet-react';
import { LaptopIcon, MobileSmallIcon } from '@navikt/aksel-icons';
import { type RefObject, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExampleFigure } from '~/_components/example-figure/example-figure';
import classes from './size-examples.module.css';

type Measurement = { height: string; fontSize: string };

/**
 * Reads the rendered height and font size of an element.
 * The sizes are calculated in CSS from the theme, so the browser is the only place that knows them.
 */
const useMeasurement = (ref: RefObject<HTMLElement | null>) => {
  const [measurement, setMeasurement] = useState<Measurement>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () =>
      setMeasurement({
        height: `${Math.round(element.getBoundingClientRect().height)}px`,
        fontSize: `${Math.round(Number.parseFloat(getComputedStyle(element).fontSize))}px`,
      });
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return measurement;
};

/** A bracket next to a component, with its measured height */
const HeightMarker = ({ height }: { height?: string }) => (
  <div className={classes.heightMarker}>
    <span className={classes.bracket} aria-hidden />
    <span className={classes.measurement}>{height}</span>
  </div>
);

const sizes = { sm: 'Small', md: 'Medium', lg: 'Large' } as const;
type Size = keyof typeof sizes;

const ButtonSize = ({ size }: { size: Size }) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLButtonElement>(null);
  const measurement = useMeasurement(ref);

  return (
    <div className={classes.size}>
      <span>{sizes[size]}</span>
      <div className={classes.measured}>
        <Button ref={ref} data-size={size}>
          {t('size-examples.button')}
        </Button>
        <HeightMarker height={measurement?.height} />
      </div>
      <span className={classes.fontSize}>
        {measurement &&
          t('size-examples.font-size', { size: measurement.fontSize })}
      </span>
    </div>
  );
};

type SizeExampleProps = { caption?: string };

/** A button in each component size, with the height and font size it actually renders with */
export const ComponentSizes = ({ caption }: SizeExampleProps) => (
  <ExampleFigure caption={caption} className={classes.sizes}>
    {(Object.keys(sizes) as Size[]).map((size) => (
      <ButtonSize key={size} size={size} />
    ))}
  </ExampleFigure>
);

/** Medium components next to each other, to show that they share the same height */
export const ComponentSizeBalance = ({ caption }: SizeExampleProps) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLButtonElement>(null);
  const measurement = useMeasurement(ref);

  return (
    <ExampleFigure caption={caption} className={classes.balance}>
      <span className={classes.title}>{t('size-examples.medium-title')}</span>
      <div className={classes.components} data-size='md'>
        <Input
          className={classes.input}
          aria-label={t('size-examples.input')}
          defaultValue={t('size-examples.input')}
        />
        <ToggleGroup
          aria-label={t('size-examples.device')}
          defaultValue='desktop'
        >
          <ToggleGroup.Item
            value='desktop'
            aria-label={t('size-examples.desktop')}
          >
            <LaptopIcon aria-hidden />
          </ToggleGroup.Item>
          <ToggleGroup.Item
            value='mobile'
            aria-label={t('size-examples.mobile')}
          >
            <MobileSmallIcon aria-hidden />
          </ToggleGroup.Item>
        </ToggleGroup>
        <Search className={classes.search}>
          <Search.Input aria-label={t('size-examples.search')} />
          <Search.Clear />
        </Search>
        {/* The marker stays with the button when the row wraps */}
        <div className={classes.measured}>
          <Button ref={ref}>{t('size-examples.button')}</Button>
          <HeightMarker height={measurement?.height} />
        </div>
      </div>
    </ExampleFigure>
  );
};

/** A page where the search is Large and the header is Medium */
export const ComponentSizeMix = ({ caption }: SizeExampleProps) => {
  const { t } = useTranslation();

  return (
    <ExampleFigure caption={caption} className={classes.mix}>
      <div className={classes.page}>
        <div className={classes.pageHeader} data-size='md'>
          <span className={classes.placeholderAvatar} aria-hidden />
          <span className={classes.placeholderText} aria-hidden />
          <div className={classes.marked} data-mark='md'>
            <Button>{t('size-examples.new-user')}</Button>
            <Button variant='secondary'>{t('size-examples.log-in')}</Button>
          </div>
        </div>
        <div className={classes.pageMain} data-size='lg'>
          <span className={classes.placeholderText} aria-hidden />
          <div className={classes.marked} data-mark='lg'>
            <Search className={classes.search}>
              <Search.Input aria-label={t('size-examples.search')} />
              <Search.Clear />
              <Search.Button />
            </Search>
          </div>
        </div>
      </div>
      <ul className={classes.legend}>
        <li data-mark='md'>{sizes.md}</li>
        <li data-mark='lg'>{sizes.lg}</li>
      </ul>
    </ExampleFigure>
  );
};
