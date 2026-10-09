import {
  createSearchParams,
  type SetURLSearchParams,
  useSearchParams,
} from 'react-router';
import { editorParams, updateWorkspace } from '../_utils/theme-workspace';

export function useThemeSearchParams(): [URLSearchParams, SetURLSearchParams] {
  const [params, setParams] = useSearchParams();
  const setThemeParams: SetURLSearchParams = (next, options) => {
    setParams((previous) => {
      const edited = createSearchParams(
        typeof next === 'function' ? next(editorParams(previous)) : next,
      );
      return updateWorkspace(previous, edited);
    }, options);
  };
  return [editorParams(params), setThemeParams];
}
