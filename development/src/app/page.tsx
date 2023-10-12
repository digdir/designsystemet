'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/Card/Card';
import { Alias } from '@/components/Alias/Alias';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { getActivePullRequests } from '@/services/GithubService';
import { getAliases } from '@/services/VercelService';
import classes from './page.module.css';

/**
 * Combines pullRequests and aliases to create the output item
 */
const generateItemsList = (pullRequests: any, aliases: any) => {
  let items = [];

  for (let i = 0; i < pullRequests.length; i++) {
    const pullRequest = pullRequests[i];
    let item = {
      title: pullRequest.title,
      PRNumber: pullRequest.number,
      PRLink: pullRequest.html_url,
      user: pullRequest.user ? pullRequest.user.login : '',
      userAvatar: pullRequest.user ? pullRequest.user.avatar_url : '',
      storefront: aliases.filter((alias: any, index: number) => {
        return (
          alias.alias.includes(pullRequest.number) &&
          alias.alias.includes('storefront')
        );
      }),
      storybook: aliases.filter((alias: any, index: number) => {
        return (
          alias.alias.includes(pullRequest.number) &&
          alias.alias.includes('storybook')
        );
      }),
    };
    items.push(item);
  }
  return items;
};

/**
 * Returns the items that are going to be rendered in view
 */
const getItems = async () => {
  const aliases = await getAliases();
  const pullRequests = await getActivePullRequests();
  console.log(aliases);
  console.log(pullRequests);
  return generateItemsList(pullRequests, aliases);
};

export default function Home() {
  const [items, setItems] = useState<any>([]);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setItemsAsync();
  }, []);

  /**
   * Set the items from the async getItems function
   */
  const setItemsAsync = async () => {
    setItems(await getItems());
  };

  return (
    <main className={classes.main}>
      <div className={classes.header}>
        <h1 className={classes.mainTitle}>
          <img
            className={classes.logo}
            src='/img/storefront-logo-white.png'
            alt=''
          />
          Designsystemet DEV
        </h1>
        <div className={classes.timer}>
          <CountdownCircleTimer
            key={key}
            isPlaying
            duration={30}
            colors={'#a0a0a0'}
            trailColor='#2c2c2c'
            size={32}
            strokeWidth={2}
            onComplete={() => {
              setItemsAsync();
              // This is a technique to reset the timer when it completes
              setKey((prevKey) => prevKey + 1);
            }}
          ></CountdownCircleTimer>
        </div>
      </div>
      <div>
        <h2 className={classes.subTitle}>
          Active pull requests and deployments
        </h2>
        <div>
          {items.map((item: any, index: number) => (
            <Card
              title={item.title}
              key={index}
              user={item.user}
              userAvatar={item.userAvatar}
              PRNumber={item.PRNumber}
              PRLink={item.PRLink}
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
                  date={item.storefront[0].updatedAt}
                  alias={item.storefront[0].alias}
                />
              )}
              {!item.storefront.length && !item.storybook.length && (
                <div className={classes.empty}>No deployments found.</div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
