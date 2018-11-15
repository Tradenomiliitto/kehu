const express = require("express");
const router = express.Router();
const { checkSchema, validationResult } = require("express-validator/check");
const { kehuSchema } = require("../../utils/ValidationSchemas");
const KehuService = require("../../services/KehuService");

router.post("/kehu", checkSchema(kehuSchema), async (req, res) => {
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

module.exports = router;
