const { Router } = require("express");
const { body, query, param } = require("express-validator");

const { validateAll } = require("../util/validation");
const checkAuth = require("../middleware/check-auth");
const queryController = require("../controllers/query-controller.js");

const router = Router();

//// UNAUTHENTICATED ROUTES ////

///// AUTHENTICATED ROUTES /////
router.use(checkAuth);

router.get(
  "/channels/:channel/chaincodes/:chaincode/selfBalance",
  [
    param("channel").trim().not().isEmpty().isString(),
    param("chaincode").trim().not().isEmpty().isString(),
    query("tokenId").trim().not().isEmpty().isString(),
    validateAll,
  ],
  queryController.selfBalance
);

router.get(
  "/channels/:channel/chaincodes/:chaincode/balance",
  [
    param("channel").trim().not().isEmpty().isString(),
    param("chaincode").trim().not().isEmpty().isString(),
    query("tokenId").trim().not().isEmpty().isString(),
    query("tokenOwner").trim().not().isEmpty().isString(),
    query("tokenOwnerOrg").trim().not().isEmpty().isString(),
    validateAll,
  ],
  queryController.balance
);

router.get(
  "/channels/:channel/chaincodes/:chaincode/selfCollection",
  [
    param("channel").not().isEmpty(),
    param("chaincode").not().isEmpty(),
    validateAll,
  ],
  queryController.selfCollection
);

router.get(
  "/channels/:channel/chaincodes/:chaincode/collection",
  [
    param("channel").not().isEmpty(),
    param("chaincode").not().isEmpty(),
    validateAll,
  ],
  queryController.collection
);

module.exports = router;
