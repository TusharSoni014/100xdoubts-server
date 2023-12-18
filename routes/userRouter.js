const express = require("express");
const {
  signup,
  login,
  logout,
  userInfo,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/userInfo", verifyToken, userInfo);

module.exports = userRouter;
