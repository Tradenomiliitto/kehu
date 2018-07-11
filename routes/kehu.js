const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const { checkSchema, validationResult } = require("express-validator/check");
const { kehuSchema } = require("../utils/ValidationSchemas");
const KehuService = require("../services/KehuService");
const logger = require("../logger");

function renderForm(form, req, res) {
  const errors = req.session.errors;
  req.session.errors = null;
  res.render(`kehus/${form}`, {
    user: req.user,
    csrfToken: req.csrfToken(),
    values: req.body,
    errors
  });
}

function renderNewForm(req, res) {
  renderForm("new", req, res);
}

function renderEditForm(req, res) {
  renderForm("edit", req, res);
}

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

router.post("/", checkSchema(kehuSchema), async (req, res, next) => {
  try {
    const validations = validationResult(req);
    if (validations.isEmpty()) {
      const kehu = await KehuService.createKehu(req.body);
      res.redirect(`/kehut/${kehu.id}`);
    } else {
      req.session.errors = validations.array();
      res.redirect("/kehut/uusi");
    }
  } catch (err) {
    logger.error(err.message);
    next(createError(500, err.message));
  }
});

router.get("/uusi", renderNewForm);

router.get("/:id/muokkaa", async (req, res) => {
  req.body = await KehuService.getKehu(req.user.id, req.params.id);
  renderEditForm(req, res);
});

router.put("/:id", checkSchema(kehuSchema), async (req, res, next) => {
  try {
    const validations = validationResult(req);
    if (validations.isEmpty()) {
      await KehuService.updateKehu(req.user.id, req.params.id, req.body);
      res.redirect(`/kehut/${req.params.id}`);
    } else {
      req.session.errors = validations.array();
      res.redirect(`/kehut/${req.params.id}/muokkaa`);
    }
  } catch (err) {
    logger.error(err.message);
    next(createError(500, err.message));
  }
});

router.get("/:id", async (req, res) => {
  const kehu = await KehuService.getKehu(req.user.id, req.params.id);
  res.render("kehus/show", {
    user: req.user,
    kehu
  });
});

router.delete("/:id", async (req, res) => {
  try {
    await KehuService.deleteKehu(req.user.id, req.params.id);
    res.redirect("/kehut");
  } catch (err) {
    logger.error(err.message);
    res.redirect(`/kehut/${req.params.id}`);
  }
});

module.exports = router;
