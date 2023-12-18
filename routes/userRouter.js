const express = require("express");
const {
  signup,
  login,
  logout,
  userInfo,
  sendOTP,
  forgotPassword,
  sendResetLink,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/sendOTP", sendOTP);
userRouter.post("/sendResetLink", sendResetLink);
userRouter.get("/userInfo", verifyToken, userInfo);
userRouter.put("/forgetPassword", forgotPassword);

module.exports = userRouter;