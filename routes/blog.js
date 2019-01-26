const express = require("express");
const router = express.Router();
const BlogService = require("../services/BlogService");

router.get("/:slug", async (req, res) => {
  const post = await BlogService.getPost(req.params.slug);
  res.render("blog-post", {
    post
  });
});

router.get("/", async (req, res) => {
  const posts = await BlogService.getPosts();
  res.render("blog", {
    posts
  });
});

module.exports = router;
