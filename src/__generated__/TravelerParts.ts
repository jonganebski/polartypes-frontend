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
  username: string;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
  city: string | null;
  timeZone: string | null;
}

export interface TravelerParts_followings {
  __typename: "Users";
  id: number;
  username: string;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
  city: string | null;
  timeZone: string | null;
}

export interface TravelerParts {
  __typename: "Users";
  id: number;
  username: string;
  firstName: string;
  lastName: string | null;
  avatarUrl: string | null;
  city: string | null;
  timeZone: string | null;
  followers: TravelerParts_followers[];
  followings: TravelerParts_followings[];
}
