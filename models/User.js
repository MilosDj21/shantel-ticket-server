const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail, isStrongPassword } = require("validator");
const Ticket = require("./tech-ticket/TechTicket");

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
    roles: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Role",
    },
    profileImage: {
      type: String,
      required: false,
    },
    secret: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// userSchema.index({ email: "text", firstName: "text", lastName: "text" });

//static method, must not be arrow function
userSchema.statics.signup = async function (email, password, firstName, lastName, roles, profileImage, secret) {
  if (!email || !password || !firstName || !lastName || !roles || !profileImage || !secret) throw Error("All fields must be filled!");
  if (!isEmail(email)) throw Error("Not a valid email!");
  if (!isStrongPassword(password)) throw Error("Password not strong enough!");

  const exist = await this.findOne({ email });
  if (exist) throw Error("Email already in use!");

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hashPassword, firstName, lastName, roles, profileImage: profileImage.path, secret });
  return user;
};

userSchema.statics.modifyOne = async function (id, userData) {
  if (userData.password) {
    const salt = await bcrypt.genSalt();
    userData.password = await bcrypt.hash(userData.password, salt);
  }
  const user = await User.findOneAndUpdate({ _id: id }, { ...userData });
  if (!user) throw Error("No such user");
  return user;
};

//static method, must not be arrow function
userSchema.statics.login = async function (email, password) {
  if (!email || !password) throw Error("All fields must be filled!");

  const user = await this.findOne({ email }).populate("roles");

  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth)
      return {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        profileImage: user.profileImage,
        secret: user.secret,
      };
  }
  throw Error("Incorrect credentials!");
};

userSchema.pre("findOneAndDelete", async function (next) {
  try {
    const userId = this.getFilter()._id;
    const ticketList = await Ticket.find({ user: new mongoose.Types.ObjectId(userId) });
    for (const ticket of ticketList) {
      await Ticket.findByIdAndDelete(ticket._id);
    }
  } catch (error) {
    console.log(error);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
