import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import moment from 'moment';

import classes from './GithubReleasesChangelog.module.css';

interface GithubReleasesChangelogItemProps {
  name: string;
  body: string;
  published_at: string;
}

const GithubReleasesChangelog = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://api.github.com/repos/altinn/figma-design-tokens/releases')
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setData(res);
      });
  }, []);

  return (
    <div className={classes['github-releases-changelog']}>
      <hr />
      {data.map((item: GithubReleasesChangelogItemProps, index: number) => (
        <div key={index}>
          <h2 className='sbdocs sbdocs-h2'>{item.name}</h2>
          <p className={classes.date}>
            Published: {moment(item.published_at).format('LL')}
          </p>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.body}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export { GithubReleasesChangelog };
