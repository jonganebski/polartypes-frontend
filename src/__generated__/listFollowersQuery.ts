/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ListFollowersInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: listFollowersQuery
// ====================================================

export interface listFollowersQuery_listFollowers_user_followers {
  __typename: "Users";
  slug: string;
  username: string;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
  city: string | null;
  timeZone: string | null;
  isFollowing: boolean;
  isMe: boolean;
}

export interface listFollowersQuery_listFollowers_user {
  __typename: "Users";
  slug: string;
  followers: listFollowersQuery_listFollowers_user_followers[];
}

export interface listFollowersQuery_listFollowers {
  __typename: "ListFollowersOutput";
  ok: boolean;
  error: string | null;
  endCursorId: number | null;
  hasNextPage: boolean | null;
  user: listFollowersQuery_listFollowers_user | null;
}

export interface listFollowersQuery {
  listFollowers: listFollowersQuery_listFollowers;
}

export interface listFollowersQueryVariables {
  input: ListFollowersInput;
}
