const express = require("express");
const router = express.Router();
const RoleService = require("../../services/RoleService");
const SituationService = require("../../services/SituationService");
const TagService = require("../../services/TagService");
const { defaults } = require("../../config");

const MAX_ITEMS = 15;

function shuffleArray(array) {
  return array.sort(function() {
    return 0.5 - Math.random();
  });
}

function randomItemsFromArray(array, numberOfItems) {
  const shuffledArray = shuffleArray(array);
  return shuffledArray.slice(0, numberOfItems);
}

async function getItems(userId, serviceMethod) {
  const items = await serviceMethod(userId);

  if (items.length > MAX_ITEMS) {
    return shuffleArray(items).slice(0, MAX_ITEMS);
  }

  const additionalItems = randomItemsFromArray(
    defaults.tags,
    MAX_ITEMS - items.length
  );
  return [...items, ...additionalItems];
}

router.get("/", async (req, res) => {
  const roles = await RoleService.getRoles();
  const situations = await getItems(
    req.user.id,
    SituationService.getUserSituations
  );
  const tags = await getItems(req.user.id, TagService.getUserTags);
  const profile = req.user;
  res.json({ profile, roles, situations, tags });
});

module.exports = router;
