import type { CssColor } from '@digdir/designsystemet';
import { Divider, Field, Label, Select } from '@digdir/designsystemet-react';
import { ColorTokensTable } from '@internal/components';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { styleColorVars } from '~/_utils/generate-color-vars';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';

export const OverviewVariables = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const { colors, colorScheme } = useThemebuilder();

  const neutralColor = colors?.neutral[0]?.hex || '';
  const [previewColor, setPreviewColor] = useState(colors?.main[0] || '');

  const style = {
    ...styleColorVars(neutralColor as CssColor, colorScheme, 'neutral'),
    ...styleColorVars(previewColor.hex as CssColor, colorScheme),
  };

  return (
    <>
      {colors ? (
        <>
          <Field>
            <Label>{t('overview.select-color')}</Label>
            <Select
              value={previewColor.hex}
              onChange={(v) => {
                if (!colors) return;
                const allColors = [...colors.main, ...colors.support];
                /* find the selected color */
                let selectedColor = allColors.find(
                  (c) => c.hex === v.target.value,
                );
                if (!selectedColor) {
                  selectedColor = colors.main[0];
                }
                setPreviewColor(selectedColor);
              }}
            >
              {colors.main.map((color) => (
                <Select.Option key={color.name} value={color.hex}>
                  {color.name}
                </Select.Option>
              ))}
              {colors.support.map((color) => (
                <Select.Option key={color.name} value={color.hex}>
                  {color.name}
                </Select.Option>
              ))}
            </Select>
          </Field>

          <Divider />
        </>
      ) : null}

      <div ref={ref} style={style}>
        <ColorTokensTable withPreview />
      </div>
    </>
  );
};
