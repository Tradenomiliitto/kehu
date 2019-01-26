const express = require("express");
const router = express.Router();
const BlogService = require("../services/BlogService");

router.get("/", async (req, res) => {
  const posts = await BlogService.getPosts();
  res.render("blog", {
    posts
  });
});

module.exports = router;
