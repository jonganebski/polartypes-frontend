/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TargetUserParts
// ====================================================

export interface TargetUserParts_followers {
  __typename: "Users";
  id: number;
}

export interface TargetUserParts_followings {
  __typename: "Users";
  id: number;
}

export interface TargetUserParts_trips_steps {
  __typename: "Step";
  id: number;
  lat: number;
  lon: number;
  arrivedAt: string;
  imgUrls: string[] | null;
}

export interface TargetUserParts_trips {
  __typename: "Trip";
  id: number;
  name: string;
  startDate: string;
  endDate: string | null;
  coverUrl: string | null;
  steps: TargetUserParts_trips_steps[];
}

export interface TargetUserParts {
  __typename: "Users";
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  timeZone: string | null;
  about: string | null;
  city: string | null;
  followers: TargetUserParts_followers[];
  followings: TargetUserParts_followings[];
  trips: TargetUserParts_trips[];
}
