const { client } = require("../utils/contentful");
const logger = require("../logger");

async function getPosts() {
  try {
    return await client.getEntries({
      content_type: "blog",
      order: "sys.createdAt"
    });
  } catch (e) {
    logger.error(e);
  }
}

module.exports = {
  getPosts
};
