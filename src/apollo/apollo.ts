import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { SERVER_URI } from '../constants';
import {
  LIST_COMMENTS_POLICY,
  LIST_FOLLOWERS_POLICY,
  LIST_FOLLOWINGS_POLICY,
} from './field-policies';
import { authTokenVar, isLoggedInVar } from './reactive-variables';
import { STEP_TYPE_POCILIES, USER_TYPE_POLICIES } from './type-policies';

const httpLink = createHttpLink({
  uri: `${SERVER_URI}/graphql`,
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
      ...USER_TYPE_POLICIES,
      ...STEP_TYPE_POCILIES,
      Query: {
        fields: {
          ...LIST_FOLLOWERS_POLICY,
          ...LIST_FOLLOWINGS_POLICY,
          ...LIST_COMMENTS_POLICY,
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
