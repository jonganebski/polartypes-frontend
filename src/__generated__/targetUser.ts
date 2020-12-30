/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: targetUser
// ====================================================

export interface targetUser_followers {
  __typename: "Users";
  id: number;
}

export interface targetUser {
  __typename: "Users";
  followers: targetUser_followers[];
}
