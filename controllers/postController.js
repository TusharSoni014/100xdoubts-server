const Post = require("../model/postModel");
const User = require("../model/userModel");

exports.getMyPosts = async (req, res) => {
  const userId = req._id;
  try {
    const user = await User.findById(userId).populate("myPosts");
    if (!user) {
      return res.status(404).send({ message: "User not found!" });
    }
    return res.status(200).send({ myPosts: user.myPosts });
  } catch (error) {
    return res.status(500).send({ message: "Doubt post not found!" });
  }
};

exports.getDoubt = async (req, res) => {
  const { doubtId } = req.body;
  try {
    const post = await Post.findById(doubtId).populate("owner");
    if (!post) {
      return res.status(404).send({ message: "Post not Found!" });
    }
    return res.status(200).send({
      title: post.title,
      description: post.description,
      attachments: post.attachments,
      comments: post.comments,
      createdAt: post.createdAt,
      author: {
        username: post.owner.username,
        avatar: post.owner.picture,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Couldn't get the posts! Try again." });
  }
};

exports.createNewPost = async (req, res) => {
  const userId = req._id;
  const { title, description } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const post = await Post.create({
      title: title,
      description: description,
      owner: userId,
    });

    user.myPosts.push(post._id);
    await user.save();

    return res.status(201).send(post);
  } catch (error) {
    return res.status(500).send({ message: "Error creating post!" });
  }
};

exports.getAllPosts = async (req, res) => {
  const page = req.params.page || 1;
  const pageSize = 10;
  try {
    const skip = (page - 1) * pageSize;
    const posts = await Post.find({}).skip(skip).limit(pageSize);
    return res.status(200).send({ allPosts: posts });
  } catch (error) {
    return res.status(500).send({ message: "Error retrieving posts!" });
  }
};
