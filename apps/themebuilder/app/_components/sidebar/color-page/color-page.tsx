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
  canRenameColor,
  REQUIRED_COLOR,
  removeThemeColor,
  setThemeColor,
} from '~/_utils/theme-workspace';
import { useThemebuilder } from '~/routes/themebuilder/_utils/use-themebuilder';
import { ColorInput } from '../../color-input/color-input';
import { ColorOverrides } from '../color-overrides/color-overrides';
import { ColorPane } from '../color-pane/color-pane';
import classes from './color-page.module.css';

type ColorEditor = {
  /** Whether the color was added when the editor opened */
  isNew: boolean;
  /** The name the color has in the theme */
  name: string;
  /** The name in the name field. It becomes the color's name when the editor is saved. */
  typedName: string;
  /** The base color when the editor opened, which cancelling goes back to */
  initialHex: string;
};

const DEFAULT_COLOR = '#0062ba';

export const ColorPage = () => {
  const { t } = useTranslation();
  const { colors, workspace } = useThemebuilder();
  const { updateTheme } = useThemeStore();
  const confirmationRef = useRef<HTMLDialogElement>(null);
  const confirmationId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const returnFocusName = useRef<string | null>(null);
  const [pendingAction, setPendingAction] = useState<
    'add' | 'remove' | 'rename' | null
  >(null);
  const themeCount = Object.keys(workspace.config.themes).length;

  const [editor, setEditor] = useState<ColorEditor | null>(null);
  const [color, setColor] = useColor(DEFAULT_COLOR);
  const isOpen = editor !== null;

  useEffect(() => {
    if (isOpen || returnFocusName.current === null) return;
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
  }, [isOpen]);

  /* A change of the base color is shown at once, so the editor keeps the color it opened with to be able to cancel.
   * The name is only changed when the editor is saved. */
  const openEditor = (name: string, hex: string, isNew = false) => {
    setColor(ColorService.convert('hex', hex));
    setEditor({ isNew, name, typedName: name, initialHex: hex });
  };

  const addColor = () => {
    let suffix = 1;
    while (colors.some((color) => color.name === `color-${suffix}`)) suffix++;
    const name = `color-${suffix}`;

    openEditor(name, DEFAULT_COLOR, true);
    updateTheme((theme) =>
      setThemeColor(theme, undefined, name, DEFAULT_COLOR),
    );
  };

  const closeEditor = (focusName = editor?.name ?? null) => {
    returnFocusName.current = focusName;
    setEditor(null);
  };

  const rename = ({ name, typedName }: ColorEditor) => {
    updateTheme((theme) =>
      setThemeColor(theme, name, typedName, theme.colors[name]),
    );
    closeEditor(typedName);
  };

  const remove = ({ name }: ColorEditor) => {
    updateTheme((theme) => removeThemeColor(theme, name));
    closeEditor();
  };

  /* Adding, removing and renaming a color applies to every theme, so it is confirmed when there are several */
  const confirm = (action: typeof pendingAction, run: () => void) => {
    if (themeCount === 1) return run();
    setPendingAction(action);
    confirmationRef.current?.showModal();
  };

  return (
    <div className={classes.container} ref={containerRef}>
      {!editor && (
        <>
          <div className={classes.group}>
            <div className={classes.colors}>
              {colors.map((colorTheme) => (
                <ColorInput
                  key={colorTheme.name}
                  color={colorTheme.hex}
                  name={colorTheme.name}
                  onClick={() => openEditor(colorTheme.name, colorTheme.hex)}
                />
              ))}
              <Button
                data-action='add-color'
                variant='secondary'
                className={classes.btn}
                onClick={() => confirm('add', addColor)}
                aria-label={`${t('colorPane.add')} ${t('themeModal.color')}`}
              >
                {t('colorPane.add')} {t('themeModal.color')}
                <PlusIcon aria-hidden />
              </Button>
            </div>
          </div>
          <Divider />
          <div className={classes.overridesSection}>
            <ColorOverrides />
          </div>
        </>
      )}

      {editor && (
        <ColorPane
          onClose={() =>
            editor.typedName === editor.name
              ? closeEditor()
              : confirm('rename', () => rename(editor))
          }
          onRemove={() => confirm('remove', () => remove(editor))}
          onCancel={() => {
            updateTheme((theme) =>
              setThemeColor(theme, editor.name, editor.name, editor.initialHex),
            );
            closeEditor();
          }}
          type={editor.isNew ? 'add-color' : 'edit-color'}
          color={color}
          name={editor.typedName}
          committedName={editor.name}
          setColor={(newColor) => {
            setColor(newColor);
            updateTheme((theme) =>
              setThemeColor(theme, editor.name, editor.name, newColor.hex),
            );
          }}
          setName={(typedName) => setEditor({ ...editor, typedName })}
          canRename={canRenameColor(editor.name)}
          canRemove={editor.name !== REQUIRED_COLOR}
          info={
            editor.name === REQUIRED_COLOR
              ? t('colorPane.neutral-info')
              : canRenameColor(editor.name)
                ? undefined
                : t('colorPane.severity-info')
          }
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
                  name: editor?.name,
                  count: themeCount,
                })
              : pendingAction === 'rename'
                ? t('colorPane.confirm-rename-description', {
                    from: editor?.name,
                    to: editor?.typedName,
                    count: themeCount,
                  })
                : t('colorPane.confirm-add-description', { count: themeCount })}
          </Paragraph>
          <div className={classes.confirmationActions}>
            <Button
              data-color={pendingAction === 'remove' ? 'danger' : 'accent'}
              onClick={() => {
                confirmationRef.current?.close();
                if (pendingAction === 'add') addColor();
                else if (editor && pendingAction === 'remove') remove(editor);
                else if (editor && pendingAction === 'rename') rename(editor);
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
