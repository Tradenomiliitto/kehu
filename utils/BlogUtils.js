const { documentToHtmlString } = require("@contentful/rich-text-html-renderer");
const moment = require("moment");

function parseSimilarPost(post) {
  return {
    author: post.fields.author,
    excerpt: post.fields.excerpt,
    image: {
      url: post.fields.header.fields.file.url
    },
    published: moment(post.sys.createdAt).format("D.M.YYYY"),
    slug: post.fields.url,
    tags: post.fields.tags,
    title: post.fields.title
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
    posts.forEach(p => {
      if (
        acc.length < 2 &&
        p.fields.tags &&
        p.fields.tags.length &&
        p.fields.tags.includes(tag)
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
    content: documentToHtmlString(post.fields.content),
    excerpt: post.fields.excerpt,
    image: {
      url: post.fields.header.fields.file.url
    },
    nextPost: posts[index - 1] ? posts[index - 1].fields.url : null,
    prevPost: posts[index + 1] ? posts[index + 1].fields.url : null,
    published: moment(post.sys.createdAt).format("D.M.YYYY"),
    similarPosts: getSimilarPosts(post, posts),
    slug: post.fields.url,
    tags: post.fields.tags || [],
    title: post.fields.title
  };
}

function parsePosts(entries) {
  return entries.items.reverse().map(parsePost.bind(null, entries.items));
}

function filterPostsByTag(posts, tag) {
  if (!tag) {
    return posts;
  }
  return posts.filter(post => post.tags.includes(tag));
}

function getUniqueTags(posts) {
  if (posts && posts.length) {
    return [...new Set([].concat.apply([], posts.map(p => p.tags)))];
  }
  return [];
}

module.exports = {
  filterPostsByTag,
  getUniqueTags,
  parsePosts
};
