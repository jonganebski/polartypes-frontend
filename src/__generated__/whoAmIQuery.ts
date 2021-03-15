/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: whoAmIQuery
// ====================================================

export interface whoAmIQuery_whoAmI {
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
  about: string | null;
}

export interface whoAmIQuery {
  whoAmI: whoAmIQuery_whoAmI;
}
