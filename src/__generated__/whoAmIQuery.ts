/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: whoAmIQuery
// ====================================================

export interface whoAmIQuery_whoAmI {
  __typename: "Users";
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  slug: string;
  city: string | null;
  timeZone: string | null;
  avatarUrl: string | null;
  about: string | null;
}

export interface whoAmIQuery {
  whoAmI: whoAmIQuery_whoAmI;
}
