const express = require("express");
const passport = require("passport");
const getGoogleUser = require("../controllers/googleController");
const verifyToken = require("../middlewares/verifyToken");
const googleRouter = express.Router();

googleRouter.get(
  "/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

googleRouter.get(
  "/callback",
  passport.authenticate("google", {
    failureMessage: "Google SSO Failed",
    failureRedirect: `${process.env.FE_URL}/login`,
    successRedirect: `${process.env.FE_URL}/signon`,
  })
);

googleRouter.get("/user", verifyToken, getGoogleUser);

module.exports = googleRouter;
