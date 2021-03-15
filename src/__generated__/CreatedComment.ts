/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CreatedComment
// ====================================================

export interface CreatedComment_creator {
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
}

export interface CreatedComment {
  __typename: "Comment";
  createdAt: any;
  creator: CreatedComment_creator;
  text: string;
  id: number;
}
