const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    attachments: [{ type: String }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    upvoteCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

postSchema.pre("save", function (next) {
  this.upvoteCount = this.upvotes.length;
  next();
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
