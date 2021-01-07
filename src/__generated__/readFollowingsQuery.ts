/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReadFollowingsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: readFollowingsQuery
// ====================================================

export interface readFollowingsQuery_readFollowings_followings {
  __typename: "Users";
  id: number;
}

export interface readFollowingsQuery_readFollowings {
  __typename: "ReadFollowingsOutput";
  ok: boolean;
  error: string | null;
  followings: readFollowingsQuery_readFollowings_followings[] | null;
}

export interface readFollowingsQuery {
  readFollowings: readFollowingsQuery_readFollowings;
}

export interface readFollowingsQueryVariables {
  input: ReadFollowingsInput;
}
