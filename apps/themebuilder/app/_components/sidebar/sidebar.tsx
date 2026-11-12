import { Button, Dialog, Heading } from '@digdir/designsystemet-react';
import { useTranslation } from 'react-i18next';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
import { BorderRadiusInput } from '../border-radius-input/border-radius-input';
import { ConfigPaste } from '../config-paste/config-paste';
import { TokenModal } from '../token-modal/token-modal';
import { ColorPage } from './color-page/color-page';

export const Sidebar = () => {
  const { t } = useTranslation();
  const { workspace } = useThemebuilder();

  return (
    <div>
      <ColorPage key={workspace?.activeTheme} />
      <BorderRadiusInput key={workspace?.activeTheme} />
    </div>
  );
};
