const jwt = require("jsonwebtoken");

exports.resolvers = {
  Query: {
    getCurrentUser: async (root, args, { currentUser, User }) => {
      const user = await User.findOne({ username: currentUser.username });
      return user;
    }
  },
  Mutation: {
    signupUser: async (root, { username, password, email }, { _, User }) => {
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
