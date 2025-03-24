import cl from 'clsx/lite';
import { type PageType, useDebugStore } from '../debugStore';
import classes from './TabMenu.module.css';

export const TabMenu = () => {
  const pageType = useDebugStore((state) => state.pageType);
  const setPageType = useDebugStore((state) => state.setPageType);

  const pages = {
    main: 'Main',
    baseContrast: 'Base',
    scales: 'Scales',
    colorTable: 'Table',
    saturation: 'Saturation',
    article: 'Surface',
    mobile: 'App design',
    gradient: 'Gradient',
  };

  return (
    <div className={classes.menu}>
      {Object.entries(pages).map(([key, val]) => (
        <button
          key={key}
          className={cl(classes.item, pageType === key && classes.active)}
          onClick={() => {
            setPageType(key as PageType);
          }}
        >
          {val}
        </button>
      ))}
    </div>
  );
};
