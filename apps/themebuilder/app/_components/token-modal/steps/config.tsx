import { Paragraph } from '@digdir/designsystemet-react';
import { CodeBlock } from '@internal/components';
import { useTranslation } from 'react-i18next';
import classes from '../token-modal.module.css';

export default function Config({
  configSnippet,
  buildSnippet,
}: {
  configSnippet: string;
  buildSnippet: string;
}) {
  const { t } = useTranslation();

  return (
    <>
      <div className={classes.step}>
        <span>1</span>
        <Paragraph>{t('themeModal.config.step-one')}</Paragraph>
      </div>
      <div className={classes.snippet}>
        <CodeBlock language='json'>{configSnippet}</CodeBlock>
      </div>
      <div
        className={classes.step}
        style={{
          marginTop: 'var(--ds-size-4)',
        }}
      >
        <span>2</span>
        <Paragraph>{t('themeModal.config.step-two')}</Paragraph>
      </div>
      <div className={classes.snippet}>
        <CodeBlock language='bash'>{buildSnippet}</CodeBlock>
      </div>
    </>
  );
}
