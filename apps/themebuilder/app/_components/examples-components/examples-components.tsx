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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '~/_hooks/use-color-scheme';
import { previewColorVars } from '~/model/theme-colors';
import { useThemeStore } from '~/model/theme-store';
import { REQUIRED_COLOR } from '~/model/theme-workspace';
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

export const ExamplesComponents = () => {
  const { t } = useTranslation();
  const [colorScheme] = useColorScheme();
  const { colors, borderRadius } = useThemeStore();

  /* The neutral color is always part of the examples, so it is not a color to choose */
  const previewColors = colors.filter((color) => color.name !== REQUIRED_COLOR);
  const [previewName, setPreviewName] = useState('');
  const previewColor =
    previewColors.find((color) => color.name === previewName) ||
    previewColors[0];

  const style: Record<string, string> = {
    ...previewColorVars(colors, previewColor, colorScheme),
    ...styleBorderRadiusVars,
    '--ds-border-radius-base': `${borderRadius / 16}rem`,
  };

  return (
    <>
      <Field>
        <Label>{t('overview.select-color')}</Label>
        <Select
          value={previewColor?.name}
          onChange={(event) => setPreviewName(event.target.value)}
        >
          {previewColors.map((color) => (
            <Select.Option key={color.name} value={color.name}>
              {color.name}
            </Select.Option>
          ))}
        </Select>
      </Field>

      <Divider />

      <div style={style}>
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
                      className={classes.avatar}
                      style={
                        {
                          '--dsc-avatar-radius': 'var(--ds-border-radius-md)',
                        } as React.CSSProperties
                      }
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
