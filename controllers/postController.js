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
      upvotes: post.upvotes,
      upvoteCount: post?.upvoteCount,
      topic: post.topic,
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
  const { title, description, topic } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const post = await Post.create({
      title: title,
      description: description,
      owner: userId,
      topic: topic,
    });

    user.myPosts.push(post._id);
    await user.save();

    return res.status(201).send({ newPostUrl: post._id });
  } catch (error) {
    return res.status(500).send({ message: "Error creating post!" });
  }
};

exports.upvoteDoubt = async (req, res) => {
  const userId = req._id;
  const { postId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    const hasUpvoted = post.upvotes.includes(userId);
    if (hasUpvoted) {
      post.upvotes = post.upvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
      await post.save();
      const user = await User.findById(userId);
      user.upvotedPosts = user.upvotedPosts.filter(
        (id) => id.toString() !== postId
      );
      await user.save();
      return res.json({ message: "Upvote removed successfully" });
    } else {
      post.upvotes.push(userId);
      await post.save();
      const user = await User.findById(userId);
      user.upvotedPosts.push(postId);
      await user.save();

      return res.json({ message: "Post upvoted successfully" });
    }
  } catch (error) {
    return res.status(500).send({ message: "Error upvoting post, try again!" });
  }
};

exports.getAllPosts = async (req, res) => {
  const page = req.params.page || 1;
  const filterMode = req.params.filter || "latest";
  const pageSize = 50;

  try {
    const skip = (page - 1) * pageSize;

    let sortCriteria;
    switch (filterMode) {
      case "latest":
        sortCriteria = { createdAt: -1 };
        break;
      case "asc-upvotes":
        sortCriteria = { upvoteCount: 1 };
        break;
      case "des-upvotes":
        sortCriteria = { upvoteCount: -1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
    }

    const posts = await Post.find({})
      .sort(sortCriteria)
      .skip(skip)
      .limit(pageSize)
      .populate("owner");

    const sortedPosts = posts.map((post) => ({
      title: post?.title,
      description: post?.description,
      url: post?._id,
      comments: post?.comments,
      upvotes: post?.upvotes,
      upvoteCount: post?.upvoteCount,
      topic: post?.topic,
      createdAt: post?.createdAt,
      author: {
        username: post?.owner?.username,
        avatar: post?.owner?.picture,
      },
    }));

    return res.status(200).json(sortedPosts);
  } catch (error) {
    return res.status(500).send({ message: "Error retrieving posts!" });
  }
};

exports.create100 = async (req, res) => {
  const userId = req._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    for (let index = 0; index < 100; index++) {
      await Post.create({
        title: `post title ${index + 1}`,
        description: `post description`,
        owner: userId,
      });
    }
    return res.status(200).json({ message: "post created successfully!" });
  } catch (error) {
    return res.status(500).send({ message: "Error retrieving posts!" });
  }
};

exports.searchDoubt = async (req, res) => {
  const { searchText } = req.body;
  try {
    const posts = await Post.find({
      title: { $regex: searchText, $options: "i" },
    });
    return res.status(200).send(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Error getting search!" });
  }
};
