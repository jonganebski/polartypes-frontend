/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TravelerParts
// ====================================================

export interface TravelerParts_followers {
  __typename: "Users";
  id: number;
}

export interface TravelerParts {
  __typename: "Users";
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  timeZone: string | null;
  followers: TravelerParts_followers[];
}
