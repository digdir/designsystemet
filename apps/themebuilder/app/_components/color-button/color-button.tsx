import type {
  Color,
  SemanticColorNames,
} from '@digdir/designsystemet/internal';
import cl from 'clsx/lite';
import { useEffect, useEffectEvent, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useColorOverride } from '~/_hooks/use-color-override';
import classes from './color-button.module.css';

/** `<input type="color">` only accepts `#rrggbb`, so normalize 3/4/8-digit hex and fall back to black */
const toInputHex = (hex: string) => {
  const value = hex.trim().replace(/^#/, '').toLowerCase();
  if (/^[0-9a-f]{3,4}$/.test(value))
    return `#${[...value.slice(0, 3)].map((c) => c + c).join('')}`;
  if (/^[0-9a-f]{6}(?:[0-9a-f]{2})?$/.test(value))
    return `#${value.slice(0, 6)}`;
  return '#000000';
};

type ColorButtonProps = {
  /** The color's namespace, e.g. `accent` */
  namespace: string;
  colorName: SemanticColorNames;
  /** The step color in the current color scheme (with any override applied) */
  color: Color;
};

/**
 * A color step swatch that opens the native color picker.
 * The picked color is stored as an override for this step in the current color scheme.
 */
export const ColorButton = ({
  namespace,
  colorName,
  color,
}: ColorButtonProps) => {
  const { t } = useTranslation();
  const { isOverridden, setOverride } = useColorOverride(namespace, colorName);
  const inputRef = useRef<HTMLInputElement>(null);
  const overriddenId = useId();
  const { hex } = color;

  /**
   * Live preview while picking. It is tied to the hex it started from, so it is
   * dropped as soon as `hex` changes (committed value back from the loader,
   * reset, color scheme or theme switch).
   */
  const [preview, setPreview] = useState<{ from: string; value: string }>();
  const previewHex = preview?.from === hex ? preview.value : undefined;

  /* React's onChange fires on every `input` event while dragging. Only write
     to the URL (which re-runs the loader) on the native `change` event. */
  const commit = useEffectEvent((value: string) => {
    if (value !== toInputHex(hex)) setOverride(value);
  });

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const onChange = () => commit(input.value);
    input.addEventListener('change', onChange);
    return () => input.removeEventListener('change', onChange);
  }, []);

  return (
    <span className={classes.swatch}>
      <input
        ref={inputRef}
        type='color'
        className={cl(classes.box, 'ds-focus')}
        style={{ backgroundColor: previewHex ?? hex }}
        value={toInputHex(previewHex ?? hex)}
        onChange={(e) => setPreview({ from: hex, value: e.target.value })}
        aria-label={t('colorGroup.override', {
          namespace,
          color: color.displayName,
        })}
        aria-describedby={isOverridden ? overriddenId : undefined}
      />
      {isOverridden && (
        <span className={classes.marker} id={overriddenId}>
          <span className='ds-sr-only'>{t('colorGroup.overridden')}</span>
        </span>
      )}
    </span>
  );
};
