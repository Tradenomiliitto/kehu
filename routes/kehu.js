const express = require("express");
const router = express.Router();
const { checkSchema, validationResult } = require("express-validator/check");
const { kehuSchema } = require("../utils/ValidationSchemas");
const KehuService = require("../services/KehuService");
const logger = require("../logger");

function renderForm(form, req, res) {
  const { values, errors } = req.session;
  req.session.errors = null;
  req.session.values = null;
  res.render(`kehus/${form}`, {
    user: req.user,
    csrfToken: req.csrfToken(),
    values,
    errors
  });
}

function renderNewForm(req, res) {
  renderForm("new", req, res);
}

function renderEditForm(req, res) {
  renderForm("edit", req, res);
}

function renderIndexWithErrorMessage(req, res, error, message) {
  logger.error(error.stack);
  req.flash("error", `${message}: ${error.message}`);
  res.render("kehus/index", {
    user: req.user,
    kehus: []
  });
}

router.get("/", async (req, res) => {
  try {
    const kehus = await KehuService.getKehus(req.user.id);
    res.render("kehus/index", {
      user: req.user,
      kehus
    });
  } catch (err) {
    renderIndexWithErrorMessage(
      req,
      res,
      err,
      "Lataamisen aikana tapahtui virhe"
    );
  }
});

router.post("/", checkSchema(kehuSchema), async (req, res) => {
  try {
    const validations = validationResult(req);
    if (validations.isEmpty()) {
      const kehu = await KehuService.createKehu(req.body);
      req.flash("success", "Kehun lisääminen onnistui.");
      res.redirect(`/kehut/${kehu.id}`);
    } else {
      req.session.errors = validations.array();
      req.session.values = req.body;
      res.redirect("/kehut/uusi");
    }
  } catch (err) {
    renderIndexWithErrorMessage(
      req,
      res,
      err,
      "Kehun lisäämisessä tapahtui virhe"
    );
  }
});

router.get("/uusi", renderNewForm);

router.get("/:id/muokkaa", async (req, res) => {
  if (!req.session.values) {
    req.session.values = await KehuService.getKehu(req.user.id, req.params.id);
  }
  renderEditForm(req, res);
});

router.put("/:id", checkSchema(kehuSchema), async (req, res) => {
  try {
    const validations = validationResult(req);
    if (validations.isEmpty()) {
      await KehuService.updateKehu(req.user.id, req.params.id, req.body);
      req.flash("success", "Kehun tallennus onnistui.");
      res.redirect(`/kehut/${req.params.id}`);
    } else {
      req.session.errors = validations.array();
      req.session.values = req.body;
      res.redirect(`/kehut/${req.params.id}/muokkaa`);
    }
  } catch (err) {
    logger.error(err.stack);
    req.flash("error", `Kehun tallennus epäonnistui. Virhe: ${err.message}`);
    res.redirect(`/kehut/${req.params.id}`);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const kehu = await KehuService.getKehu(req.user.id, req.params.id);

    if (!kehu) {
      return res.render("kehus/not-found", {
        user: req.user
      });
    }

    res.render("kehus/show", {
      user: req.user,
      kehu,
      csrfToken: req.csrfToken()
    });
  } catch (err) {
    renderIndexWithErrorMessage(
      req,
      res,
      err,
      "Kehun lataamisessa tapahtui virhe"
    );
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await KehuService.deleteKehu(req.user.id, req.params.id);
    req.flash("success", "Kehun poistaminen onnistui.");
    res.redirect("/kehut");
  } catch (err) {
    logger.error(err.stack);
    req.flash("error", `Kehun poisto epäonnistui. Virhe: ${err.message}`);
    res.redirect(`/kehut/${req.params.id}`);
  }
});

module.exports = router;
