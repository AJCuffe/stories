const jwt = require("jsonwebtoken");
const User = require("./models/User");

exports.resolvers = {
  Query: {
    hello: () => "Hello World"
  },
  Mutation: {
    signupUser: async (root, { username, password, email }, context) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error("Username is already taken");
      }
      const newUser = new User({ username, password, email });
      await newUser.save();
      const token = jwt.sign({ username, email }, process.env.SECRET, {
        expiresIn: "1d"
      });
      return { token };
    }
  }
};
