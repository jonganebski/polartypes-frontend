/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: stepComments
// ====================================================

export interface stepComments_comments_creator {
  __typename: "Users";
  slug: string;
  username: string;
  avatarUrl: string | null;
}

export interface stepComments_comments {
  __typename: "Comment";
  id: number;
  createdAt: any;
  text: string;
  creator: stepComments_comments_creator;
}

export interface stepComments {
  __typename: "Step";
  comments: stepComments_comments[];
}
