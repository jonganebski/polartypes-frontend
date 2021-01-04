import { gql, useLazyQuery } from '@apollo/client';
import { USER_FRAGMENT } from '../../fragments';
import { whoAmIQuery } from '../../__generated__/whoAmIQuery';

export const WHO_AM_I_QUERY = gql`
  query whoAmIQuery {
    whoAmI {
      ...UserParts
    }
  }
  ${USER_FRAGMENT}
`;

// useQuery makes warnings under strict mode. That is why this is useLazyQuery.
// see https://github.com/apollographql/react-apollo/issues/3635, https://github.com/apollographql/apollo-client/issues/7404
export const useWhoAmI = () => {
  return useLazyQuery<whoAmIQuery>(WHO_AM_I_QUERY);
};
