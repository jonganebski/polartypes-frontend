/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CreatedStep
// ====================================================

export interface CreatedStep_traveler {
  __typename: "Users";
  slug: string;
  isMe: boolean;
}

export interface CreatedStep_likes_user {
  __typename: "Users";
  slug: string;
  username: string;
  avatarUrl: string | null;
}

export interface CreatedStep_likes {
  __typename: "Like";
  userId: number;
  stepId: number;
  user: CreatedStep_likes_user;
}

export interface CreatedStep {
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
  traveler: CreatedStep_traveler;
  likes: CreatedStep_likes[];
}
