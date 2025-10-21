const pool = require("../config/db");

async function listOrdersByUser(userId) {
  const [rows] = await pool.query(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC",
    [userId]
  );
  return rows;
}

async function createOrder({
  userId,
  total,
  status = "PENDING",
  paymentMode = null,
  isGift = false,
  giftRecipientName = null,
  giftRecipientEmail = null,
  giftMessage = null,
}) {
  const [result] = await pool.query(
    "INSERT INTO orders (user_id, total, status, payment_mode, is_gift, gift_recipient_name, gift_recipient_email, gift_message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      userId,
      total,
      status,
      paymentMode,
      isGift,
      giftRecipientName,
      giftRecipientEmail,
      giftMessage,
    ]
  );
  return { id: result.insertId };
}

module.exports = { listOrdersByUser, createOrder };
