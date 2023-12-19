const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const allowedCharactersRegex = /^[a-zA-Z0-9-_]+$/;
const nodemailer = require("nodemailer");
const Otp = require("../model/otpModel");
const crypto = require("crypto");
const EmailToken = require("../model/emailModel");

///utility functions///
const generateOTP = () => {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
///////////////////////

const signup = async (req, res) => {
  try {
    const { username, email, password, otp } = req.body;
    if (!username || !email || !password || !otp) {
      return res.status(400).send({ message: "all fields are required" });
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send({ message: "user already exists" });
    }
    if (username.length > 20 || username.length < 3) {
      return res.status(400).send({ message: "Invalid username length" });
    }
    const existingUserName = await User.findOne({ username: username });
    if (existingUserName) {
      return res.status(400).send({
        message: "Username already exists",
      });
    }
    if (!allowedCharactersRegex.test(username)) {
      return res
        .status(400)
        .send({ message: "Invalid characters in username." });
    }

    const correctOtp = await Otp.findOne({ email: email });
    if (!correctOtp) {
      return res.status(400).send({ message: "OTP not found or invalid!" });
    }
    if (correctOtp.otp !== otp) {
      return res.status(400).send({
        message: "OTP not found or invalid!",
        correctOtp: correctOtp,
        otp: otp,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { email: email, _id: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 24 * 60 * 60),
    });

    return res.status(200).send({
      user: {
        email: user.email,
        username: user.username,
        picture: user.picture,
        upvotedPosts: user.upvotedPosts,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send({ message: "All fields are required!" });
  }
  if (username.includes("@")) {
    var existingUser = await User.findOne({ email: username });
  } else {
    var existingUser = await User.findOne({ username: username });
  }
  if (!existingUser) {
    return res
      .status(400)
      .send({ message: "Password or email didn't matched!" });
  }
  const matchedPassword = await bcrypt.compare(password, existingUser.password);
  if (!matchedPassword) {
    return res
      .status(400)
      .send({ message: "Password or email didn't matched!" });
  }
  const token = jwt.sign(
    { username: username, _id: existingUser._id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );

  res.cookie("token", token, {
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 24 * 60 * 60),
  });

  return res.status(200).send({
    user: {
      email: existingUser.email,
      username: existingUser.username,
      picture: existingUser.picture,
      upvotedPosts: existingUser.upvotedPosts,
    },
  });
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    req.session = null;
    return res.status(200).send({ message: "Logged out!" });
  } catch (error) {
    return res.status(500).send({ message: "Error logging out!" });
  }
};

const userInfo = async (req, res) => {
  const userId = req._id;
  try {
    const user = await User.findById(userId).select("-password -_id -__v");
    return res.status(200).send({ user: user });
  } catch (error) {
    return res.status(500).send({ message: "Error getting user info!" });
  }
};

const sendOTP = async (req, res) => {
  const { email, username } = req.body;
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PASS,
    },
  });
  if (!email) {
    return res.status(400).send({ message: "Invalid email !" });
  }
  try {
    const existingUser = await User.findOne({ email: email });
    const existingUsername = await User.findOne({ username: username });

    if (existingUsername) {
      return res.status(400).send({ message: "Username already exists" });
    }

    if (existingUser) {
      return res.status(400).send({ message: "This user already exists." });
    }

    if (username.length < 3 || username.length > 20) {
      return res.status(400).send({ message: "Username length invalid." });
    }

    if (!allowedCharactersRegex.test(username)) {
      return res
        .status(400)
        .send({ message: "Invalid characters in username." });
    }

    const generatedOTP = generateOTP();

    await transporter.sendMail({
      from: '"100xDoubts" <tusharproject00@gmail.com>',
      to: email,
      subject: "100xDoubts OTP",
      text: `Your OTP for 100xDoubts: ${generatedOTP}`,
      html: `<h1>Your OTP for 100xDoubts: ${generatedOTP}</h1>`,
    });

    await Otp.findOneAndUpdate(
      { email: email },
      { email: email, otp: generatedOTP },
      { upsert: true, new: true }
    );
    return res.status(200).send({ message: "OTP Sent !" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "OTP Couldn't be sent, try again!" });
  }
};

const forgotPassword = async (req, res) => {
  const userId = req._id;
  try {
    const user = await User.findById(userId);
  } catch (error) {
    return res.status(500).send({ message: "Error chaning password" });
  }
};
const sendResetLink = async (req, res) => {
  const { email } = req.body;
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PASS,
    },
  });
  try {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).send({ message: "User not found!" });
    }
    const emailResetToken = crypto.randomBytes(30).toString("hex");
    await EmailToken.create({
      email: email,
      resetToken: emailResetToken,
    });
    await transporter.sendMail({
      from: '"100xDoubts" <tusharproject00@gmail.com>',
      to: email,
      subject: "100xDoubts Reset Password Link",
      text: `Your Reset Token for 100xDoubts: ${emailResetToken}`,
      html: `<p>Your Reset Token for 100xDoubts: ${emailResetToken}</p>`,
    });
    return res.status(200).send({ message: "Email reset token send!" });
  } catch (error) {
    return res.status(500).send({ message: "Error chaning password" });
  }
};

module.exports = {
  signup,
  login,
  logout,
  userInfo,
  sendOTP,
  forgotPassword,
  sendResetLink,
};
