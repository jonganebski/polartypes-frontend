/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: whoAmIQuery
// ====================================================

export interface whoAmIQuery_whoAmI_user {
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
  about: string | null;
}

export interface whoAmIQuery_whoAmI {
  __typename: "WhoAmIOutput";
  ok: boolean;
  error: string | null;
  user: whoAmIQuery_whoAmI_user | null;
}

export interface whoAmIQuery {
  whoAmI: whoAmIQuery_whoAmI;
}
