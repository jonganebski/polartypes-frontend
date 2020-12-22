import { gql, useQuery } from '@apollo/client';
import { whoAmIQuery } from '../__generated__/whoAmIQuery';

const WHO_AM_I_QUERY = gql`
  query whoAmIQuery {
    whoAmI {
      firstName
      slug
      timeZone
    }
  }
`;

export const useWhoAmI = () => {
  return useQuery<whoAmIQuery>(WHO_AM_I_QUERY);
};
