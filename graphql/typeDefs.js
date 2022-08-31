let { gql } = require("graphql-tag");

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
  }
  type User {
    id: ID!
    username: String!
    token: String!
    email: String!
    createdAt: String
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }
  type Mutation {
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
  }
`;
