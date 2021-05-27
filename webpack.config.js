module.exports = (params) => {
  const env = params.dev === true ? "dev" : "prod";
  return require(`./webpack.${env}.config.js`);
};
