const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const KehuService = require("../services/KehuService");
const logger = require("../logger");

router.get("/", async (req, res, next) => {
  try {
    const kehus = await KehuService.getKehus(req.user.id);
    res.render("kehus/index", {
      user: req.user,
      kehus
    });
  } catch (err) {
    logger.error(err.message);
    next(createError(500, err.message));
  }
});

router.post("/", async (req, res, next) => {
  try {
    const kehu = await KehuService.createKehu(req.body);
    res.redirect(`/kehu/${kehu.id}`);
  } catch (err) {
    logger.error(err.message);
    next(createError(500, err.message));
  }
});

router.get("/new", (req, res) => {
  res.render("kehus/new", {
    user: req.user,
    csrfToken: req.csrfToken()
  });
});

router.get("/:id", async (req, res) => {
  const kehu = await KehuService.getKehu(req.user.id, req.params.id);
  res.render("kehus/show", {
    user: req.user,
    kehu
  });
});

module.exports = router;
