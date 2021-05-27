const Auth0Strategy = require("passport-auth0");
const UserService = require("./services/UserService");
const Auth0 = require("./utils/Auth0Client");
const logger = require("./logger");

function setupPassport(passport) {
  const strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL,
      state: false
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
      return done(null, profile);
    }
  );

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(async function(user, done) {
    try {
      const kehuUser = await UserService.findUserByAuth0Id(user.id);

      if (kehuUser) {
        done(null, kehuUser);
        /* Profile picture comparison to Auth0 disabled after own profile
           picture uploading was taken into use. This means that updates
           on social media profile pictures are not reflected in Kehu
           after profile creation
        const auth0User = await Auth0.getUser({ id: user.id });
        const parsedUser = UserService.parseUser(auth0User);
        if (kehuUser.picture === parsedUser.picture) {
          done(null, kehuUser);
        } else {
          const updatedUser = await UserService.updateProfilePicture(
            kehuUser.id,
            parsedUser.picture
          );
          done(null, updatedUser);
        }*/
      } else {
        const createdUser = await UserService.createUserFromAuth0(user);
        done(null, createdUser);
      }
    } catch (e) {
      logger.error(`Deserializing user failed.`);
      logger.error(e);
      done(e, null);
    }
  });

  passport.use(strategy);
}

module.exports = setupPassport;
