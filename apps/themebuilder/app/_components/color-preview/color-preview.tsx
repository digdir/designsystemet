import {
  Button,
  Checkbox,
  Heading,
  Paragraph,
  Switch,
  ToggleGroup,
} from '@digdir/designsystemet-react';
import cl from 'clsx/lite';
import { type HTMLAttributes, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
import listClasses from './card.module.css';
import classes from './color-preview.module.css';

type ViewType = 'list' | 'grid';

const DEFAULT_VIEW: ViewType = 'grid';

const CardWrapper = ({ color, view, ...rest }: CardProps) =>
  view === 'list' ? (
    <VerticalCard color={color} {...rest} />
  ) : (
    <HorizontalCard color={color} {...rest} />
  );

export const ColorPreview = () => {
  const { t } = useTranslation();
  const { colorScheme, colors, severityColors, severityEnabled } =
    useThemebuilder();
  const [view, setView] = useState<ViewType>(DEFAULT_VIEW);

  const allColors = [
    ...colors.main,
    ...colors.neutral,
    ...colors.support,
    ...(severityEnabled ? severityColors : []),
  ];

  const prepVariables = (variables: Record<string, string>) => {
    const prepped: Record<string, string> = {};
    Object.entries(variables).forEach(([key, value]) => {
      prepped[key.replace('neutral-', '')] = value;
    });
    return prepped;
  };

  return (
    <div className='panelContainer'>
      <div className='panelLeft'>
        <div className='panelTop'>
          <Heading data-size='xs'>{t('colorPreview.title')}</Heading>
          <Paragraph data-size='sm'>{t('colorPreview.description')}</Paragraph>
          <Paragraph data-size='sm'>{t('colorPreview.note')}</Paragraph>
        </div>
        <div className='panelBottom'>
          <div className={classes.label}>{t('colorPreview.view')}</div>
          <ToggleGroup
            data-toggle-group='Visning'
            data-size='sm'
            defaultValue={DEFAULT_VIEW}
            onChange={(value: string) => setView(value as ViewType)}
          >
            <ToggleGroup.Item value='grid'>Grid</ToggleGroup.Item>
            <ToggleGroup.Item value='list'>
              {t('tabs.examples')}
            </ToggleGroup.Item>
          </ToggleGroup>
        </div>
      </div>
      <div
        className={cl(
          'panelRight',
          view === 'grid' ? classes.grid : classes.list,
        )}
      >
        {allColors.map((color, index) => {
          const variables =
            color.variables?.[colorScheme as keyof typeof color.variables];
          return (
            <CardWrapper
              view={view}
              key={`${color.name}-${index}`}
              color={color}
              style={variables ? prepVariables(variables) : {}}
            />
          );
        })}
      </div>
    </div>
  );
};

type CardProps = {
  color: ReturnType<typeof useThemebuilder>['colors']['main'][number];
  view?: ViewType;
} & Omit<HTMLAttributes<HTMLDivElement>, 'color'>;

const HorizontalCard = ({ color, ...rest }: CardProps) => {
  const { t } = useTranslation();

  return (
    <div className={classes.card} {...rest}>
      <Heading className={classes.title} data-size='2xs'>
        {color.name}
      </Heading>
      <Paragraph data-size='sm' className={classes.desc}>
        {t('colorPreview.example-heading')}
      </Paragraph>
      <div className={classes.checkGroup}>
        <Checkbox
          data-size='sm'
          label={`${t('colorPreview.checkbox')} 1`}
          value='one'
          defaultChecked
        />
        <Checkbox
          data-size='sm'
          label={`${t('colorPreview.checkbox')} 2`}
          value='two'
        />
      </div>
      <div className={classes.btnGroup}>
        <Button data-size='sm'>{t('colorPreview.primary')}</Button>
        <Button data-size='sm' variant='secondary'>
          {t('colorPreview.secondary')}
        </Button>
      </div>
    </div>
  );
};
const VerticalCard = ({ color, ...rest }: CardProps) => {
  const { t } = useTranslation();

  return (
    <div className={cl(classes.card, listClasses.card)} {...rest}>
      <div className={listClasses.text}>
        <Heading className={listClasses.title} data-size='2xs'>
          {color.name}
        </Heading>
        <Paragraph className={classes.desc} data-size='sm'>
          {t('colorPreview.example-heading')}
        </Paragraph>
      </div>
      <div className={listClasses.checkGroup}>
        <Checkbox
          data-size='sm'
          label={t('colorPreview.checkbox')}
          value='value'
        />
        <Switch
          position='start'
          data-size='sm'
          label={t('colorPreview.switch')}
        />
      </div>
      <div className={classes.btnGroup}>
        <Button data-size='sm'>{t('colorPreview.primary')}</Button>
        <Button data-size='sm' variant='secondary'>
          {t('colorPreview.secondary')}
        </Button>
      </div>
    </div>
  );
};
