/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReadFollowersInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: readFollowersQuery
// ====================================================

export interface readFollowersQuery_readFollowers_followers {
  __typename: "Users";
  id: number;
}

export interface readFollowersQuery_readFollowers {
  __typename: "ReadFollowersOutput";
  ok: boolean;
  error: string | null;
  followers: readFollowersQuery_readFollowers_followers[] | null;
}

export interface readFollowersQuery {
  readFollowers: readFollowersQuery_readFollowers;
}

export interface readFollowersQueryVariables {
  input: ReadFollowersInput;
}
