const Auth0Strategy = require("passport-auth0");
const UserService = require("./services/UserService");

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

  passport.deserializeUser(async function(user, done) {
    const kehuUser = await UserService.findUserByAuth0Id(user.id);

    if (kehuUser) {
      done(null, kehuUser);
    } else {
      const createdUser = await UserService.createUser(user);
      done(null, createdUser);
    }
  });

  passport.use(strategy);
}

module.exports = setupPassport;
