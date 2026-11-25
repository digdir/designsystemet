import { Card, Paragraph } from '@digdir/designsystemet-react';
import { useTranslation } from 'react-i18next';

export const IconsWithText = () => {
  const { t } = useTranslation();
  return (
    <Card data-color='brand3' variant='tinted'>
      <Paragraph>
        <strong>{t('icons-with-text.title')}</strong>
      </Paragraph>
      <Paragraph>{t('icons-with-text.description')}</Paragraph>
    </Card>
  );
};
