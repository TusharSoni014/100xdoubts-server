const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./dbconnect.js");
const userRouter = require("./routes/userRouter.js");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const passport = require("passport");
const googleRouter = require("./routes/googleRouter.js");
const app = express();
require("./passport-config.js");
dotenv.config();
const PORT = process.env.PORT || 4000;

//middlewares
app.use(
  cookieSession({
    name: "session",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_SECRET],
    sameSite: "lax",
    httpOnly: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/user", userRouter);
app.use("/google", googleRouter);

//mongodb connect
connectDB();

app.listen(PORT, () => {
  console.log(`listening on port http://localhost:${PORT}`);
});
