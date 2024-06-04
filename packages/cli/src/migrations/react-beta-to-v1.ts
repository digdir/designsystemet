import { runJSXCodemod } from './codemods/jsx/run.js';

export default (glob?: string) => runJSXCodemod({ globPattern: glob });
