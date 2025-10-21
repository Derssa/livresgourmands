const { Router } = require("express");
const authRoutes = require("./authRoutes");
const bookRoutes = require("./bookRoutes");
const categoryRoutes = require("./categoryRoutes");
const orderRoutes = require("./orderRoutes");
const paymentRoutes = require("./paymentRoutes");
const userRoutes = require("./userRoutes");
const giftListRoutes = require("./giftListRoutes");
const reviewRoutes = require("./reviewRoutes");
const giftRedeemRoutes = require("./giftRedemptionRoutes");

const router = Router();

router.use("/auth", authRoutes);
router.use("/books", bookRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/users", userRoutes);
router.use("/gift-lists", giftListRoutes);
router.use("/community", reviewRoutes);
router.use("/gifts", giftRedeemRoutes);

module.exports = router;
