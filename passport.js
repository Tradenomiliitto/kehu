const Auth0Strategy = require("passport-auth0");

function setupPassport(passport) {
  const strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
      return done(null, profile);
    }
  );

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use(strategy);
}

module.exports = setupPassport;
