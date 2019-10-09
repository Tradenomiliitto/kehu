const express = require("express");
const createError = require("http-errors");
const router = express.Router();
const BlogService = require("../services/BlogService");
const { getUniqueTags } = require("../utils/BlogUtils");

router.get("/:slug", async (req, res, next) => {
  const post = await BlogService.getPost(req.params.slug);

  // If not posts found with the :slug render 404 error
  if (post == null) {
    return next(createError(404));
  }

  res.render("blog-post", {
    post,
    user: req.user,
    pageUrl: process.env.HOME_URL + req.originalUrl,
    env: process.env
  });
});

router.get("/", async (req, res) => {
  const posts = await BlogService.getPosts(req.query.aihe);
  const tags = getUniqueTags(posts);
  res.render("blog", {
    posts,
    tags,
    user: req.user,
    pageUrl: process.env.HOME_URL + req.originalUrl,
    env: process.env
  });
});

module.exports = router;
