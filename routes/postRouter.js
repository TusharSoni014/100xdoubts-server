const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const {
  getMyPosts,
  createNewPost,
  getDoubt,
} = require("../controllers/postController");

const postRouter = express.Router();

postRouter.get("/my-posts", verifyToken, getMyPosts);
postRouter.post("/get-doubt", verifyToken, getDoubt);
postRouter.post("/create", verifyToken, createNewPost);

module.exports = postRouter;
