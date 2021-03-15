/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: StepParts
// ====================================================

export interface StepParts_traveler {
  __typename: "Users";
  slug: string;
  isMe: boolean;
}

export interface StepParts_likes_user {
  __typename: "Users";
  slug: string;
  username: string;
  avatarUrl: string | null;
}

export interface StepParts_likes {
  __typename: "Like";
  user: StepParts_likes_user;
}

export interface StepParts_comments_creator {
  __typename: "Users";
  slug: string;
  username: string;
  avatarUrl: string | null;
}

export interface StepParts_comments {
  __typename: "Comment";
  id: number;
  createdAt: any;
  text: string;
  creator: StepParts_comments_creator;
}

export interface StepParts {
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
  traveler: StepParts_traveler;
  likes: StepParts_likes[];
  comments: StepParts_comments[];
}
