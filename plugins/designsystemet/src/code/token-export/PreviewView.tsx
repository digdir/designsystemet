import { ToggleGroup, ToggleGroupItem } from '@digdir/designsystemet-react';
import { getActiveTokenSets, resolveValue } from './resolver';
import type {
  BorderRadiusPreview,
  PreviewData,
  SemanticColorScale,
} from './types';
import { formatValue, parseNumber, toCssColor } from './utils';

const SEMANTIC_ROLE_ORDER = [
  'background-default',
  'background-tinted',
  'surface-default',
  'surface-tinted',
  'surface-hover',
  'surface-active',
  'border-subtle',
  'border-default',
  'border-strong',
  'text-subtle',
  'text-default',
  'base-default',
  'base-hover',
  'base-active',
  'base-contrast-subtle',
  'base-contrast-default',
] as const;

type PreviewViewProps = {
  preview: PreviewData;
  selectedTheme: string | null;
  selectedScheme: string | null;
  onSelectTheme: (theme: string) => void;
  onSelectScheme: (scheme: string) => void;
};

// Renders the theme preview (theme/scheme controls + color scales + border radii). Warnings
// and status live in the header banner, not here.
export function PreviewView({
  preview,
  selectedTheme,
  selectedScheme,
  onSelectTheme,
  onSelectScheme,
}: PreviewViewProps): React.JSX.Element {
  const activeTokenSets = getActiveTokenSets(
    preview,
    selectedTheme,
    selectedScheme,
  );

  const showThemes = preview.themeOptions.length > 1;
  const showSchemes = preview.colorSchemeOptions.length > 1;

  // Always show Light before Dark (and any custom schemes in between).
  const rank = (name: string) =>
    /light/i.test(name) ? 0 : /dark/i.test(name) ? 2 : 1;
  const orderedSchemes = preview.colorSchemeOptions
    .slice()
    .sort((a, b) => rank(a.name) - rank(b.name));

  // The preview surface follows the selected scheme (not the user's Figma theme) so light
  // colors are read on a light surface and dark colors on a dark one. Keying the surface on
  // the scheme remounts it on scheme change, replaying the reveal animation — but not on
  // theme change.
  const surface = /dark/i.test(selectedScheme || '') ? 'dark' : 'light';

  return (
    <>
      {(showThemes || showSchemes) && (
        <section className='tx-hero'>
          <div className='tx-control-row'>
            {showThemes && (
              <div>
                <div className='tx-control-label'>Theme</div>
                <ToggleGroup
                  value={selectedTheme ?? undefined}
                  onChange={onSelectTheme}
                >
                  {preview.themeOptions.map((theme) => (
                    <ToggleGroupItem key={theme.name} value={theme.name}>
                      {theme.name}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            )}
            {showSchemes && (
              <div>
                <div className='tx-control-label'>Color scheme</div>
                <ToggleGroup
                  value={selectedScheme ?? undefined}
                  onChange={onSelectScheme}
                >
                  {orderedSchemes.map((scheme) => (
                    <ToggleGroupItem key={scheme.name} value={scheme.name}>
                      {scheme.name}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            )}
          </div>
        </section>
      )}

      <section>
        <div
          key={selectedScheme ?? 'none'}
          className={`tx-surface tx-surface--${surface}`}
        >
          <div className='tx-preview-layout'>
            <ColorScales
              scales={preview.semanticColorScales}
              preview={preview}
              activeTokenSets={activeTokenSets}
            />
            <BorderRadii
              radii={preview.borderRadii}
              preview={preview}
              activeTokenSets={activeTokenSets}
            />
          </div>
        </div>
      </section>
    </>
  );
}

function ColorScales({
  scales,
  preview,
  activeTokenSets,
}: {
  scales: SemanticColorScale[];
  preview: PreviewData;
  activeTokenSets: string[];
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
            {sortSemanticRoles(scale.roles).map((role) => {
              const color = toCssColor(
                resolveValue(role.value, preview, activeTokenSets, []),
              );
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
  preview,
  activeTokenSets,
}: {
  radii: BorderRadiusPreview[];
  preview: PreviewData;
  activeTokenSets: string[];
}): React.JSX.Element | null {
  if (radii.length === 0) {
    return null;
  }

  return (
    <div className='tx-color-row'>
      <span className='tx-color-row-label tx-subtle'>Border radius</span>
      <div className='tx-radius-row'>
        {radii.map((radius) => {
          const resolved = resolveValue(
            radius.value,
            preview,
            activeTokenSets,
            [],
          );
          const number = parseNumber(resolved);
          const cssValue = number === null ? 0 : Math.max(0, number);
          const label =
            number === null ? formatValue(radius.value) : `${number}px`;
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

function sortSemanticRoles(
  roles: SemanticColorScale['roles'],
): SemanticColorScale['roles'] {
  return roles.slice().sort((a, b) => {
    const indexA = SEMANTIC_ROLE_ORDER.indexOf(
      a.name as (typeof SEMANTIC_ROLE_ORDER)[number],
    );
    const indexB = SEMANTIC_ROLE_ORDER.indexOf(
      b.name as (typeof SEMANTIC_ROLE_ORDER)[number],
    );
    const safeA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
    const safeB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
    if (safeA !== safeB) {
      return safeA - safeB;
    }
    return a.name.localeCompare(b.name);
  });
}
