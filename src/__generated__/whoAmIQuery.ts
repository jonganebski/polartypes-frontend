/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: whoAmIQuery
// ====================================================

export interface whoAmIQuery_whoAmI {
  __typename: "Users";
  firstName: string;
  username: string;
  slug: string;
  timeZone: string | null;
}

export interface whoAmIQuery {
  whoAmI: whoAmIQuery_whoAmI;
}