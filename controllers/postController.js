const User = require("../model/userModel");

exports.getMyPosts = async (req, res) => {
  const userId = req._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }
    return res.status(200).send({ myPosts: user.myPosts });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Couldn't get the posts! try again" });
  }
};
