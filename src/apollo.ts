import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { SERVER_URI, TOKEN } from './constants';

const token = localStorage.getItem(TOKEN);

export const isLoggedInVar = makeVar(Boolean(token));

export const authTokenVar = makeVar(token);

const httpLink = createHttpLink({
  uri: SERVER_URI,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
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
