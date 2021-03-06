/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReadTripInput, Availability } from "./globalTypes";

// ====================================================
// GraphQL query operation: readTripQuery
// ====================================================

export interface readTripQuery_readTrip_trip_traveler {
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
}

export interface readTripQuery_readTrip_trip_steps_likesInfo_samples_user {
  __typename: "Users";
  slug: string;
  username: string;
  avatarUrl: string | null;
}

export interface readTripQuery_readTrip_trip_steps_likesInfo_samples {
  __typename: "Like";
  userId: number;
  stepId: number;
  user: readTripQuery_readTrip_trip_steps_likesInfo_samples_user;
}

export interface readTripQuery_readTrip_trip_steps_likesInfo {
  __typename: "LikesInfoOutput";
  totalCount: number;
  samples: readTripQuery_readTrip_trip_steps_likesInfo_samples[];
}

export interface readTripQuery_readTrip_trip_steps {
  __typename: "Step";
  id: number;
  name: string;
  location: string;
  country: string;
  arrivedAt: string;
  timeZone: string;
  lat: number;
  lon: number;
  story: string | null;
  imgUrls: string[] | null;
  countComments: number;
  didILiked: boolean;
  likesInfo: readTripQuery_readTrip_trip_steps_likesInfo;
}

export interface readTripQuery_readTrip_trip {
  __typename: "Trip";
  id: number;
  name: string;
  startDate: string;
  endDate: string | null;
  coverUrl: string | null;
  summary: string | null;
  viewCount: number;
  availability: Availability;
  traveler: readTripQuery_readTrip_trip_traveler;
  steps: readTripQuery_readTrip_trip_steps[];
}

export interface readTripQuery_readTrip {
  __typename: "ReadTripOutput";
  ok: boolean;
  error: string | null;
  trip: readTripQuery_readTrip_trip | null;
}

export interface readTripQuery {
  readTrip: readTripQuery_readTrip;
}

export interface readTripQueryVariables {
  input: ReadTripInput;
}
