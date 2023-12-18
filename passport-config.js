const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
const User = require("./model/userModel");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_OAUTH_REDIRECT_URL;
const defaultPicture =
  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

passport.use(
  new GoogleStrategy(
    {
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          const email = profile.emails[0].value;
          const emailUsername = email.split("@")[0];

          let username;
          let isUnique = false;

          while (!isUnique) {
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            username = `${emailUsername}${randomNum}`;
            const existingUser = await User.findOne({ username });
            if (!existingUser) {
              isUnique = true;
            }
          }

          const defaultUser = {
            username: username,
            name: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.photos[0].value,
            googleId: profile.id,
          };

          user = new User(defaultUser);
          await user.save();
        } else if (!user.googleId) {
          user.googleId = profile.id;
          if (!user.name) {
            user.name = profile.displayName;
          }
          if (user.picture == defaultPicture) {
            user.picture = profile.photos[0].value;
          }
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        console.error("Error in Google OAuth strategy:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});