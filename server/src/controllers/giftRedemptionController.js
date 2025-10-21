const Gifts = require("../models/giftRedemptionModel");

async function redeem(req, res) {
  const token = req.query.t || req.body.token;
  if (!token) return res.status(400).json({ message: "token required" });
  const redemption = await Gifts.redeemToken({ token, userId: req.user.id });
  if (!redemption)
    return res
      .status(400)
      .json({ message: "Invalid or already redeemed token" });
  res.json({ ok: true, bookId: redemption.book_id });
}

async function myLibrary(req, res) {
  const rows = await Gifts.listMyLibrary(req.user.id);
  res.json(rows);
}

module.exports = { redeem, myLibrary };
