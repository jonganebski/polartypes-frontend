import { makeVar } from '@apollo/client';
import { TOKEN } from '../constants';

const token = localStorage.getItem(TOKEN);

export const isLoggedInVar = makeVar(Boolean(token));

export const authTokenVar = makeVar(token);

export const logUserIn = (token: string) => {
  localStorage.setItem(TOKEN, token);
  authTokenVar(token);
  isLoggedInVar(true);
  window.location.reload();
};

export const logUserOut = () => {
  localStorage.removeItem(TOKEN);
  authTokenVar(null);
  isLoggedInVar(false);
  window.location.reload();
};
