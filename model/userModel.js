const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
      trim: true,
    },
    picture: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
    },
    googleId: {
      type: String,
    },
    myPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestapms: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
