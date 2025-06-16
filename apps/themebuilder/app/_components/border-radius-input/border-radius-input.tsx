import { Button, Heading, Textfield } from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { useTranslation } from 'react-i18next';
import { useThemebuilder } from '~/routes/themebuilder/_utils/useThemebuilder';
import { useThemeStore } from '~/store';
import classes from './border-radius-input.module.css';

export const BorderRadiusInput = () => {
  const { t } = useTranslation();
  const setBorderRadius = useThemeStore((state) => state.setBaseBorderRadius);
  const { baseBorderRadius } = useThemebuilder();

  const borderRadiusItems = [
    { name: t('borderRadius.none'), value: 0 },
    { name: t('borderRadius.small'), value: 4 },
    { name: t('borderRadius.medium'), value: 8 },
    { name: t('borderRadius.large'), value: 12 },
    { name: t('borderRadius.full'), value: 9999 },
  ];

  return (
    <div>
      <Heading className={classes.heading} data-size='xs'>
        {t('borderRadius.suggested')}
      </Heading>
      <div
        className={classes.items}
        role='radiogroup'
        aria-label='Border radius'
      >
        {borderRadiusItems.map((item, index) => (
          <div
            className={cl(
              classes.item,
              baseBorderRadius === item.value && classes.active,
            )}
            key={index}
          >
            <Button
              variant='tertiary'
              data-color='neutral'
              className={cl(classes.box)}
              onClick={() => {
                setBorderRadius(item.value);
              }}
              // biome-ignore lint/a11y/useSemanticElements: <explanation>
              role='radio'
              aria-checked={baseBorderRadius === item.value}
              aria-current={baseBorderRadius === item.value}
            >
              <div className={classes.text}>{item.name}</div>
              <div
                className={classes.inner}
                style={{ borderRadius: item.value }}
              />
            </Button>
          </div>
        ))}
      </div>
      <Heading className={classes.heading} data-size='xs'>
        {t('borderRadius.manual')}
      </Heading>
      <Textfield
        label={t('borderRadius.define-value')}
        value={baseBorderRadius}
        onChange={(e) => {
          const updatedValue = parseInt(e.target.value);
          if (updatedValue >= 0) {
            setBorderRadius(updatedValue);
          } else {
            setBorderRadius(0);
          }
        }}
      ></Textfield>
    </div>
  );
};
