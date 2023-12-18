const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const { getMyPosts } = require("../controllers/postController");

const postRouter = express.Router();

postRouter.get("/my-posts", verifyToken, getMyPosts);

module.exports = postRouter;
