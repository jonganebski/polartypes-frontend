import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { TOKEN } from './constants';
import { useWhoAmI } from './hooks/useWhoAmI';

const token = localStorage.getItem(TOKEN);

export const isLoggedInVar = makeVar(Boolean(token));

export const authTokenVar = makeVar(token);

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((x, y) => {
  console.log('x: ', x);
  console.log('y: ', y);
  return {
    headers: {
      ...y.headers,
      'x-jwt': authTokenVar() ?? '',
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar;
            },
          },
          token: {
            read() {
              return authTokenVar;
            },
          },
        },
      },
    },
  }),
});
