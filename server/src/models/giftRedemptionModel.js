const pool = require("../config/db");
const crypto = require("crypto");

function generateToken() {
  return crypto.randomBytes(24).toString("hex");
}

// Create a single redemption per ORDER
async function createRedemption({ orderId, recipientEmail }) {
  const token = generateToken();
  const [result] = await pool.query(
    "INSERT INTO gift_redemptions (order_id, recipient_email, token) VALUES (?, ?, ?)",
    [orderId, recipientEmail, token]
  );
  return { id: result.insertId, token };
}

// Redeem a gift once, granting all books from that order
async function redeemToken({ token, userId }) {
  const [rows] = await pool.query(
    "SELECT * FROM gift_redemptions WHERE token=? AND redeemed_at IS NULL",
    [token]
  );
  const redemption = rows[0];
  if (!redemption) return null;

  // Mark as redeemed
  await pool.query(
    "UPDATE gift_redemptions SET redeemed_by_user_id=?, redeemed_at=NOW() WHERE id=?",
    [userId, redemption.id]
  );

  // Get all books from the related order
  const [orderItems] = await pool.query(
    "SELECT book_id FROM order_items WHERE order_id=?",
    [redemption.order_id]
  );

  // Grant all books to the user
  for (const item of orderItems) {
    await pool.query(
      'INSERT IGNORE INTO user_ebooks (user_id, book_id, source) VALUES (?, ?, "GIFT")',
      [userId, item.book_id]
    );
  }

  return redemption;
}

async function listMyLibrary(userId) {
  const [rows] = await pool.query(
    `SELECT ue.book_id, b.title, b.author, b.description
     FROM user_ebooks ue 
     JOIN books b ON ue.book_id = b.id
     WHERE ue.user_id = ? 
     ORDER BY ue.created_at DESC`,
    [userId]
  );
  return rows;
}

module.exports = { createRedemption, redeemToken, listMyLibrary };
