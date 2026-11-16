import { Divider, Field, Label, Select } from '@digdir/designsystemet-react';
import { ColorTokensTable } from '@internal/components';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { previewColorVars } from '~/_utils/theme-colors';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';

export const ColorVariables = () => {
  const { t } = useTranslation();
  const { colors, colorScheme } = useThemebuilder();
  const [previewName, setPreviewName] = useState('');
  const previewColor =
    colors.find((color) => color.name === previewName) || colors[0];

  return (
    <>
      <Field>
        <Label>{t('overview.select-color')}</Label>
        <Select
          value={previewColor?.name}
          onChange={(event) => setPreviewName(event.target.value)}
        >
          {colors.map((color) => (
            <Select.Option key={color.name} value={color.name}>
              {color.name}
            </Select.Option>
          ))}
        </Select>
      </Field>
      <Divider />

      <div style={previewColorVars(colors, previewColor, colorScheme)}>
        <ColorTokensTable withPreview />
      </div>
    </>
  );
};
