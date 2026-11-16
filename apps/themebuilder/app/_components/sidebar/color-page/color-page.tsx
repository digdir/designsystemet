import {
  Button,
  Dialog,
  Divider,
  Heading,
  Paragraph,
} from '@digdir/designsystemet-react';
import { PencilIcon, PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { useEffect, useId, useRef, useState } from 'react';
import { ColorService, useColor } from 'react-color-palette';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '~/_utils/theme-store';
import {
  removeThemeColor,
  setSeverityColor,
  setThemeColor,
} from '~/_utils/theme-workspace';
import type {
  ColorTheme,
  SeverityColorTheme,
} from '~/routes/themebuilder/_utils/use-themebuilder';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
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
  const { colors, severityColors, workspace } = useThemebuilder();
  const { updateTheme } = useThemeStore();
  const confirmationRef = useRef<HTMLDialogElement>(null);
  const confirmationId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const returnFocusName = useRef<string | null>(null);
  const [pendingAction, setPendingAction] = useState<
    'add' | 'remove' | 'rename' | null
  >(null);
  const themeCount = Object.keys(workspace.config.themes).length;

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

  /** Sets the name and color of the color at `index`, or adds a color when `index` is after the last one */
  const updateColor = (
    hex: string,
    name: string,
    type: ColorEditorState['colorType'],
    index: number,
  ) => {
    if (index < 0 || !hex || !name) return;
    const current = colors[index]?.name;

    updateTheme((theme) =>
      type === 'severity'
        ? setSeverityColor(theme, name as SeverityColorTheme['name'], hex)
        : setThemeColor(theme, current, name, hex),
    );
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

    updateColor(DEFAULT_COLOR, newColorName, 'color', index);
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
    const name = colors[index]?.name;
    if (name) updateTheme((theme) => removeThemeColor(theme, name));
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
              <Heading data-size='2xs'>
                {t('themeModal.severity-colors')}
              </Heading>
            </div>
            <div className={classes.colors}>
              {severityColors.map((severityColor, index) => (
                <ColorInput
                  key={severityColor.name}
                  color={severityColor.hex}
                  name={severityColor.name}
                  onClick={() => openSeverityColorEditor(severityColor, index)}
                />
              ))}
            </div>
          </div>
          <Divider />
          <div className={classes.overridesSection}>
            <ColorOverrides />
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
              updateColor(
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
            updateColor(
              newColor.hex,
              themeCount > 1 ? committedName : editorState.name,
              editorState.colorType,
              editorState.index,
            );
          }}
          setName={(newName) => {
            setEditorState((prev) => ({ ...prev, name: newName }));
            if (themeCount === 1) {
              updateColor(
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
            updateColor(
              editorState.initialHex,
              editorState.name,
              editorState.colorType,
              editorState.index,
            );
            closeEditor();
          }}
          onCancel={() => {
            updateColor(
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
            updateColor(
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
                  updateColor(
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
