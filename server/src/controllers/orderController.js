const Orders = require("../models/orderModel");

async function listMine(req, res) {
  const rows = await Orders.listOrdersByUser(req.user.id);
  res.json(rows);
}

async function create(req, res) {
  try {
    const {
      total,
      paymentMode,
      isGift,
      giftRecipientName,
      giftRecipientEmail,
      giftMessage,
      items,
    } = req.body || {};

    const order = await Orders.createOrder({
      userId: req.user.id,
      total,
      paymentMode,
      isGift,
      giftRecipientName,
      giftRecipientEmail,
      giftMessage,
      items,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  }
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
