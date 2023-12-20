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
    failureRedirect:
      process.env.NODE_ENV === "production"
        ? "https://www.100xdoubts.online/login"
        : "http://localhost:5173/login",
    successRedirect:
      process.env.NODE_ENV === "production"
        ? "https://www.100xdoubts.online/signon"
        : "http://localhost:5173/signon",
  })
);

googleRouter.get("/user", verifyToken, getGoogleUser);

module.exports = googleRouter;
