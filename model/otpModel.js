const mongoose = require("mongoose");

const OtpSchema = mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      expires: 300, //in seconds (5 mints)
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Otp = mongoose.model("otp", OtpSchema);
module.exports = Otp;
