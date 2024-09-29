const { Router } = require("express");
const { body } = require("express-validator");
const { validateAll } = require("../util/validation");
const checkAuth = require("../middleware/check-auth");
const authController = require("../controllers/auth-crontroller.js");

const router = Router();

//// UNAUTHENTICATED ROUTES ////
router.post(
  "/register",
  [
    body("username").trim().not().isEmpty().isString(),
    body("org").trim().not().isEmpty().isString(),
    body("isAdmin").trim().not().isEmpty().isBoolean(),
    validateAll,
  ],
  authController.register
);

///// AUTHENTICATED ROUTES /////
router.use(checkAuth);

module.exports = router;
