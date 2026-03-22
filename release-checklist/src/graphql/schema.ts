import gql from 'graphql-tag';

export const typeDefs = gql`
  # The shape of our 7 fixed steps
  type StepsState {
    a: Boolean!
    b: Boolean!
    c: Boolean!
    d: Boolean!
    e: Boolean!
    f: Boolean!
    g: Boolean!
  }

  # Input for updating steps
  input StepsInput {
    a: Boolean
    b: Boolean
    c: Boolean
    d: Boolean
    e: Boolean
    f: Boolean
    g: Boolean
  }

  type Release {
    id: ID!
    versionName: String!
    createdAt: String!
    additionalRemarks: String
    status: String! # Computed automatically!
    stepsState: StepsState!
  }

  type Query {
    releases: [Release!]!
    release(id: ID!): Release
  }

  type Mutation {
    createRelease(versionName: String!, additionalRemarks: String): Release!
    updateSteps(id: ID!, steps: StepsInput!): Release!
    updateRemarks(id: ID!, additionalRemarks: String): Release!
  }
`;