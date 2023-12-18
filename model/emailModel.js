const mongoose = require("mongoose");

const EmailTokenSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    resetToken: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      expires: 300,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const EmailToken = mongoose.model("ResetToken", EmailTokenSchema);
module.exports = EmailToken;