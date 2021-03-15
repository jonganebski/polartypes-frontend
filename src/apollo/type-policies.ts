import { TypePolicies } from '@apollo/client';

export const USER_TYPE_POLICIES: TypePolicies = {
  Users: {
    keyFields: (obj) => `User:${obj.slug}`,
    fields: {
      followers: {
        merge(existing = [], incoming = []) {
          return [...existing, ...incoming];
        },
      },
      followings: {
        merge(existing = [], incoming = []) {
          return [...existing, ...incoming];
        },
      },
    },
  },
};
