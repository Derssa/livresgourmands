const { Router } = require("express");
const { authenticateJwt } = require("../middleware/auth");
const C = require("../controllers/giftRedemptionController");

const router = Router();

// After login, the client calls this with token t to bind the gift to their account
router.post("/redeem", authenticateJwt, C.redeem);

// User's ebook library
router.get("/library", authenticateJwt, C.myLibrary);

module.exports = router;
