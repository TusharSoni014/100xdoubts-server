const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const {
  getMyPosts,
  createNewPost,
  getAllPosts,
  upvoteDoubt,
  create100,
} = require("../controllers/postController");

const postRouter = express.Router();

postRouter.get("/my-posts", verifyToken, getMyPosts);
postRouter.get("/get-all-posts/:page/:filter", getAllPosts);
postRouter.post("/create", verifyToken, createNewPost);
postRouter.post("/upvote", verifyToken, upvoteDoubt);

//temporary function for testing purposes
postRouter.post("/create100", verifyToken, create100);

module.exports = postRouter;
