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
      state: false,
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
      return done(null, profile);
    }
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(async function (user, done) {
    try {
      // Check if we need to update facebook userid (user ids changed when
      // moved from Auth0 dev keys to proper production keys)
      if (user.id.startsWith("facebook")) {
        try {
          const currentUser = await Auth0.getUser({ id: user.id });
          if (currentUser.identities[0].provider !== "facebook")
            throw new Error("Auth0 user identity not facebook");

          const oldProfiles = await Auth0.getUsers({
            search_engine: "v3",
            q:
              `nickname:"${currentUser.nickname}" ` +
              `AND identities.connection:facebook ` +
              `AND -user_id:"${currentUser.user_id}"`,
            per_page: 10,
            page: 0,
          });

          logger.info(
            `Found ${oldProfiles.length} matching old Facebook profile(s)`
          );

          for (const profile of oldProfiles) {
            // Double-check that current user's name and nickname are identical
            // to the old user which will be updated
            if (
              currentUser.user_id !== profile.user_id &&
              currentUser.nickname === profile.nickname
            ) {
              const oldUser = await UserService.findUserByAuth0Id(
                profile.user_id
              );
              if (oldUser) {
                await UserService.updateAuth0Id(
                  oldUser.id,
                  currentUser.user_id
                );
                logger.info(
                  `Profile ${oldUser.id} updated (old: ${profile.user_id}, new: ${currentUser.user_id})`
                );
                break;
              } else {
                logger.info(
                  `Matching local profile for ${profile.user_id} not found`
                );
              }
            } else {
              logger.warn(`Double-check failed for ${profile.user_id}`);
            }
          }
        } catch (err) {
          logger.error("Facebook profile update failed");
          logger.error(err);
        }
      }

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
