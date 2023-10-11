'use client';
import { Card } from '@/components/Card/Card';
import styles from './page.module.css';
import { useState, useEffect } from 'react';
import { Alias } from '@/components/Alias/Alias';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const getAlisases = async () => {
  const res = await fetch('/api/alias/list');
  const data = await res.json();
  return data;
};

const getPulls = async () => {
  const res = await fetch(
    'https://api.github.com/repos/digdir/designsystem/pulls',
  );
  const data = await res.json();
  return data;
};

export default function Home() {
  const [items, setItems] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const aliasesObj = await getAlisases();
      const aliases = aliasesObj.data.aliases.filter((item: any) =>
        item.alias.includes('pr'),
      );
      const pulls = await getPulls();

      let arr = [];

      for (let i = 0; i < pulls.length; i++) {
        let item = {
          title: pulls[i].title,
          user: pulls[i].user ? pulls[i].user.login : '',
          userAvatar: pulls[i].user ? pulls[i].user.avatar_url : '',
          storefront: aliases.filter((alias: any, index: number) => {
            return (
              alias.alias.includes(pulls[i].number) &&
              alias.alias.includes('storefront')
            );
          }),
          storybook: aliases.filter((alias: any, index: number) => {
            return (
              alias.alias.includes(pulls[i].number) &&
              alias.alias.includes('storybook')
            );
          }),
        };
        arr.push(item);
      }
      console.log(arr);
      console.log(pulls);
      setItems(arr);
    };
    fetchData();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>
          <img
            className={styles.logo}
            src='/img/storefront-logo-white.png'
            alt=''
          />{' '}
          Designsystemet DEV
        </h1>
        <div className={styles.timer}>
          <CountdownCircleTimer
            isPlaying
            duration={45}
            colors={'#a0a0a0'}
            trailColor='#2c2c2c'
            size={32}
            strokeWidth={2}
          ></CountdownCircleTimer>
        </div>
      </div>
      <div>
        <h2 className={styles.subTitle}>
          Active pull request with deployments
        </h2>
        <div>
          {items.map((item: any, index: number) => (
            <Card
              title={item.title}
              key='index'
              user={item.user}
              userAvatar={item.userAvatar}
            >
              {!!item.storybook.length && (
                <Alias
                  type='storybook'
                  date={item.storybook[0].updatedAt}
                  alias={item.storybook[0].alias}
                />
              )}
              {!!item.storefront.length && (
                <Alias
                  type='storefront'
                  date={item.storybook[0].updatedAt}
                  alias={item.storybook[0].alias}
                />
              )}
              {!item.storefront.length && !item.storybook.length && (
                <div className={styles.empty}>No deployments found.</div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
