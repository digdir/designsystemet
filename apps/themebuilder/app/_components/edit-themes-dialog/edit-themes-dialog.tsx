import {
  Button,
  Dialog,
  Divider,
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
} from '~/model/theme-workspace';
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
  const dialogId = useId();
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
      if (!isValidThemeName(name)) error = t('editThemes.invalid-theme-name');
      else if (
        rows.some((other) => other !== row && other.name.trim() === name)
      )
        error = t('editThemes.duplicate-theme-name');
      return { ...row, name, error };
    });
    setRows(validated);
    if (validated.some((row) => row.error)) return;

    onSave(renameWorkspaceThemes(workspace, validated));
    dialogRef.current?.close();
  };

  return (
    <>
      <Tooltip content={t('editThemes.edit-themes')}>
        <Button
          variant='secondary'
          icon
          data-size='sm'
          aria-label={t('editThemes.edit-themes')}
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
      <Dialog
        ref={dialogRef}
        closedby='any'
        aria-labelledby={headingId}
        id={dialogId}
      >
        <Dialog.Block>
          <Heading id={headingId} level={2} data-size='sm'>
            {t('editThemes.edit-themes')}
          </Heading>
        </Dialog.Block>
        <Divider style={{ margin: 0 }} />
        <form
          onSubmit={(event) => {
            event.preventDefault();
            save();
          }}
        >
          <Dialog.Block>
            <Fieldset data-size='md'>
              <Fieldset.Legend>{t('editThemes.theme-names')}</Fieldset.Legend>
              <Fieldset.Description
                style={{ marginBlockEnd: 'var(--ds-size-4)' }}
              >
                {t('editThemes.invalid-theme-name')}
              </Fieldset.Description>
              <ul className={classes.rows}>
                {rows.map((row, index) => (
                  <li key={row.id} className={classes.row}>
                    <Textfield
                      className={classes.field}
                      aria-label={`${t('editThemes.theme-name')} ${index + 1}`}
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
                        data-color='danger'
                        icon
                        aria-label={t('editThemes.remove-theme', {
                          name: row.name || index + 1,
                        })}
                        onClick={() =>
                          setRows((previous) =>
                            previous.filter((item) => item.id !== row.id),
                          )
                        }
                        data-tooltip={t('editThemes.remove-theme', {
                          name: row.name || index + 1,
                        })}
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
              {t('editThemes.add-theme')}
            </Button>
          </Dialog.Block>
          <Divider style={{ margin: 0 }} />
          <Dialog.Block>
            <div className={classes.actions}>
              <Button type='submit'>{t('common.save')}</Button>
              <Button
                type='button'
                variant='secondary'
                command='close'
                commandfor={dialogId}
              >
                {t('common.cancel')}
              </Button>
            </div>
          </Dialog.Block>
        </form>
      </Dialog>
    </>
  );
};
