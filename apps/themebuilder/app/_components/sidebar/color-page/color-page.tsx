import {
  Button,
  Dialog,
  Divider,
  Heading,
  Paragraph,
} from '@digdir/designsystemet-react';
import { PencilIcon, PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '~/model/theme-store';
import {
  canRenameColor,
  newColorName,
  REQUIRED_COLOR,
  removeThemeColor,
  setThemeColor,
} from '~/model/theme-workspace';
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

type Action = 'add' | 'remove' | 'rename';

/* Adding, removing and renaming a color applies to every theme, so it is confirmed when there are several */
const confirmations = {
  add: {
    title: 'colorPane.confirm-add-title',
    description: 'colorPane.confirm-add-description',
    label: 'colorPane.confirm-add',
    Icon: PlusIcon,
  },
  remove: {
    title: 'colorPane.confirm-remove-title',
    description: 'colorPane.confirm-remove-description',
    label: 'colorPane.confirm-remove',
    Icon: TrashIcon,
  },
  rename: {
    title: 'colorPane.confirm-rename-title',
    description: 'colorPane.confirm-rename-description',
    label: 'colorPane.confirm-rename',
    Icon: PencilIcon,
  },
} as const;

/** The colors of the theme, and the editor for the one that is being edited */
export const ColorPage = () => {
  const { t } = useTranslation();
  const { colors, workspace, updateTheme } = useThemeStore();
  const confirmationRef = useRef<HTMLDialogElement>(null);
  const confirmationId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const returnFocusName = useRef<string | null>(null);
  /* The action the confirmation dialog asks about */
  const [confirming, setConfirming] = useState<Action>('add');
  const themeCount = Object.keys(workspace.config.themes).length;

  const [editor, setEditor] = useState<ColorEditor | null>(null);
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
  const openEditor = (name: string, hex: string, isNew = false) =>
    setEditor({ isNew, name, typedName: name, initialHex: hex });

  const closeEditor = (focusName = editor?.name ?? null) => {
    returnFocusName.current = focusName;
    setEditor(null);
  };

  const setHex = (name: string, hex: string) =>
    updateTheme((theme) => setThemeColor(theme, name, name, hex));

  const run = (action: Action) => {
    if (action === 'add') {
      const name = newColorName(colors.map((color) => color.name));
      updateTheme((theme) =>
        setThemeColor(theme, undefined, name, DEFAULT_COLOR),
      );
      openEditor(name, DEFAULT_COLOR, true);
    } else if (editor && action === 'remove') {
      updateTheme((theme) => removeThemeColor(theme, editor.name));
      closeEditor();
    } else if (editor) {
      const { name, typedName } = editor;
      updateTheme((theme) =>
        setThemeColor(theme, name, typedName, theme.colors[name]),
      );
      closeEditor(typedName);
    }
  };

  const confirm = (action: Action) => {
    if (themeCount === 1) return run(action);
    setConfirming(action);
    confirmationRef.current?.showModal();
  };

  const confirmation = confirmations[confirming];

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
                onClick={() => confirm('add')}
              >
                {t('colorPane.add-color')}
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
          isNew={editor.isNew}
          hex={
            colors.find((color) => color.name === editor.name)?.hex ??
            editor.initialHex
          }
          onColorChange={(hex) => setHex(editor.name, hex)}
          name={editor.typedName}
          setName={(typedName) => setEditor({ ...editor, typedName })}
          committedName={editor.name}
          onSave={() =>
            editor.typedName === editor.name ? closeEditor() : confirm('rename')
          }
          onCancel={() => {
            setHex(editor.name, editor.initialHex);
            closeEditor();
          }}
          onRemove={() => confirm('remove')}
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
        id={confirmationId}
      >
        <Dialog.Block>
          <Heading id={`${confirmationId}-heading`} level={2} data-size='sm'>
            {t(confirmation.title)}
          </Heading>
        </Dialog.Block>
        <Dialog.Block>
          <Paragraph id={`${confirmationId}-description`}>
            {t(confirmation.description, {
              name: editor?.name,
              from: editor?.name,
              to: editor?.typedName,
              count: themeCount,
            })}
          </Paragraph>
          <div className={classes.confirmationActions}>
            <Button
              data-color={confirming === 'remove' ? 'danger' : 'accent'}
              onClick={() => {
                confirmationRef.current?.close();
                run(confirming);
              }}
            >
              <confirmation.Icon aria-hidden />
              {t(confirmation.label)}
            </Button>
            <Button
              variant='secondary'
              command='close'
              commandfor={confirmationId}
            >
              {t('colorPane.cancel')}
            </Button>
          </div>
        </Dialog.Block>
      </Dialog>
    </div>
  );
};
