import { useEffect, useState } from 'react';
import './Toast.css';
import { Spinner } from '@digdir/designsystemet-react';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import cl from 'clsx/lite';

export const Toast = () => {
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [close, setClose] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setOpen(true);
    }, 10);
    setTimeout(() => {
      setSuccess(true);
    }, 6000);

    setTimeout(() => {
      setClose(true);
    }, 7500);
  }, []);

  return (
    <div className={cl('toast', open && 'toastActive', close && 'toastClose')}>
      {success && (
        <>
          <div className='icon'>
            <CheckmarkIcon title='a11y-title' fontSize='2rem' />
          </div>{' '}
          Oppdatering vellykket!
        </>
      )}
      {!success && (
        <>
          <Spinner color='accent' title='loading' size='sm' />
          Oppdaterer variabler...
        </>
      )}
    </div>
  );
};
