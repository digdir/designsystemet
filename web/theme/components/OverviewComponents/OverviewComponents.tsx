import {
  Avatar,
  Button,
  Heading,
  Link,
  Paragraph,
  Tag,
  Textfield,
} from '@digdir/designsystemet-react';
import { forwardRef } from 'react';
import classes from './OverviewComponents.module.css';
import { SettingsCard } from './SettingsCard/SettingsCard';
import { TableCard } from './TableCard/TableCard';

const users = [
  {
    name: 'Ola Normann',
    role: 'Designer',
    avatar: 'img/avatars/male2.png',
  },
  {
    name: 'Kari Slotsveen',
    role: 'Frontend',
    avatar: 'img/avatars/female2.png',
  },
  {
    name: 'Marcus Viken',
    role: 'Backend',
    avatar: 'img/avatars/male3.png',
  },
];

export const OverviewComponents = forwardRef<HTMLDivElement>(
  function OverviewComponents(_, ref) {
    return (
      <div className={classes.container} ref={ref}>
        <div className={classes.inner}>
          <div className={classes.card}>
            <Heading data-size='2xs'>Logg inn i portalen</Heading>
            <Textfield placeholder='Ola Normann' label='Navn' data-size='sm' />
            <Textfield placeholder='********' label='Passord' data-size='sm' />
            <Link href='#' data-size='sm'>
              Glemt passord?
            </Link>

            <Button data-size='sm' className={classes.btn}>
              Logg inn
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
            <img className={classes.img} src='img/city.png' alt='' />
            <div className={classes.imgText}>
              <div className={classes.tags} data-size='sm'>
                <Tag data-color='brand1'>Sport</Tag>
                <Tag data-color='brand2'>Nyheter</Tag>
                <Tag data-color='brand3'>Innenriks</Tag>
              </div>
              <Heading data-size='2xs' className={classes.imgTitle}>
                Reiste alene til storbyen
              </Heading>
              <Paragraph data-size='sm' className={classes.imgDesc}>
                Mona kvist ville finne drømmen i New York City
              </Paragraph>
            </div>
          </div>
          <div className={classes.card} style={{ flexGrow: 1 }}>
            <Heading data-size='xs' level={3}>
              Folk du kanskje kjenner
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
                    <div className={classes.userText}>
                      <div className={classes.userRole}>{user.role}</div>
                      <div>{user.name}</div>
                    </div>
                    <Button
                      data-size='sm'
                      variant='secondary'
                      style={{ marginLeft: 'auto' }}
                      aria-label={`Følg ${user.name}`}
                    >
                      Følg
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  },
);
