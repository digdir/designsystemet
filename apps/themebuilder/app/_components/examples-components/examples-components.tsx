import type { ColorScheme, CssColor } from '@digdir/designsystemet';
import {
  Avatar,
  Button,
  Divider,
  Field,
  Heading,
  Label,
  Link,
  Paragraph,
  Select,
  Tag,
  Textfield,
} from '@digdir/designsystemet-react';
import { styleBorderRadiusVars } from '@internal/components';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { styleColorVars } from '~/_utils/generate-color-vars';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
import classes from './examples-components.module.css';
import { SettingsCard } from './settings-card/settings-card';
import { TableCard } from './table-card/table-card';

const users = [
  {
    name: 'Ola Normann',
    role: 'Designer',
    avatar: '/img/avatars/male2.png',
  },
  {
    name: 'Kari Slotsveen',
    role: 'Frontend',
    avatar: '/img/avatars/female2.png',
  },
  {
    name: 'Marcus Viken',
    role: 'Backend',
    avatar: '/img/avatars/male3.png',
  },
];

type ExamplesComponentsProps = {
  colorScheme?: ColorScheme;
  color?: CssColor;
  borderRadius?: number;
};

export const ExamplesComponents = ({
  colorScheme = 'light',
  color = '#0062BA',
  borderRadius = 4,
}: ExamplesComponentsProps) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const { colors } = useThemebuilder();

  const neutralColor = colors?.neutral[0].hex || '#F5F7FA';
  const [previewColor, setPreviewColor] = useState(
    colors?.main[0].hex || color,
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.style.setProperty(
        '--ds-border-radius-base',
        `${borderRadius / 16}rem`,
      );
    }
  }, [borderRadius]);

  useEffect(() => {
    setPreviewColor(color);
  }, [color]);

  useEffect(() => {
    if (!colors) return;
    const allColors = [...colors.main, ...colors.support];
    /* if select colors is gone, set to default */
    if (!allColors.find((c) => c.hex === previewColor)) {
      setPreviewColor(color);
    }
  }, [colors]);

  const style = {
    ...styleColorVars(neutralColor as CssColor, colorScheme, 'neutral'),
    ...styleColorVars(previewColor as CssColor, colorScheme),
    ...styleBorderRadiusVars,
  };

  return (
    <>
      {colors ? (
        <>
          <Field>
            <Label>{t('overview.select-color')}</Label>
            <Select
              value={previewColor}
              onChange={(v) => {
                if (!colors) return;
                const allColors = [...colors.main, ...colors.support];
                /* find the selected color */
                let selected = allColors.find(
                  (c) => c.hex === v.target.value,
                )?.hex;
                if (!selected) {
                  selected = colors.main[0].hex;
                }
                setPreviewColor(selected as CssColor);
              }}
            >
              {colors.main.map((color) => (
                <Select.Option key={color.name} value={color.hex}>
                  {color.name}
                </Select.Option>
              ))}
              {colors.support.map((color) => (
                <Select.Option key={color.name} value={color.hex}>
                  {color.name}
                </Select.Option>
              ))}
            </Select>
          </Field>

          <Divider />
        </>
      ) : null}

      <div ref={ref} style={style}>
        <div className={classes.inner}>
          <div className={classes.card}>
            <Heading data-size='2xs'>{t('overview.login-title')}</Heading>
            <Textfield
              placeholder='Ola Normann'
              label={t('overview.name')}
              data-size='sm'
            />
            <Textfield
              placeholder='********'
              label={t('overview.password')}
              data-size='sm'
            />
            <Link href='#' data-size='sm'>
              {t('overview.forgot-password')}
            </Link>

            <Button data-size='sm' className={classes.btn}>
              {t('overview.login')}
            </Button>
          </div>
          <div
            className={classes.card}
            style={{
              flexGrow: 1,
            }}
          >
            <TableCard />
          </div>
          <div className={classes.card} data-size='sm'>
            <SettingsCard />
          </div>
          <div className={classes.card}>
            <img className={classes.img} src='/img/city.jpg' alt='' />
            <div className={classes.imgText}>
              <div className={classes.tags} data-size='sm'>
                <Tag data-color='brand1'>{t('overview.sports')}</Tag>
                <Tag data-color='brand2'>{t('overview.news')}</Tag>
              </div>
              <Heading data-size='2xs' className={classes.imgTitle}>
                {t('overview.news-title')}
              </Heading>
              <Paragraph data-size='sm' className={classes.imgDesc}>
                {t('overview.news-description')}
              </Paragraph>
            </div>
          </div>
          <div className={classes.card} style={{ flexGrow: 1 }}>
            <Heading data-size='xs' level={3}>
              {t('overview.people-you-may-know')}
            </Heading>
            <div className={classes.users}>
              {users.map((user) => {
                return (
                  <div className={classes.user} key={user.role}>
                    <Avatar
                      aria-label={user.name}
                      variant='square'
                      className={classes.avatar}
                    >
                      <img src={user.avatar} alt='' />
                    </Avatar>
                    <div>
                      <div className={classes.userRole}>{user.role}</div>
                      <div>{user.name}</div>
                    </div>
                    <Button
                      data-size='sm'
                      variant='secondary'
                      style={{ marginLeft: 'auto' }}
                      aria-label={`${t('overview.follow')} ${user.name}`}
                    >
                      {t('overview.follow')}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
