/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CreatedStep
// ====================================================

export interface CreatedStep_likesInfo_samples_user {
  __typename: "Users";
  slug: string;
  username: string;
  avatarUrl: string | null;
}

export interface CreatedStep_likesInfo_samples {
  __typename: "Like";
  userId: number;
  stepId: number;
  user: CreatedStep_likesInfo_samples_user;
}

export interface CreatedStep_likesInfo {
  __typename: "LikesInfoOutput";
  totalCount: number;
  samples: CreatedStep_likesInfo_samples[];
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
  didILiked: boolean;
  likesInfo: CreatedStep_likesInfo;
}
