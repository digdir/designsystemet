import { Button, Heading, Paragraph } from '@digdir/designsystemet-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ContentContainer } from '../content-container/content-container';

export const Error404 = () => {
  const { t } = useTranslation();

  return (
    <ContentContainer>
      <Heading
        level={1}
        data-size='xl'
        style={{
          marginTop: 'var(--ds-size-12)',
        }}
      >
        {t('errors.404.title')}
      </Heading>
      <Paragraph>{t('errors.404.details')}</Paragraph>
      <Button
        asChild
        style={{
          width: 'fit-content',
        }}
      >
        <Link to='/'>{t('errors.generic.go-to-homepage')}</Link>
      </Button>
    </ContentContainer>
  );
};
