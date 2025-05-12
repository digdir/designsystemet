import { Card, Heading, Paragraph } from '@digdir/designsystemet-react';
import { VideoplayerIcon } from '@navikt/aksel-icons';
import { useTranslation } from 'react-i18next';
import { RRLink } from '../link';
import classes from './video-card.module.css';

export type VideoCardProps = {
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  /**
   * @default 2
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
};

export const VideoCard = ({
  title = 'The default title',
  description = 'The default description',
  imageUrl = '/img/city.jpg',
  videoUrl = 'vimeo.com',
  headingLevel = 2,
}: VideoCardProps) => {
  const { t } = useTranslation();

  return (
    <Card className={classes['video-card']}>
      <Card.Block
        className={classes.image}
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      />
      <Card.Block>
        <Heading level={headingLevel}>{title}</Heading>
        <Paragraph>{description}</Paragraph>
        <RRLink to={videoUrl}>
          <VideoplayerIcon />
          {t('video.watch-video')}
        </RRLink>
      </Card.Block>
    </Card>
  );
};
