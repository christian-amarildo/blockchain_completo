const { Router } = require("express");
const { body, param } = require("express-validator");

const { validateAll } = require("../util/validation");
const invokeController = require("../controllers/invoke-controller.js");

const router = Router();

router.post(
  "/channels/:channel/chaincodes/:chaincode/createCar",
  [
    param("channel").trim().not().isEmpty().isString(),
    param("chaincode").trim().not().isEmpty().isString(),
    body("id").trim().not().isEmpty().isString(),
    body("make").trim().not().isEmpty().isString(),
    body("model").trim().not().isEmpty().isString(),
    body("colour").trim().not().isEmpty().isString(),
    body("owner").trim().not().isEmpty().isString(),
    validateAll,
  ],
  invokeController.createCar
);

module.exports = router;
