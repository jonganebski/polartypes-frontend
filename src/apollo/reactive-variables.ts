import { makeVar } from '@apollo/client';
import { TOKEN } from '../constants';

const token = localStorage.getItem(TOKEN);

export const isLoggedInVar = makeVar(Boolean(token));

export const authTokenVar = makeVar(token);
