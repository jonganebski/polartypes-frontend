import { FieldPolicy } from '@apollo/client';

export const LIST_FOLLOWERS_POLICY: { [fieldName: string]: FieldPolicy } = {
  listFollowers: {
    keyArgs: ['slug'],
    merge(_, incoming) {
      return incoming;
    },
  },
};

export const LIST_FOLLOWINGS_POLICY: { [fieldName: string]: FieldPolicy } = {
  listFollowings: {
    keyArgs: ['slug'],
    merge(_, incoming) {
      return incoming;
    },
  },
};
