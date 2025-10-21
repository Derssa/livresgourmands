const Orders = require("../models/orderModel");

async function listMine(req, res) {
  const rows = await Orders.listOrdersByUser(req.user.id);
  res.json(rows);
}

async function create(req, res) {
  const {
    total,
    paymentMode,
    isGift = false,
    giftRecipientName,
    giftRecipientEmail,
    giftMessage,
  } = req.body || {};

  const order = await Orders.createOrder({
    userId: req.user.id,
    total,
    paymentMode,
    isGift,
    giftRecipientName,
    giftRecipientEmail,
    giftMessage,
  });
  res.status(201).json(order);
}

module.exports = { listMine, create };
async function updateStatus(req, res) {
  const { status } = req.body || {};
  await require("../config/db").query("UPDATE orders SET status=? WHERE id=?", [
    status,
    req.params.id,
  ]);
  res.json({ ok: true });
}

async function remove(req, res) {
  await require("../config/db").query("DELETE FROM orders WHERE id=?", [
    req.params.id,
  ]);
  res.status(204).end();
}

module.exports.updateStatus = updateStatus;
module.exports.remove = remove;
