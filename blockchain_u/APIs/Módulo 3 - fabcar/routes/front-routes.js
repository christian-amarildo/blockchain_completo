const { Router } = require("express");
const frontController = require("../controllers/front-controller.js");

const router = Router();

router.post("/createCar",frontController.createCar);
router.post("/getCar",frontController.getCar);

module.exports = router;
