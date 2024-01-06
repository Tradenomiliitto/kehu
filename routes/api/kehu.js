const express = require("express");
const router = express.Router();
const { checkSchema, validationResult } = require("express-validator");
const {
  addKehuSchema,
  sendKehuSchema,
  sendGroupKehuSchema,
  updateReceivedKehuSchema,
} = require("../../utils/ValidationSchemas");
const KehuService = require("../../services/KehuService");
const logger = require("../../logger");

router.get("/", async (req, res) => {
  try {
    const kehus = await KehuService.getKehus(req.user.id, req.t);
    const sent_kehus = await KehuService.getSentKehus(req.user.id, req.t);
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

router.post("/laheta", checkSchema(sendKehuSchema), validateAndSendKehu);
router.post("/group", checkSchema(sendGroupKehuSchema), validateAndSendKehu);

async function validateAndSendKehu(req, res) {
  try {
    const validations = validationResult(req);
    if (validations.isEmpty()) {
      const giver_name = req.user.first_name + " " + req.user.last_name;
      const data = { giver_id: req.user.id, giver_name, ...req.body };
      const kehu = await KehuService.sendKehu(data, req.t);
      res.json({ kehu });
    } else {
      res
        .status(422)
        // Schema has only one error message for each parameter so we shouln't
        // return the same message multiple times -> onlyFirstError: true
        .json({ errors: validations.array({ onlyFirstError: true }) });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

router.get("/lisaa/:claim_id", async (req, res) => {
  try {
    const claimedKehu = await KehuService.claimKehu(
      req.user.id,
      req.params.claim_id,
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
        req.t,
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
