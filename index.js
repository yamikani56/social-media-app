let { ApolloServer } = require("apollo-server");
let {
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
let mongoose = require("mongoose");

//
let { MONGODB } = require("./config.js");
let Post = require("./model/Post.js");

let typeDefs = require("./graphql/typeDefs");
let resolvers = require("./graphql/resolvers");

let server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("connected to MongoDB successfully!");
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`server running at ${res.url}`);
  });
