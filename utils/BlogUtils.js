const { documentToHtmlString } = require("@contentful/rich-text-html-renderer");
const { BLOCKS } = require("@contentful/rich-text-types");
const moment = require("moment");
const logger = require("../logger");

// rich-text-html-renderer ignores embedded content so custom renderer
// is required
// https://github.com/contentful/rich-text/issues/61
const richTextOptions = {
  renderNode: {
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      try {
        let { title, description, file } = node.data.target.fields;
        const mimeType = file.contentType;
        const mimeGroup = mimeType.split("/")[0];

        switch (mimeGroup) {
          case "image":
            title = title ? `title="${title}"` : "";
            description = description ? `alt="${description}"` : "";
            return `<img src="${file.url}" ${title} ${description} />`;
          default:
            logger.error(`Unknown mime type: ${mimeGroup}`);
            return process.env.NODE_ENV !== "production"
              ? `Unknown mime type: ${mimeGroup}`
              : "";
        }
      } catch (err) {
        logger.error("Error rendering asset", { err });
        return process.env.NODE_ENV !== "production"
          ? "Error rendering asset"
          : "";
      }
    },
  },
};

function parseSimilarPost(post) {
  return {
    author: post.fields.author,
    excerpt: post.fields.excerpt,
    image: {
      url: post.fields.header.fields.file.url,
    },
    published: moment(post.sys.createdAt).format("D.M.YYYY"),
    slug: post.fields.url,
    tags: post.fields.tags,
    title: post.fields.title,
  };
}

function getSimilarPosts(post, posts) {
  if (!post.fields.tags || !post.fields.tags.length) {
    return [];
  }

  return post.fields.tags.reduce((acc, tag) => {
    if (acc.length === 2) {
      return acc;
    }
    posts.forEach((p) => {
      if (
        acc.length < 2 &&
        p.fields.tags &&
        p.fields.tags.length &&
        p.fields.tags.includes(tag) &&
        p.fields.title !== post.fields.title
      ) {
        acc.push(parseSimilarPost(p));
      }
    });
    return acc;
  }, []);
}

function parsePost(posts, post, index) {
  return {
    author: post.fields.author,
    content: documentToHtmlString(post.fields.content, richTextOptions),
    excerpt: post.fields.excerpt,
    image: {
      url: ((post.fields.header.fields || {}).file || {}).url,
    },
    nextPost: posts[index - 1] ? posts[index - 1].fields.url : null,
    prevPost: posts[index + 1] ? posts[index + 1].fields.url : null,
    published: moment(post.sys.createdAt).format("D.M.YYYY"),
    similarPosts: getSimilarPosts(post, posts),
    slug: post.fields.url,
    tags: post.fields.tags || [],
    title: post.fields.title,
  };
}

function parsePosts(entries) {
  return entries.items.reverse().map(parsePost.bind(null, entries.items));
}

function filterPostsByTag(posts, tag) {
  if (!tag) {
    return posts;
  }
  return posts.filter((post) => post.tags.includes(tag));
}

function getUniqueTags(posts) {
  if (posts && posts.length) {
    return [
      ...new Set(
        [].concat.apply(
          [],
          posts.map((p) => p.tags),
        ),
      ),
    ];
  }
  return [];
}

module.exports = {
  filterPostsByTag,
  getUniqueTags,
  parsePosts,
};
