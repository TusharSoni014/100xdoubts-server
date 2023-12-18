const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
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

    return res.status(200).send({ user: user });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    return res.status(400).send({ message: "user not found" });
  }
  const matchedPassword = await bcrypt.compare(password, existingUser.password);
  if (!matchedPassword) {
    return res
      .status(400)
      .send({ message: "password or email didn't matched !" });
  }
  const token = jwt.sign(
    { email: email, _id: existingUser._id },
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

  return res.status(200).send({ user: existingUser });
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).send({ message: "Logged out!" });
  } catch (error) {
    return res.status(500).send({ message: "Error logging out" });
  }
};

const userInfo = async (req, res) => {
  const userId = req._id;
  try {
    const user = await User.findById(userId);
    return res.status(200).send({ user: user });
  } catch (error) {
    return res.status(500).send({ message: "Error getting user info!" });
  }
};

module.exports = { signup, login, logout, userInfo };
