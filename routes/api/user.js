const express = require("express");
const router = express.Router();
const RoleService = require("../../services/RoleService");
const SituationService = require("../../services/SituationService");
const TagService = require("../../services/TagService");
const { getContacts } = require("../../services/UserService");
const { defaults } = require("../../config");

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
  const contacts = await getContacts(req.user.id);
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
  res.json({ contacts, profile, roles, situations, tags });
});

module.exports = router;
