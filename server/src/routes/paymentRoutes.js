const { Router } = require("express");
const { authenticateJwt } = require("../middleware/auth");
const Payments = require("../controllers/paymentController");

const router = Router();

router.post("/checkout", authenticateJwt, Payments.createCheckoutSession);

module.exports = router;
