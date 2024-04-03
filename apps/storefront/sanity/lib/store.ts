import * as queryStore from '@sanity/react-loader';

import { token } from './token';
import { client } from './client';

queryStore.setServerClient(client.withConfig({ token }));

export const { loadQuery } = queryStore;
