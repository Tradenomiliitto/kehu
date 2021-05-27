const express = require("express");
const router = express.Router();
const { checkSchema, validationResult } = require("express-validator");
const {
  addKehuSchema,
  sendKehuSchema,
  updateReceivedKehuSchema,
} = require("../../utils/ValidationSchemas");
const KehuService = require("../../services/KehuService");
const logger = require("../../logger");

router.get("/", async (req, res) => {
  try {
    const kehus = await KehuService.getKehus(req.user.id, req.t);
    const sent_kehus = await KehuService.getSentKehus(req.user.id);
    res.json({ kehus, sent_kehus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", checkSchema(addKehuSchema), async (req, res) => {
  try {
    const validations = validationResult(req);
    if (validations.isEmpty()) {
      const kehu = await KehuService.createKehu(req.body, req.t);
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
      const kehu = await KehuService.sendKehu(req.body, req.t);
      res.json({ kehu });
    } else {
      res.status(422).json({ errors: validations.array() });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/lisaa/:claim_id", async (req, res) => {
  try {
    const claimedKehu = await KehuService.claimKehu(
      req.user.id,
      req.params.claim_id
    );
    const kehu = await KehuService.getKehu(req.user.id, claimedKehu.id, req.t);
    res.json({ kehu });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function selectKehuSchema(req, res, next) {
  if (req.user.id !== req.body.giver_id) {
    checkSchema(updateReceivedKehuSchema);
  } else {
    checkSchema(addKehuSchema);
  }
  next();
}

router.put("/:id", selectKehuSchema, async (req, res) => {
  try {
    const validations = validationResult(req);
    if (validations.isEmpty()) {
      const kehu = await KehuService.updateKehu(
        req.user.id,
        req.params.id,
        req.body,
        req.t
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

router.get("/report", async (req, res) => {
  try {
    const xlsxBuffer = await KehuService.excelReport(req.user.id, req.i18n);
    const fileName = req.t("excel-report.filename");

    res.writeHead(200, [
      [
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
      ["Content-Disposition", "attachment; filename=" + fileName],
    ]);
    res.end(Buffer.from(xlsxBuffer, "base64"));
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
