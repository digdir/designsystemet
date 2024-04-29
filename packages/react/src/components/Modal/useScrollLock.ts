import { useEffect } from 'react';

export function useScrollLock(modalRef: React.RefObject<HTMLDialogElement>, bodyClass: string) {
  useEffect(() => {
    if (!modalRef.current) return;
    if (modalRef.current.open) document.body.classList.add(bodyClass);

    const observer = new MutationObserver(() => {
      if (modalRef.current?.open) document.body.classList.add(bodyClass);
      else document.body.classList.remove(bodyClass);
    });
    observer.observe(modalRef.current, {
      attributes: true,
      attributeFilter: ['open'],
    });
    return () => {
      observer.disconnect();
      document.body.classList.remove(bodyClass);
    };
  }, [bodyClass, modalRef]);
}
