const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const { getMyPosts, createNewPost } = require("../controllers/postController");

const postRouter = express.Router();

postRouter.get("/my-posts", verifyToken, getMyPosts);
postRouter.post("/create", verifyToken, createNewPost);

module.exports = postRouter;
