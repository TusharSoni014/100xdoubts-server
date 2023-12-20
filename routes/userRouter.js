const express = require("express");
const {
  signup,
  login,
  logout,
  sendOTP,
  forgotPassword,
  sendResetLink,
} = require("../controllers/userController");

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/sendOTP", sendOTP);
userRouter.post("/sendResetLink", sendResetLink);
userRouter.put("/forgetPassword", forgotPassword);

module.exports = userRouter;
