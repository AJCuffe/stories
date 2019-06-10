// Add modules
const express = require("express");
const bodyParser = require("body-parser");

// Add GraphQL modules
const { graphqlExpress, graphiqlExpress } = require("graphql-server-express");
const { makeExecutableSchema } = require("graphql-tools");

const typeDefs = `
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello World"
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  "/graphql",
  bodyParser.json(),
  graphqlExpress({
    schema
  })
);

app.use(
  "/graphiql",
  graphiqlExpress({
    endpointURL: "/graphql"
  })
);

// Run the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
