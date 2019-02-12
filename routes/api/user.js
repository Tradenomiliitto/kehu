const express = require("express");
const router = express.Router();
const {
  body,
  checkSchema,
  validationResult
} = require("express-validator/check");
const RoleService = require("../../services/RoleService");
const SituationService = require("../../services/SituationService");
const TagService = require("../../services/TagService");
const UserService = require("../../services/UserService");
const FeedService = require("../../services/FeedService");
const { defaults } = require("../../config");
const { updateProfileSchema } = require("../../utils/ValidationSchemas");

const MAX_ITEMS = 15;

function getUniqueItems(array) {
  return array.reduce((acc, item) => {
    if (acc.findIndex(it => it.text === item.text) === -1) {
      acc.push(item);
    }
    return acc;
  }, []);
}

function shuffleArray(array) {
  return array.sort(function() {
    return 0.5 - Math.random();
  });
}

async function getItems(userId, serviceMethod, defaults) {
  const items = await serviceMethod(userId);

  if (items.length > MAX_ITEMS) {
    return getUniqueItems(shuffleArray(items)).slice(0, MAX_ITEMS);
  }

  const itemsWithDefaults = getUniqueItems([...items, ...defaults]);
  return itemsWithDefaults.slice(0, MAX_ITEMS);
}

router.get("/", async (req, res) => {
  const contacts = await UserService.getContacts(req.user.id);
  const roles = await RoleService.getRoles();
  const situations = await getItems(
    req.user.id,
    SituationService.getUserSituations,
    defaults.situations
  );
  const tags = await getItems(
    req.user.id,
    TagService.getUserTags,
    defaults.tags
  );
  const profile = req.user;
  const feed = await FeedService.getFeedItems(req.user.id);
  res.json({ contacts, feed, profile, roles, situations, tags });
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
  }
);

module.exports = router;
