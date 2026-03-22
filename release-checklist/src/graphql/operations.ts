import { gql } from "@apollo/client";

// TypeScript interfaces for our GraphQL data
export interface Release {
  id: string;
  versionName: string;
  status: string;
  createdAt: string;
  additionalRemarks?: string;
  stepsState?: {
    a: boolean;
    b: boolean;
    c: boolean;
    d: boolean;
    e: boolean;
    f: boolean;
    g: boolean;
  };
}

export interface GetReleasesData {
  releases: Release[];
}

export interface GetReleaseData {
  release: Release;
}

export interface CreateReleaseData {
  createRelease: Release;
}

export interface UpdateStepsData {
  updateSteps: Release;
}

export interface DeleteReleaseData {
  deleteRelease: Release;
}

// Query to get the list of releases
export const GET_RELEASES = gql`
  query GetReleases {
    releases {
      id
      versionName
      status
      createdAt
    }
  }
`;

// Mutation to create a new release
export const CREATE_RELEASE = gql`
  mutation CreateRelease($versionName: String!, $additionalRemarks: String) {
    createRelease(versionName: $versionName, additionalRemarks: $additionalRemarks) {
      id
      versionName
      status
      createdAt
    }
  }
`;

// Query to get a single release by its ID
export const GET_RELEASE = gql`
  query GetRelease($id: ID!) {
    release(id: $id) {
      id
      versionName
      status
      createdAt
      additionalRemarks
      stepsState {
        a
        b
        c
        d
        e
        f
        g
      }
    }
  }
`;

// Mutation to update the checklist steps
export const UPDATE_STEPS = gql`
  mutation UpdateSteps($id: ID!, $steps: StepsInput!) {
    updateSteps(id: $id, steps: $steps) {
      id
      status
      stepsState {
        a
        b
        c
        d
        e
        f
        g
      }
    }
  }
`;

export const DELETE_RELEASE = gql`
  mutation DeleteRelease($id: ID!) {
    deleteRelease(id: $id) {
      id
    }
  }
`;