import { FieldPolicy } from '@apollo/client';

export const LIST_FOLLOWERS_POLICY: { [fieldName: string]: FieldPolicy } = {
  listFollowers: {
    keyArgs: ['input', ['slug']],
    merge(_, incoming) {
      return incoming;
    },
  },
};

export const LIST_FOLLOWINGS_POLICY: { [fieldName: string]: FieldPolicy } = {
  listFollowings: {
    keyArgs: ['input', ['slug']],
    merge(_, incoming) {
      return incoming;
    },
  },
};

export const LIST_COMMENTS_POLICY: { [fieldName: string]: FieldPolicy } = {
  listComments: {
    keyArgs: ['input', ['stepId']],
    merge(_, incoming) {
      return incoming;
    },
  },
};
