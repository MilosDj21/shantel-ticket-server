const mongoose = require("mongoose");
const { isEmail } = require("validator");

const clientSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

//static method, must not be arrow function
clientSchema.statics.createClient = async function (email, user) {
  if (!isEmail(email)) throw Error("Not a valid email!");

  const exist = await this.findOne({ email });
  if (exist) throw Error("Email already in use!");

  const client = await this.create({ email, user });
  return client;
};

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
