import { gql, useQuery } from '@apollo/client';
import { whoAmIQuery } from '../__generated__/whoAmIQuery';

export const WHO_AM_I_QUERY = gql`
  query whoAmIQuery {
    whoAmI {
      id
      firstName
      lastName
      username
      slug
      city
      timeZone
      avatarUrl
      about
    }
  }
`;

export const useWhoAmI = () => {
  return useQuery<whoAmIQuery>(WHO_AM_I_QUERY);
};
