import {
  type ColorScheme,
  getThemeColorScales,
  semanticColorNames,
} from '@digdir/designsystemet/color';
import type { ConfigSchema } from '@digdir/designsystemet/schemas/schema.js';
import { ToggleGroup, ToggleGroupItem } from '@digdir/designsystemet-react';
import { useMemo } from 'react';
import { resolveBorderRadiusSteps } from './border-radius';

type PreviewViewProps = {
  config: ConfigSchema;
  selectedTheme: string | null;
  selectedScheme: string;
  onSelectTheme: (theme: string) => void;
  onSelectScheme: (scheme: string) => void;
};

type ThemeConfig = ConfigSchema['themes'][string];

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
  const scheme = selectedScheme.toLowerCase() as ColorScheme;

  return (
    <>
      {themeNames.length > 1 && (
        <div className='hero'>
          <div className='control-row'>
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
              value={selectedScheme}
              onChange={onSelectScheme}
            />
          </div>
        </div>
      )}

      <div key={scheme} className={`surface surface--${scheme}`}>
        <div className='preview-layout'>
          {theme ? (
            <>
              <ColorScales theme={theme} scheme={scheme} />
              <BorderRadii theme={theme} scheme={scheme} />
              <FontFamilies theme={theme} />
            </>
          ) : (
            <div className='empty'>The config defines no themes.</div>
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
      <div>{label}</div>
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
    return <div className='empty'>No semantic color scales found.</div>;
  }

  return (
    <div className='color-grid'>
      {scales.map(([name, scale]) => (
        <div className='labeled-row' key={name}>
          <span className='row-label' title={name}>
            {name}
          </span>
          <div className='swatches'>
            {semanticColorNames.map((role) => (
              <div
                key={role}
                className='swatch has-color'
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
function BorderRadii({
  theme,
  scheme,
}: {
  theme: ThemeConfig;
  scheme: ColorScheme;
}): React.JSX.Element {
  const steps = useMemo(
    () => Object.entries(resolveBorderRadiusSteps(theme.borderRadius)),
    [theme],
  );

  return (
    <div className='labeled-row'>
      <span className='row-label'>Border radius</span>
      <div className='radius-row'>
        {steps.map(([name, px]) => {
          const label = px === null ? 'invalid' : `${px}px`;
          return (
            <div className='radius-item' key={name} title={`${name}: ${label}`}>
              <span className='radius-label'>{name}</span>
              <div
                data-color-scheme={scheme}
                className='radius-sample'
                style={{ '--radius': `${px ?? 0}px` } as React.CSSProperties}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// One entry per typography font; most themes have a single set.
function FontFamilies({ theme }: { theme: ThemeConfig }): React.JSX.Element {
  const fonts = Object.entries(theme.typography.fonts);

  return (
    <div className='labeled-row'>
      <span className='row-label'>Font family</span>
      <div className='font-row'>
        {fonts.map(([setName, typography]) => (
          <div
            className='font-item'
            key={setName}
            title={`${setName}: ${typography.fontFamily}`}
            style={{ fontFamily: `'${typography.fontFamily}', sans-serif` }}
          >
            <span className='font-sample' aria-hidden='true'>
              Aa
            </span>
            <span className='font-name'>{typography.fontFamily}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
