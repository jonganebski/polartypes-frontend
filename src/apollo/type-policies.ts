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

export const STEP_TYPE_POCILIES: TypePolicies = {
  Step: {
    fields: {
      comments: {
        merge(existing = [], incoming = []) {
          return [...existing, ...incoming];
        },
      },
    },
  },
};

export const LIKE_TYPE_POLICIES: TypePolicies = {
  Like: {
    keyFields: (obj) => `Like:${obj.stepId}:${obj.userId}`,
  },
};
