import React from 'react';

export const useModalState = (modalRef: React.RefObject<HTMLDialogElement>) => {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!modalRef?.current) return;
    if (modalRef.current?.open) setIsOpen(true);

    const observer = new MutationObserver(() => {
      if (modalRef.current?.open) setIsOpen(true);
      else setIsOpen(false);
    });
    observer.observe(modalRef.current, {
      attributes: true,
      attributeFilter: ['open'],
    });
    return () => {
      observer.disconnect();
    };
  }, [modalRef]);

  return isOpen;
};
