const { Router } = require("express");
const frontController = require("../controllers/front-controller.js");
const isLoggedIn = require("../middleware/is-logged-in");


const router = Router();

router.get("/register", frontController.getLogin);
router.post("/register", frontController.postLogin);

router.get("/collection", isLoggedIn, frontController.getCollection);

router.get("/selfCollection", isLoggedIn, frontController.getSelfCollection);

router.get("/transfer", isLoggedIn, frontController.getTransfer);

router.get("/selfBalance", isLoggedIn, frontController.getSelfBalance);

router.get("/balance", isLoggedIn, frontController.getBalance);

router.get("/mint", isLoggedIn, frontController.getMint);

router.get("/logout", frontController.getLogout);


module.exports = router;
