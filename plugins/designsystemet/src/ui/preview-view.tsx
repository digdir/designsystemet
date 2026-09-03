import {
  type ColorScheme,
  getThemeColorScales,
  semanticColorNames,
} from '@digdir/designsystemet/color';
import type { CreateConfigSchema } from '@digdir/designsystemet/schemas/internal/schema.js';
import { ToggleGroup, ToggleGroupItem } from '@digdir/designsystemet-react';
import { useMemo } from 'react';
import { resolveBorderRadiusSteps } from './border-radius';

type PreviewViewProps = {
  config: CreateConfigSchema;
  selectedTheme: string | null;
  selectedScheme: string;
  onSelectTheme: (theme: string) => void;
  onSelectScheme: (scheme: string) => void;
};

type ThemeConfig = CreateConfigSchema['themes'][string];

// Pascal case to match the Figma variable modes ('Light'/'Dark').
const COLOR_SCHEME_OPTIONS = ['Light', 'Dark'];

// Renders the theme preview (theme/scheme controls + color scales + border radii + fonts)
// straight from the validated config, using the same CLI helpers the token generator
// uses, so the preview shows what the tokens end up with. Warnings and status live in
// the header banner, not here.
export function PreviewView({
  config,
  selectedTheme,
  selectedScheme,
  onSelectTheme,
  onSelectScheme,
}: PreviewViewProps): React.JSX.Element {
  const themeNames = Object.keys(config.themes);
  const themeName = pickOption(themeNames, selectedTheme);
  const theme = themeName ? config.themes[themeName] : null;
  const scheme: ColorScheme = /dark/i.test(selectedScheme) ? 'dark' : 'light';

  // The preview surface follows the selected scheme (not the user's Figma theme) so light
  // colors are read on a light surface and dark colors on a dark one. Keying the surface on
  // the scheme remounts it on scheme change, replaying the reveal animation — but not on
  // theme change.
  return (
    <>
      {(themeNames.length > 1 || COLOR_SCHEME_OPTIONS.length > 1) && (
        <div className='tx-hero'>
          <div className='tx-control-row'>
            {themeNames.length > 1 && (
              <LabeledToggleGroup
                label='Theme'
                ariaLabel='Toggle between themes'
                options={themeNames}
                value={themeName}
                onChange={onSelectTheme}
              />
            )}
            <LabeledToggleGroup
              label='Color scheme'
              ariaLabel='Toggle between color schemes'
              options={COLOR_SCHEME_OPTIONS}
              value={pickOption(COLOR_SCHEME_OPTIONS, selectedScheme)}
              onChange={onSelectScheme}
            />
          </div>
        </div>
      )}

      <div key={scheme} className={`tx-surface tx-surface--${scheme}`}>
        <div className='tx-preview-layout'>
          {theme ? (
            <>
              <ColorScales theme={theme} scheme={scheme} />
              <BorderRadii theme={theme} />
              <FontFamilies theme={theme} />
            </>
          ) : (
            <div className='tx-empty'>The config defines no themes.</div>
          )}
        </div>
      </div>
    </>
  );
}

// Fall back to the first option when the selection is missing or stale.
function pickOption(options: string[], selected: string | null): string | null {
  if (selected && options.includes(selected)) {
    return selected;
  }
  return options[0] ?? null;
}

function LabeledToggleGroup({
  label,
  ariaLabel,
  options,
  value,
  onChange,
}: {
  label: string;
  ariaLabel: string;
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
}): React.JSX.Element {
  return (
    <div>
      <div className='tx-control-label'>{label}</div>
      <ToggleGroup
        aria-label={ariaLabel}
        value={value ?? undefined}
        onChange={onChange}
      >
        {options.map((option) => (
          <ToggleGroupItem key={option} value={option}>
            {option}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

// One row per color scale (theme colors followed by the severity colors), one swatch per
// semantic role in scale order.
function ColorScales({
  theme,
  scheme,
}: {
  theme: ThemeConfig;
  scheme: ColorScheme;
}): React.JSX.Element {
  const scales = useMemo(
    () => Object.entries(getThemeColorScales(theme, scheme)),
    [theme, scheme],
  );

  if (scales.length === 0) {
    return <div className='tx-empty'>No semantic color scales found.</div>;
  }

  return (
    <div className='tx-color-grid'>
      {scales.map(([name, scale]) => (
        <div className='tx-color-row' key={name}>
          <span className='tx-color-row-label' title={name}>
            {name}
          </span>
          <div className='tx-swatches'>
            {semanticColorNames.map((role) => (
              <div
                key={role}
                className='tx-swatch has-color'
                title={`${role}: ${scale[role].hex}`}
                style={{ '--swatch': scale[role].hex } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// The border-radius steps in config order, evaluated from their formulas.
function BorderRadii({ theme }: { theme: ThemeConfig }): React.JSX.Element {
  const steps = useMemo(
    () => Object.entries(resolveBorderRadiusSteps(theme.borderRadius)),
    [theme],
  );

  return (
    <div className='tx-color-row'>
      <span className='tx-color-row-label tx-subtle'>Border radius</span>
      <div className='tx-radius-row'>
        {steps.map(([name, px]) => {
          const label = px === null ? 'invalid' : `${px}px`;
          return (
            <div
              className='tx-radius-item'
              key={name}
              title={`${name}: ${label}`}
            >
              <span className='tx-radius-label'>{name}</span>
              <div
                className='tx-radius-sample'
                style={{ '--radius': `${px ?? 0}px` } as React.CSSProperties}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// One entry per typography set; most themes have a single set.
function FontFamilies({ theme }: { theme: ThemeConfig }): React.JSX.Element {
  const fonts = Object.entries(theme.typography);

  return (
    <div className='tx-color-row'>
      <span className='tx-color-row-label tx-subtle'>Font family</span>
      <div className='tx-font-row'>
        {fonts.map(([setName, typography]) => (
          <div
            className='tx-font-item'
            key={setName}
            title={`${setName}: ${typography.fontFamily}`}
            style={{ fontFamily: `'${typography.fontFamily}', sans-serif` }}
          >
            <span className='tx-font-sample' aria-hidden='true'>
              Aa
            </span>
            <span className='tx-font-name'>{typography.fontFamily}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
