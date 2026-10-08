import {
  Button,
  Dialog,
  Divider,
  Heading,
  Paragraph,
  Switch,
} from '@digdir/designsystemet-react';
import { PencilIcon, PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { useEffect, useId, useRef, useState } from 'react';
import { ColorService, useColor } from 'react-color-palette';
import { useTranslation } from 'react-i18next';
import { useThemeSearchParams } from '~/_hooks/use-theme-search-params';
import type {
  ColorTheme,
  SeverityColorTheme,
} from '~/routes/themebuilder/_utils/use-themebuilder';
import {
  QUERY_SEPARATOR,
  useThemebuilder,
} from '~/routes/themebuilder/_utils/use-themebuilder';
import { ColorInput } from '../../color-input/color-input';
import { ColorOverrides } from '../color-overrides/color-overrides';
import { ColorPane } from '../color-pane/color-pane';
import classes from './color-page.module.css';

type ColorEditorState = {
  activePanel: 'add-color' | 'edit-color' | 'edit-severity' | 'none';
  colorType: 'color' | 'neutral' | 'severity';
  index: number;
  name: string;
  initialName: string;
  initialHex: string;
};

const DEFAULT_COLOR = '#0062ba';

export const ColorPage = () => {
  const { t } = useTranslation();
  const { colors, severityColors, severityEnabled, workspace } =
    useThemebuilder();
  const [query, setQuery] = useThemeSearchParams();
  const confirmationRef = useRef<HTMLDialogElement>(null);
  const confirmationId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const returnFocusName = useRef<string | null>(null);
  const severityId = useId();
  const [pendingAction, setPendingAction] = useState<
    'add' | 'remove' | 'rename' | null
  >(null);
  const themeCount = workspace
    ? Object.keys(workspace.config.themes).length
    : 1;

  const [editorState, setEditorState] = useState<ColorEditorState>({
    activePanel: 'none',
    colorType: 'color',
    index: 0,
    name: '',
    initialName: '',
    initialHex: DEFAULT_COLOR,
  });

  const [color, setColor] = useColor(DEFAULT_COLOR);
  useEffect(() => {
    if (editorState.activePanel !== 'none' || returnFocusName.current === null)
      return;
    const target = Array.from(
      containerRef.current?.querySelectorAll<HTMLButtonElement>(
        '[data-color-name]',
      ) || [],
    ).find((button) => button.dataset.colorName === returnFocusName.current);
    (
      target ||
      containerRef.current?.querySelector<HTMLButtonElement>(
        '[data-action="add-color"]',
      )
    )?.focus();
    returnFocusName.current = null;
  }, [editorState.activePanel]);

  const neutralIndex = colors.findIndex((c) => c.name === 'neutral');
  const neutralColor = neutralIndex >= 0 ? colors[neutralIndex] : undefined;
  const themeColorCount = colors.filter((c) => c.name !== 'neutral').length;
  const committedName =
    colors[editorState.index]?.name || editorState.initialName;

  const updateColorInParams = (
    hex: string,
    name: string,
    type: string,
    index: number,
  ) => {
    if (index < 0 || !hex || !name) return;

    const updatedParams = new URLSearchParams(query);

    if (type === 'color' || type === 'neutral') {
      const colorParam = query.get('colors') || '';
      const colorArray = colorParam.split(QUERY_SEPARATOR).filter(Boolean);

      if (index < colorArray.length) {
        colorArray[index] = `${name}:${hex}`;
      } else {
        colorArray.push(`${name}:${hex}`);
      }

      updatedParams.set('colors', colorArray.join(QUERY_SEPARATOR));
    } else if (type === 'severity') {
      updateSeverityColorInParams(hex, name, updatedParams);
    }

    setQuery(updatedParams, { replace: true, preventScrollReset: true });
  };

  const updateSeverityColorInParams = (
    hex: string,
    name: string,
    params: URLSearchParams,
  ) => {
    const severityParam = params.get('severity') || '';
    const severityArray = severityParam.split(QUERY_SEPARATOR).filter(Boolean);

    // Find the severity color and check if it's the default
    const defaultColor = severityColors.find((sc) => sc.name === name);
    if (!defaultColor) return;

    const isDefault = hex.toLowerCase() === defaultColor.hex.toLowerCase();

    // Remove existing entry for this severity color
    const filtered = severityArray.filter((s) => !s.startsWith(`${name}:`));

    // Only add if it's not the default value
    if (!isDefault) {
      filtered.push(`${name}:${hex}`);
    }

    if (filtered.length > 0) {
      params.set('severity', filtered.join(QUERY_SEPARATOR));
    } else {
      params.delete('severity');
    }
  };

  const openColorEditor = (
    colorTheme: ColorTheme,
    index: number,
    type: 'color' | 'neutral',
  ) => {
    const hexColor = colorTheme.colors.light['base-default'].hex;

    setColor(ColorService.convert('hex', hexColor));

    setEditorState({
      activePanel: 'edit-color',
      colorType: type,
      index: index,
      name: colorTheme.name,
      initialName: colorTheme.name,
      initialHex: hexColor,
    });
  };

  const openNewColorEditor = () => {
    let suffix = themeColorCount + 1;
    while (colors.some((color) => color.name === `color-${suffix}`)) suffix++;
    const newColorName = `color-${suffix}`;
    const index = colors.length;

    setColor(ColorService.convert('hex', DEFAULT_COLOR));

    setEditorState({
      activePanel: 'add-color',
      colorType: 'color',
      index,
      name: newColorName,
      initialName: newColorName,
      initialHex: DEFAULT_COLOR,
    });

    updateColorInParams(DEFAULT_COLOR, newColorName, 'color', index);
  };

  const openSeverityColorEditor = (
    severityColor: SeverityColorTheme,
    index: number,
  ) => {
    const hexColor = severityColor.hex;

    setColor(ColorService.convert('hex', hexColor));

    setEditorState({
      activePanel: 'edit-severity',
      colorType: 'severity',
      index: index,
      name: severityColor.name,
      initialName: severityColor.name,
      initialHex: hexColor,
    });
  };

  const closeEditor = (focusName = committedName) => {
    returnFocusName.current = focusName;
    setEditorState((prev) => ({
      ...prev,
      activePanel: 'none',
    }));
  };

  const removeColor = (index: number) => {
    if (index < 0) return;

    const updatedParams = new URLSearchParams(query);
    const colorParam = query.get('colors') || '';
    const colorArray = colorParam.split(QUERY_SEPARATOR).filter(Boolean);
    colorArray.splice(index, 1);
    updatedParams.set('colors', colorArray.join(QUERY_SEPARATOR));

    setQuery(updatedParams, {
      replace: true,
      preventScrollReset: true,
    });
  };

  const toggleSeverityColors = (enabled: boolean) => {
    const updatedParams = new URLSearchParams(query);
    if (enabled) {
      updatedParams.set('severity-enabled', 'true');
    } else {
      updatedParams.delete('severity-enabled');
      updatedParams.delete('severity'); // Also remove any severity color overrides
    }
    setQuery(updatedParams, { replace: true, preventScrollReset: true });
  };

  return (
    <div className={classes.container} ref={containerRef}>
      {editorState.activePanel === 'none' && (
        <>
          <div className={classes.group}>
            <div className={classes.colors}>
              {colors.map((colorTheme, index) =>
                colorTheme.name === 'neutral' ? null : (
                  <ColorInput
                    key={index}
                    color={colorTheme.colors.light['base-default'].hex}
                    name={colorTheme.name}
                    onClick={() => openColorEditor(colorTheme, index, 'color')}
                  />
                ),
              )}
              <Button
                data-action='add-color'
                variant='secondary'
                className={classes.btn}
                onClick={() => {
                  if (themeCount > 1) {
                    setPendingAction('add');
                    confirmationRef.current?.showModal();
                  } else {
                    openNewColorEditor();
                  }
                }}
                aria-label={`${t('colorPane.add')} ${t('themeModal.color')}`}
              >
                {t('colorPane.add')} {t('themeModal.color')}
                <PlusIcon aria-hidden />
              </Button>
            </div>
          </div>
          <Divider />
          {neutralColor && (
            <div className={classes.group}>
              <div className={classes.colors}>
                <ColorInput
                  color={neutralColor.colors.light['base-default'].hex}
                  name={neutralColor.name}
                  onClick={() =>
                    openColorEditor(neutralColor, neutralIndex, 'neutral')
                  }
                />
              </div>
            </div>
          )}
          <Divider />
          <div className={classes.group}>
            <div className={classes.groupHeader}>
              <Heading data-size='2xs' id={`${severityId}-heading`}>
                {t('themeModal.severity-colors')}
              </Heading>
              <Switch
                name='severity-colors-switch'
                data-size='sm'
                checked={severityEnabled}
                onChange={(e) => toggleSeverityColors(e.target.checked)}
                aria-labelledby={`${severityId}-heading`}
                aria-describedby={
                  severityEnabled ? undefined : `${severityId}-description`
                }
              />
            </div>
            {!severityEnabled && (
              <Paragraph
                id={`${severityId}-description`}
                data-size='sm'
                style={{
                  marginTop: '-4px',
                  marginBottom: '8px',
                  color: 'var(--ds-color-neutral-text-subtle)',
                }}
              >
                {t('themeModal.severity-colors-switch')}
              </Paragraph>
            )}
            {severityEnabled && (
              <div className={classes.colors}>
                {severityColors.map((severityColor, index) => (
                  <ColorInput
                    key={severityColor.name}
                    color={severityColor.hex}
                    name={severityColor.name}
                    onClick={() =>
                      openSeverityColorEditor(severityColor, index)
                    }
                  />
                ))}
              </div>
            )}
          </div>
          <Divider />
          <div className={classes.overridesSection}>
            <ColorOverrides
              triggerButton={
                <Button
                  variant='secondary'
                  data-size='sm'
                  className={classes.overridesBtn}
                >
                  <PencilIcon aria-hidden />
                  {t('colorPane.token-overrides')}
                </Button>
              }
            />
          </div>
        </>
      )}

      {(editorState.activePanel === 'add-color' ||
        editorState.activePanel === 'edit-color') && (
        <ColorPane
          onClose={() => {
            if (
              themeCount > 1 &&
              editorState.colorType === 'color' &&
              editorState.name !== committedName
            ) {
              setPendingAction('rename');
              confirmationRef.current?.showModal();
              return;
            }
            closeEditor();
          }}
          onRemove={() => {
            if (editorState.colorType === 'color') {
              if (themeCount > 1) {
                setPendingAction('remove');
                confirmationRef.current?.showModal();
                return;
              }
              removeColor(editorState.index);
            }
            closeEditor();
          }}
          onCancel={() => {
            if (editorState.activePanel === 'edit-color') {
              updateColorInParams(
                editorState.initialHex,
                editorState.initialName,
                editorState.colorType,
                editorState.index,
              );
            }
            closeEditor();
          }}
          type={editorState.activePanel}
          color={color}
          name={editorState.name}
          committedName={committedName}
          setColor={(newColor) => {
            setColor(newColor);
            updateColorInParams(
              newColor.hex,
              themeCount > 1 ? committedName : editorState.name,
              editorState.colorType,
              editorState.index,
            );
          }}
          setName={(newName) => {
            setEditorState((prev) => ({ ...prev, name: newName }));
            if (themeCount === 1) {
              updateColorInParams(
                color.hex,
                newName,
                editorState.colorType,
                editorState.index,
              );
            }
          }}
          colorType={
            editorState.colorType === 'severity'
              ? 'neutral'
              : editorState.colorType
          }
        />
      )}

      {editorState.activePanel === 'edit-severity' && (
        <ColorPane
          onClose={() => {
            closeEditor();
          }}
          onRemove={() => {
            // Reset to default by removing from query params
            const updatedParams = new URLSearchParams(query);
            updateSeverityColorInParams(
              editorState.initialHex,
              editorState.name,
              updatedParams,
            );
            setQuery(updatedParams, {
              replace: true,
              preventScrollReset: true,
            });
            closeEditor();
          }}
          onCancel={() => {
            updateColorInParams(
              editorState.initialHex,
              editorState.initialName,
              editorState.colorType,
              editorState.index,
            );
            closeEditor();
          }}
          type='edit-color'
          color={color}
          name={editorState.name}
          committedName={editorState.name}
          setColor={(newColor) => {
            setColor(newColor);
            updateColorInParams(
              newColor.hex,
              editorState.name,
              editorState.colorType,
              editorState.index,
            );
          }}
          setName={() => {
            // Name changes not allowed for severity colors
          }}
          colorType='severity'
        />
      )}
      <Dialog
        ref={confirmationRef}
        closedby='any'
        aria-labelledby={`${confirmationId}-heading`}
        aria-describedby={`${confirmationId}-description`}
        onClose={() => setPendingAction(null)}
        id='color-dialog'
      >
        <Dialog.Block>
          <Heading id={`${confirmationId}-heading`} level={2} data-size='sm'>
            {t(
              pendingAction === 'remove'
                ? 'colorPane.confirm-remove-title'
                : pendingAction === 'rename'
                  ? 'colorPane.confirm-rename-title'
                  : 'colorPane.confirm-add-title',
            )}
          </Heading>
        </Dialog.Block>
        <Dialog.Block>
          <Paragraph id={`${confirmationId}-description`}>
            {pendingAction === 'remove'
              ? t('colorPane.confirm-remove-description', {
                  name: committedName,
                  count: themeCount,
                })
              : pendingAction === 'rename'
                ? t('colorPane.confirm-rename-description', {
                    from: committedName,
                    to: editorState.name,
                    count: themeCount,
                  })
                : t('colorPane.confirm-add-description', { count: themeCount })}
          </Paragraph>
          <div className={classes.confirmationActions}>
            <Button
              data-color={pendingAction === 'remove' ? 'danger' : 'accent'}
              onClick={() => {
                confirmationRef.current?.close();
                if (pendingAction === 'add') {
                  openNewColorEditor();
                } else if (pendingAction === 'remove') {
                  removeColor(editorState.index);
                  closeEditor();
                } else if (pendingAction === 'rename') {
                  updateColorInParams(
                    colors[editorState.index]?.hex || color.hex,
                    editorState.name,
                    editorState.colorType,
                    editorState.index,
                  );
                  closeEditor(editorState.name);
                }
              }}
            >
              {pendingAction === 'remove' ? (
                <TrashIcon aria-hidden />
              ) : pendingAction === 'rename' ? (
                <PencilIcon aria-hidden />
              ) : (
                <PlusIcon aria-hidden />
              )}
              {t(
                pendingAction === 'remove'
                  ? 'colorPane.confirm-remove'
                  : pendingAction === 'rename'
                    ? 'colorPane.confirm-rename'
                    : 'colorPane.confirm-add',
              )}
            </Button>
            <Button
              variant='secondary'
              command='close'
              commandfor='color-dialog'
            >
              {t('colorPane.cancel')}
            </Button>
          </div>
        </Dialog.Block>
      </Dialog>
    </div>
  );
};
