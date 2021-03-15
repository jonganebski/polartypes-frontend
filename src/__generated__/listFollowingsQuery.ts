/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ListFollowingsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: listFollowingsQuery
// ====================================================

export interface listFollowingsQuery_listFollowings_user_followings {
  __typename: "Users";
  id: number;
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

export interface listFollowingsQuery_listFollowings_user {
  __typename: "Users";
  slug: string;
  followings: listFollowingsQuery_listFollowings_user_followings[];
}

export interface listFollowingsQuery_listFollowings {
  __typename: "ListFollowingsOutput";
  ok: boolean;
  error: string | null;
  endCursorId: number | null;
  hasNextPage: boolean | null;
  user: listFollowingsQuery_listFollowings_user | null;
}

export interface listFollowingsQuery {
  listFollowings: listFollowingsQuery_listFollowings;
}

export interface listFollowingsQueryVariables {
  input: ListFollowingsInput;
}
