const express = require("express");
const router = express.Router();
const { checkSchema, validationResult } = require("express-validator/check");
const {
  addKehuSchema,
  sendKehuSchema
} = require("../../utils/ValidationSchemas");
const KehuService = require("../../services/KehuService");

router.get("/", async (req, res) => {
  try {
    const kehus = await KehuService.getKehus(req.user.id);
    res.json(kehus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", checkSchema(addKehuSchema), async (req, res) => {
  try {
    const validations = validationResult(req);
    if (validations.isEmpty()) {
      const kehu = await KehuService.createKehu(req.body);
      res.json({ kehu });
    } else {
      res.status(422).json({ errors: validations.array() });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/laheta", checkSchema(sendKehuSchema), async (req, res) => {
  try {
    const validations = validationResult(req);
    if (validations.isEmpty()) {
      await KehuService.sendKehu(req.body);
      res.status(203).json({});
    } else {
      res.status(422).json({ errors: validations.array() });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", checkSchema(addKehuSchema), async (req, res) => {
  try {
    const validations = validationResult(req);
    if (validations.isEmpty()) {
      const kehu = await KehuService.updateKehu(
        req.user.id,
        req.params.id,
        req.body
      );
      res.json({ kehu });
    } else {
      res.status(422).json({ errors: validations.array() });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await KehuService.deleteKehu(req.user.id, req.params.id);
    res.status(203).send();
  } catch (err) {
    logger.error(err.stack);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
