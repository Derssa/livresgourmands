const { Router } = require("express");
const { register, login, me } = require("../controllers/authController");
const { authenticateJwt } = require("../middleware/auth");

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateJwt, me);

module.exports = router;
