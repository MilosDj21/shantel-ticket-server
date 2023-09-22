const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { authenticator } = require("otplib");
require("dotenv").config();

//3 days in seconds
const maxAge = 3 * 24 * 60 * 60;

const createJwt = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.login = async (req, res) => {
  const { email, password, twoFaToken } = req.body;
  try {
    if (!email || !password || !twoFaToken) throw Error("All fields must be filled");
    const user = await User.login(email, password);

    const twoFAValid = authenticator.verify({ token: twoFaToken, secret: user.secret });
    if (!twoFAValid) throw Error("Unauthorized");

    const jwtToken = createJwt(user._id);
    res.cookie("jwt", jwtToken, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      secure: process.env.ENVIRONMENT === "production" ? true : false,
    });
    res.status(200).json({ status: "success", data: user });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
};

module.exports.logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.status(200).json({ status: "success" });
};
