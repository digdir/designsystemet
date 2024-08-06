'use client';

import { useEffect, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

import { Alias } from '../components/Alias/Alias';
import { PullRequestCard } from '../components/PullRequestCard/PullRequestCard';
import { SkeletonCard } from '../components/SkeletonCard/SkeletonCard';
import { getActivePullRequests } from '../services/GithubService';
import { getAliases } from '../services/VercelService';
import type { AliasType } from '../types/Aliases';
import type { PullRequestType } from '../types/PullRequest';

import classes from './page.module.css';

type CombinedItemType = {
  title: string;
  PRNumber: number;
  PRLink: string;
  user: string;
  userAvatar: string;
  storefront: AliasType[];
  storybook: AliasType[];
};

/**
 * Combines pullRequests and aliases to create the output itemm
 */
const combineItemsList = (
  pullRequests: PullRequestType[],
  aliases: AliasType[],
) => {
  const items = [];

  for (let i = 0; i < pullRequests.length; i++) {
    const pullRequest = pullRequests[i];
    const item: CombinedItemType = {
      title: pullRequest.title,
      PRNumber: pullRequest.number,
      PRLink: pullRequest.html_url,
      user: pullRequest.user ? pullRequest.user.login : '',
      userAvatar: pullRequest.user ? pullRequest.user.avatar_url : '',
      storefront: aliases.filter((alias: AliasType) => {
        return (
          alias.alias.includes(pullRequest.number.toString()) &&
          alias.alias.includes('storefront')
        );
      }),
      storybook: aliases.filter((alias: AliasType) => {
        return (
          alias.alias.includes(pullRequest.number.toString()) &&
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
  const aliases: AliasType[] = await getAliases();
  const pullRequests: PullRequestType[] = await getActivePullRequests();
  return combineItemsList(pullRequests, aliases);
};

export default function Home() {
  const [items, setItems] = useState<CombinedItemType[]>([]);
  const [key, setKey] = useState(0);

  useEffect(() => {
    void setItemsAsync();
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
              void setItemsAsync();
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
        {items.length === 0 && (
          <>
            {[1, 2, 3, 4, 5].map((item: number, index: number) => (
              <SkeletonCard key={index} />
            ))}
          </>
        )}
        {items.length > 0 && (
          <div>
            {items.map((item: CombinedItemType, index: number) => (
              <PullRequestCard
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
              </PullRequestCard>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
