const pool = require("../config/db");
const crypto = require("crypto");

async function createGiftList({ userId, title, description }) {
  const shareCode = crypto.randomBytes(10).toString("hex");
  const [result] = await pool.query(
    "INSERT INTO gift_lists (user_id, title, description, share_code) VALUES (?, ?, ?, ?)",
    [userId, title, description || null, shareCode]
  );
  return { id: result.insertId, shareCode };
}

async function getGiftListByCode(shareCode) {
  const [rows] = await pool.query(
    "SELECT gl.*, u.first_name, u.last_name FROM gift_lists gl JOIN users u ON gl.user_id = u.id WHERE gl.share_code = ? AND gl.is_active = TRUE",
    [shareCode]
  );
  return rows[0] || null;
}

async function getGiftListItems(giftListId) {
  const [rows] = await pool.query(
    "SELECT gli.*, b.title, b.author, b.price, b.description FROM gift_list_items gli JOIN books b ON gli.book_id = b.id WHERE gli.gift_list_id = ?",
    [giftListId]
  );
  return rows;
}

async function addItemToGiftList({ giftListId, bookId, quantity = 1 }) {
  const [result] = await pool.query(
    "INSERT INTO gift_list_items (gift_list_id, book_id, quantity) VALUES (?, ?, ?)",
    [giftListId, bookId, quantity]
  );
  return { id: result.insertId };
}

async function removeItemFromGiftList(giftListId, bookId) {
  await pool.query(
    "DELETE FROM gift_list_items WHERE gift_list_id = ? AND book_id = ?",
    [giftListId, bookId]
  );
}

async function getUserGiftLists(userId) {
  const [rows] = await pool.query(
    "SELECT * FROM gift_lists WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );
  return rows;
}

async function recordGiftPurchase({
  giftListId,
  buyerUserId,
  bookId,
  quantity,
}) {
  const [result] = await pool.query(
    "INSERT INTO gift_purchases (gift_list_id, buyer_user_id, book_id, quantity) VALUES (?, ?, ?, ?)",
    [giftListId, buyerUserId, bookId, quantity]
  );
  return { id: result.insertId };
}

module.exports = {
  createGiftList,
  getGiftListByCode,
  getGiftListItems,
  addItemToGiftList,
  removeItemFromGiftList,
  getUserGiftLists,
  recordGiftPurchase,
};
