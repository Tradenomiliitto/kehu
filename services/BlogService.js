const { client } = require("../utils/contentful");
const logger = require("../logger");
const { parsePosts } = require("../utils/BlogUtils");

async function getPosts() {
  try {
    const entries = await client.getEntries({
      content_type: "blog",
      order: "sys.createdAt"
    });
    return parsePosts(entries);
  } catch (e) {
    logger.error(e);
  }
}

module.exports = {
  getPosts
};
