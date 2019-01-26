const { client } = require("../utils/Contentful");
const logger = require("../logger");
const { parsePosts, filterPostsByTag } = require("../utils/BlogUtils");

async function getPost(slug) {
  const posts = await getPosts();
  return posts.find(post => post.slug === slug);
}

async function getPosts(tag) {
  try {
    const entries = await client.getEntries({
      content_type: "blog",
      order: "sys.createdAt"
    });
    return filterPostsByTag(parsePosts(entries), tag);
  } catch (e) {
    logger.error(e);
  }
}

module.exports = {
  getPost,
  getPosts
};
