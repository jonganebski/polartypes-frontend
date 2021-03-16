/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: TargetUserParts
// ====================================================

export interface TargetUserParts_trips_steps_likesInfo {
  __typename: "LikesInfoOutput";
  totalCount: number;
}

export interface TargetUserParts_trips_steps {
  __typename: "Step";
  id: number;
  lat: number;
  lon: number;
  arrivedAt: string;
  imgUrls: string[] | null;
  country: string;
  likesInfo: TargetUserParts_trips_steps_likesInfo;
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
  countFollowings: number;
  countFollowers: number;
  isFollower: boolean;
  trips: TargetUserParts_trips[];
}
