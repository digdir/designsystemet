import { Heading, Textfield, ToggleGroup } from '@digdir/designsystemet-react';
import { useDebounceCallback } from '@internal/components';
import cl from 'clsx/lite';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeSearchParams } from '~/_hooks/use-theme-search-params';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
import classes from './border-radius-input.module.css';

export const BorderRadiusInput = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const [, setQuery] = useThemeSearchParams();
  const setBorderRadius = (value: number) => {
    setQuery(
      (prev) => {
        prev.set('border-radius', value.toString());
        return prev;
      },
      {
        replace: true,
        preventScrollReset: true,
      },
    );
  };
  const { baseBorderRadius } = useThemebuilder();

  const borderRadiusItems = [
    { name: t('borderRadius.none'), value: 0 },
    { name: t('borderRadius.small'), value: 4 },
    { name: t('borderRadius.medium'), value: 8 },
    { name: t('borderRadius.large'), value: 12 },
    { name: t('borderRadius.full'), value: 9999 },
  ];

  const debouncedCallback = useDebounceCallback((value: string) => {
    const updatedValue = parseInt(value, 10);
    if (updatedValue >= 0) {
      setBorderRadius(updatedValue);
    } else {
      setBorderRadius(0);
    }
  }, 1000);

  return (
    <div>
      <Heading className={classes.heading} data-size='xs'>
        {t('borderRadius.suggested')}
      </Heading>
      <ToggleGroup
        className={classes.items}
        aria-label={t('borderRadius.label')}
        value={baseBorderRadius.toString()}
        onChange={(value) => {
          setBorderRadius(Number(value));
          if (inputRef.current) inputRef.current.value = value;
        }}
      >
        {borderRadiusItems.map((item, index) => (
          <ToggleGroup.Item
            value={item.value.toString()}
            className={cl(
              classes.item,
              classes.box,
              baseBorderRadius === item.value && classes.active,
            )}
            key={index}
          >
            <span className={classes.text}>{item.name}</span>
            <span
              className={classes.inner}
              aria-hidden='true'
              style={{ borderRadius: item.value }}
            />
          </ToggleGroup.Item>
        ))}
      </ToggleGroup>
      <Heading className={classes.heading} data-size='xs'>
        {t('borderRadius.manual')}
      </Heading>
      <Textfield
        label={t('borderRadius.define-value')}
        defaultValue={baseBorderRadius}
        onChange={(e) => {
          debouncedCallback(e.target.value);
        }}
        type='number'
        ref={inputRef}
      ></Textfield>
    </div>
  );
};
