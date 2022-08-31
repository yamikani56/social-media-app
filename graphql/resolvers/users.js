let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");
let { UserInputError } = require("apollo-server");
let {
  validateRegisterInputs,
  validateLoginInput,
} = require("../../utils/validators");
let { SECRET_KEY } = require("../../config");
let User = require("../../model/User");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
}

module.exports = {
  Mutation: {
    async login(parent, { username, password }, context, info) {
      let { valid, errors } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      let user = await User.findOne({ username });
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }
      let match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }

      let token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(
      parent,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      //validate user data
      let { valid, errors } = validateRegisterInputs(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      //make sure user doesnt already exist
      let user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("User exists", {
          errors: {
            username: "User already exists",
          },
        });
      }
      //hash user password
      password = await bcrypt.hash(password, 12);
      let newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });
      let res = await newUser.save();
      let token = generateToken(res);
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
