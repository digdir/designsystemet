import { ToggleGroup, ToggleGroupItem } from '@digdir/designsystemet-react';
import type {
  BorderRadiusPreview,
  FontFamilyPreview,
  PreviewData,
  SemanticColorScale,
} from '../plugin/token-export/types';
import { previewVariantKey } from '../plugin/token-export/utils';

type PreviewViewProps = {
  preview: PreviewData;
  selectedTheme: string | null;
  selectedScheme: string | null;
  onSelectTheme: (theme: string) => void;
  onSelectScheme: (scheme: string) => void;
};

// Renders the theme preview (theme/scheme controls + color scales + border radii). All
// values are resolved ahead of time on the plugin side, keyed per theme/scheme variant —
// this component only looks them up. Warnings and status live in the header banner, not here.
export function PreviewView({
  preview,
  selectedTheme,
  selectedScheme,
  onSelectTheme,
  onSelectScheme,
}: PreviewViewProps): React.JSX.Element {
  const variantKey = previewVariantKey(
    pickOption(preview.themeOptions, selectedTheme),
    pickOption(preview.colorSchemeOptions, selectedScheme),
  );

  const showThemes = preview.themeOptions.length > 1;
  const showSchemes = preview.colorSchemeOptions.length > 1;

  // The preview surface follows the selected scheme (not the user's Figma theme) so light
  // colors are read on a light surface and dark colors on a dark one. Keying the surface on
  // the scheme remounts it on scheme change, replaying the reveal animation — but not on
  // theme change.
  const surface = /dark/i.test(selectedScheme || '') ? 'dark' : 'light';

  return (
    <>
      {(showThemes || showSchemes) && (
        <div className='tx-hero'>
          <div className='tx-control-row'>
            {showThemes && (
              <div>
                <div className='tx-control-label'>Theme</div>
                <ToggleGroup
                  aria-label='Toggle between themes'
                  value={selectedTheme ?? undefined}
                  onChange={onSelectTheme}
                >
                  {preview.themeOptions.map((theme) => (
                    <ToggleGroupItem key={theme} value={theme}>
                      {theme}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            )}
            {showSchemes && (
              <div>
                <div className='tx-control-label'>Color scheme</div>
                <ToggleGroup
                  aria-label='Toggle between color schemes'
                  value={selectedScheme ?? undefined}
                  onChange={onSelectScheme}
                >
                  {preview.colorSchemeOptions.map((scheme) => (
                    <ToggleGroupItem key={scheme} value={scheme}>
                      {scheme}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            )}
          </div>
        </div>
      )}

      <div
        key={selectedScheme ?? 'none'}
        className={`tx-surface tx-surface--${surface}`}
      >
        <div className='tx-preview-layout'>
          <ColorScales
            scales={preview.semanticColorScales}
            variantKey={variantKey}
          />
          <BorderRadii radii={preview.borderRadii} variantKey={variantKey} />
          <FontFamilies fonts={preview.fontFamilies} variantKey={variantKey} />
        </div>
      </div>
    </>
  );
}

// The prepared values only have entries for known option names; fall back to the
// first option when the selection is missing or stale.
function pickOption(options: string[], selected: string | null): string | null {
  if (selected && options.includes(selected)) {
    return selected;
  }
  return options[0] ?? null;
}

function ColorScales({
  scales,
  variantKey,
}: {
  scales: SemanticColorScale[];
  variantKey: string;
}): React.JSX.Element {
  if (scales.length === 0) {
    return <div className='tx-empty'>No semantic color scales found.</div>;
  }

  return (
    <div className='tx-color-grid'>
      {scales.map((scale) => (
        <div className='tx-color-row' key={scale.name}>
          <span className='tx-color-row-label' title={scale.name}>
            {scale.name}
          </span>
          <div className='tx-swatches'>
            {scale.roles.map((role) => {
              const color = role.color[variantKey] ?? null;
              return (
                <div
                  key={role.name}
                  className={`tx-swatch ${color ? 'has-color' : ''}`}
                  title={role.name}
                  style={
                    color
                      ? ({ '--swatch': color } as React.CSSProperties)
                      : undefined
                  }
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function BorderRadii({
  radii,
  variantKey,
}: {
  radii: BorderRadiusPreview[];
  variantKey: string;
}): React.JSX.Element | null {
  if (radii.length === 0) {
    return null;
  }

  return (
    <div className='tx-color-row'>
      <span className='tx-color-row-label tx-subtle'>Border radius</span>
      <div className='tx-radius-row'>
        {radii.map((radius) => {
          const value = radius.values[variantKey];
          const cssValue = value?.px ?? 0;
          const label = value?.label ?? '';
          return (
            <div
              className='tx-radius-item'
              key={radius.name}
              title={`${radius.name}: ${label}`}
            >
              <span className='tx-radius-label'>{radius.name}</span>
              <div
                className='tx-radius-sample'
                style={{ '--radius': `${cssValue}px` } as React.CSSProperties}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FontFamilies({
  fonts,
  variantKey,
}: {
  fonts: FontFamilyPreview[];
  variantKey: string;
}): React.JSX.Element | null {
  if (fonts.length === 0) {
    return null;
  }

  return (
    <div className='tx-color-row'>
      <span className='tx-color-row-label tx-subtle'>Font family</span>
      <div className='tx-font-row'>
        {fonts.map((font) => {
          const value = font.values[variantKey];
          const family = value?.family ?? null;
          const label = value?.label ?? '';
          return (
            <div
              className='tx-font-item'
              key={font.name}
              title={`${font.name}: ${label}`}
              style={
                family ? { fontFamily: `'${family}', sans-serif` } : undefined
              }
            >
              <span className='tx-font-sample' aria-hidden='true'>
                Aa
              </span>
              <span className='tx-font-name'>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
