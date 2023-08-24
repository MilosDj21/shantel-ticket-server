const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail, isStrongPassword } = require("validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

//TODO: handle file upload for profile image

//static method, must not be arrow function
userSchema.statics.signup = async function (email, password, firstName, lastName) {
  if (!email || !password || !firstName || !lastName) throw Error("All fields must be filled!");
  if (!isEmail(email)) throw Error("Not a valid email!");
  if (!isStrongPassword(password)) throw Error("Password not strong enough!");

  const exist = await this.findOne({ email });
  if (exist) throw Error("Email already in use!");

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hashPassword, firstName, lastName });
  return user;
};

//static method, must not be arrow function
userSchema.statics.login = async function (email, password) {
  if (!email || !password) throw Error("All fields must be filled!");

  const user = await this.findOne({ email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth)
      return {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
      };
  }
  throw Error("Incorrect credentials!");
};

const User = mongoose.model("User", userSchema);

module.exports = User;
