const { Router } = require("express");
const { body, query, param } = require("express-validator");

const { validateAll } = require("../util/validation");
const queryController = require("../controllers/query-controller.js");

const router = Router();

router.get(
  "/channels/:channel/chaincodes/:chaincode/getCar",
  [
    param("channel").trim().not().isEmpty().isString(),
    param("chaincode").trim().not().isEmpty().isString(),
    query("id").trim().not().isEmpty().isString(),
    validateAll,
  ],
  queryController.getCar
);

module.exports = router;
