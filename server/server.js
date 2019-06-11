// Add modules
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

// Add GraphQL modules
const { ApolloServer } = require("apollo-server-express");
const { typeDefs } = require("./schema");
const { resolvers } = require("./resolvers");

// Mongoose models
const User = require("./models/User");

// Configure environment
dotenv.config();

// Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const app = express();

const PORT = process.env.PORT || 5000;

// Allow client connection to server
app.use(cors());

// Create the Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : null;
    let currentUser;
    if (token && token !== null) {
      currentUser = await jwt.verify(token, process.env.SECRET);
      return {
        currentUser,
        User
      };
    } else {
      return {
        User
      };
    }
  }
});

// Pass in the existing Express app to Apollo
server.applyMiddleware({ app });

// Run the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
