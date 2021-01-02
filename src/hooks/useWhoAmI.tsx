import { gql, useQuery } from '@apollo/client';
import { USER_FRAGMENT } from '../fragments';
import { whoAmIQuery } from '../__generated__/whoAmIQuery';

export const WHO_AM_I_QUERY = gql`
  query whoAmIQuery {
    whoAmI {
      ...UserParts
    }
  }
  ${USER_FRAGMENT}
`;

export const useWhoAmI = () => {
  return useQuery<whoAmIQuery>(WHO_AM_I_QUERY);
};
