const express = require("express");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
const { body, checkSchema, validationResult } = require("express-validator");
const RoleService = require("../../services/RoleService");
const SituationService = require("../../services/SituationService");
const TagService = require("../../services/TagService");
const UserService = require("../../services/UserService");
const FeedService = require("../../services/FeedService");
const { updateProfileSchema } = require("../../utils/ValidationSchemas");
const logger = require("../../logger");
const { getInvitations } = require("../../services/InvitationService");

const MAX_ITEMS = 15;

function getUniqueItems(array) {
  return array.reduce((acc, item) => {
    if (acc.findIndex((it) => it.text === item.text) === -1) {
      acc.push(item);
    }
    return acc;
  }, []);
}

function shuffleArray(array) {
  return array.sort(function () {
    return 0.5 - Math.random();
  });
}

async function getItems(userId, serviceMethod, defaults) {
  const items = await serviceMethod(userId);

  if (items.length > MAX_ITEMS) {
    return getUniqueItems(shuffleArray(items)).slice(0, MAX_ITEMS);
  }

  const itemsWithDefaults = getUniqueItems([
    ...items,
    ...defaults.map((d) => ({ text: d })),
  ]);
  return itemsWithDefaults.slice(0, MAX_ITEMS);
}

router.get("/", async (req, res) => {
  const contactsPromise = UserService.getContacts(req.user.id);
  const rolesPromise = RoleService.getRoles(req.t);
  const situationsPromise = getItems(
    req.user.id,
    SituationService.getUserSituations,
    req.t("default-config.situations", { returnObjects: true }),
  );
  const tagsPromise = getItems(
    req.user.id,
    TagService.getUserTags,
    req.t("default-config.tags", { returnObjects: true }),
  );
  const profile = req.user;
  const feedPromise = FeedService.getFeedItems(req.user.id, req.t);
  const invitationsPromise = getInvitations(req.user.id);

  const [contacts, roles, situations, tags, feed, invitations] =
    await Promise.all([
      contactsPromise,
      rolesPromise,
      situationsPromise,
      tagsPromise,
      feedPromise,
      invitationsPromise,
    ]);

  res.json({ contacts, feed, profile, roles, situations, tags, invitations });
});

router.put(
  "/",
  checkSchema(updateProfileSchema),
  body("email").custom(async (email, { req }) => {
    const user = await UserService.findUserByEmail(email);
    if (user && user.id !== req.user.id) {
      return Promise.reject("Sähköpostiosoite on jo käytössä.");
    }
  }),
  async (req, res) => {
    try {
      const validations = validationResult(req);
      if (validations.isEmpty()) {
        const profile = await UserService.updateProfile(req.user.id, req.body);
        res.json(profile);
      } else {
        res.status(422).json({ errors: validations.array() });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

router.delete("/", async (req, res) => {
  try {
    await UserService.deleteProfile(req.user.id);
    await new Promise((resolve, reject) => {
      req.logout({}, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    res.status(200).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/feed", async (req, res) => {
  const feed = await FeedService.getFeedItems(req.user.id, req.t);
  res.json({ feed });
});

router.get("/cloudinary-signature", (req, res) => {
  logger.info("Sending Cloudinary signature", { params_to_sign: req.query });
  let response;
  try {
    isPermittedToUploadPicture(req);

    response = cloudinary.utils.api_sign_request(
      req.query.data,
      process.env.CLOUDINARY_SECRET,
    );
  } catch (e) {
    logger.info("Unable to generate Cloudinary signature", {
      errorMessage: e.message,
    });
    response = "Error generating Cloudinary signature";
  }
  res.send(response);
});

// Throw an error if user is not permitted to upload the picture
function isPermittedToUploadPicture(req) {
  const { public_id } = req.query.data;
  // User can upload and potentially overwrite only their own temporary group
  // picture (when group is created / updated, the picture is renamed)
  if (public_id.startsWith("new_group_picture")) {
    if (public_id === "new_group_picture_" + req.user.auth0_id) return;
    logger.warn(
      `Unauthorized temporary group picture upload: picture name suffix not matching user id`,
      { public_id, user_id: req.user.auth0_id },
    );
    throw new Error("Unauthorized temporary group picture upload");
  }

  // User can upload and potentially overwrite only their own picture
  if (public_id.startsWith("profile")) {
    if (public_id === "profile_" + req.user.auth0_id) return;
    logger.warn(
      `Unauthorized profile picture upload: picture name suffix not matching user id`,
      { public_id, user_id: req.user.auth0_id },
    );
    throw new Error("Unauthorized profile picture upload");
  }

  throw new Error("Unauthorized picture upload");
}

router.put("/kuva", async (req, res) => {
  try {
    const updatedUser = await UserService.updateProfilePicture(
      req.user.id,
      req.body.picture,
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
