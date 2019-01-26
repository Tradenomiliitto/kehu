const express = require("express");
const router = express.Router();
const BlogService = require("../services/BlogService");
const { getUniqueTags } = require("../utils/BlogUtils");

router.get("/:slug", async (req, res) => {
  const post = await BlogService.getPost(req.params.slug);
  res.render("blog-post", {
    post,
    env: process.env
  });
});

router.get("/", async (req, res) => {
  const posts = await BlogService.getPosts(req.query.aihe);
  const tags = getUniqueTags(posts);
  res.render("blog", {
    posts,
    tags,
    env: process.env
  });
});

module.exports = router;
