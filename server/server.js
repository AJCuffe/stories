// Add modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Add GraphQL modules
const { graphqlExpress, graphiqlExpress } = require("graphql-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const { typeDefs } = require("./schema");
const { resolvers } = require("./resolvers");

// Configure environment
dotenv.config();

// Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();

const PORT = process.env.PORT || 5000;

// Allow client connection to server
app.use(cors());

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
