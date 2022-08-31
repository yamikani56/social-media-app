let postResolvers = require("./posts");
let userResolvers = require("./users");
module.exports = {
  Query: {
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
};
