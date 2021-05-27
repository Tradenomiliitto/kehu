const { ManagementClient } = require("auth0");

module.exports = new ManagementClient({
  token: process.env.AUTH0_API_TOKEN,
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
});
