import {
  Button,
  Dialog,
  Fieldset,
  Heading,
  Textfield,
  Tooltip,
} from '@digdir/designsystemet-react';
import { PencilIcon, PlusIcon, TrashIcon } from '@navikt/aksel-icons';
import { useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  isValidThemeName,
  renameWorkspaceThemes,
  type ThemeWorkspace,
} from '~/_utils/theme-workspace';
import classes from './edit-themes-dialog.module.css';

type Row = {
  id: number;
  /** Saved name of the theme, or `null` for a theme added in this dialog */
  from: string | null;
  name: string;
  error?: string;
};

type EditThemesDialogProps = {
  workspace: ThemeWorkspace;
  onSave: (workspace: ThemeWorkspace) => void;
};

export const EditThemesDialog = ({
  workspace,
  onSave,
}: EditThemesDialogProps) => {
  const { t } = useTranslation();
  const headingId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nextId = useRef(0);
  const [rows, setRows] = useState<Row[]>([]);

  const createRow = (from: string | null, name = ''): Row => ({
    id: nextId.current++,
    from,
    name,
  });

  const updateRow = (id: number, row: Partial<Row>) =>
    setRows((previous) =>
      previous.map((item) => (item.id === id ? { ...item, ...row } : item)),
    );

  const save = () => {
    const validated = rows.map((row) => {
      const name = row.name.trim();
      let error: string | undefined;
      if (!isValidThemeName(name)) error = t('themeBuilder.invalid-theme-name');
      else if (
        rows.some((other) => other !== row && other.name.trim() === name)
      )
        error = t('themeBuilder.duplicate-theme-name');
      return { ...row, name, error };
    });
    setRows(validated);
    if (validated.some((row) => row.error)) return;

    onSave(renameWorkspaceThemes(workspace, validated));
    dialogRef.current?.close();
  };

  return (
    <>
      <Tooltip content={t('themeBuilder.edit-themes')}>
        <Button
          variant='secondary'
          icon
          data-size='sm'
          aria-label={t('themeBuilder.edit-themes')}
          onClick={() => {
            setRows(
              Object.keys(workspace.config.themes).map((name) =>
                createRow(name, name),
              ),
            );
            dialogRef.current?.showModal();
          }}
        >
          <PencilIcon aria-hidden />
        </Button>
      </Tooltip>
      <Dialog ref={dialogRef} closedby='any' aria-labelledby={headingId}>
        <Dialog.Block>
          <Heading id={headingId} level={2} data-size='sm'>
            {t('themeBuilder.edit-themes')}
          </Heading>
        </Dialog.Block>
        <Dialog.Block>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              save();
            }}
          >
            <Fieldset data-size='sm'>
              <Fieldset.Legend>{t('themeBuilder.theme-names')}</Fieldset.Legend>
              <ul className={classes.rows}>
                {rows.map((row, index) => (
                  <li key={row.id} className={classes.row}>
                    <Textfield
                      className={classes.field}
                      aria-label={`${t('themeBuilder.theme-name')} ${index + 1}`}
                      value={row.name}
                      error={row.error}
                      autoFocus={row.from === null}
                      onChange={(event) =>
                        updateRow(row.id, {
                          name: event.currentTarget.value,
                          error: undefined,
                        })
                      }
                    />
                    {rows.length > 1 && (
                      <Button
                        variant='tertiary'
                        icon
                        aria-label={t('themeBuilder.remove-theme', {
                          name: row.name || index + 1,
                        })}
                        onClick={() =>
                          setRows((previous) =>
                            previous.filter((item) => item.id !== row.id),
                          )
                        }
                      >
                        <TrashIcon aria-hidden />
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </Fieldset>
            <Button
              className={classes.add}
              variant='tertiary'
              data-size='sm'
              onClick={() =>
                setRows((previous) => [...previous, createRow(null)])
              }
            >
              <PlusIcon aria-hidden />
              {t('themeBuilder.add-theme')}
            </Button>
            <div className={classes.actions}>
              <Button
                type='button'
                variant='secondary'
                onClick={() => dialogRef.current?.close()}
              >
                {t('colorPane.cancel')}
              </Button>
              <Button type='submit'>{t('colorPane.save')}</Button>
            </div>
          </form>
        </Dialog.Block>
      </Dialog>
    </>
  );
};
