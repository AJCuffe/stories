const bcrypt = require("bcrypt");
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
      // Find user with username
      const user = await User.findOne({ username });
      if (user) {
        throw new Error("Username is already taken");
      }
      // Create new user and save to the database
      const newUser = new User({ username, password, email });
      await newUser.save();
      // Create token with user data
      const token = jwt.sign({ username, email }, process.env.SECRET, {
        expiresIn: "1d"
      });
      // Return token to client
      return { token };
    },
    signinUser: async (root, { username, password }, { User }) => {
      // Find user with username
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }
      // Check inputted password and hashed password are the same
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        throw new Error("Password invalid");
      }
      // Create token with user data
      const token = jwt.sign(
        { username, email: user.email },
        process.env.SECRET,
        { expiresIn: "1d" }
      );
      // Return token to client
      return { token };
    }
  }
};
