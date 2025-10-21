const pool = require("../config/db");

async function userPurchasedBook(userId, bookId) {
  const [rows] = await pool.query(
    `SELECT 1 FROM order_items oi
     JOIN orders o ON oi.order_id = o.id
     WHERE o.user_id = ? AND oi.book_id = ? AND o.status = 'PAID' LIMIT 1`,
    [userId, bookId]
  );
  return rows.length > 0;
}

async function addReview({ userId, bookId, rating }) {
  const [result] = await pool.query(
    "INSERT INTO reviews (user_id, book_id, rating) VALUES (?, ?, ?)",
    [userId, bookId, rating]
  );
  return { id: result.insertId };
}

async function addComment({ userId, bookId, content }) {
  const [result] = await pool.query(
    "INSERT INTO comments (user_id, book_id, content) VALUES (?, ?, ?)",
    [userId, bookId, content]
  );
  return { id: result.insertId };
}

async function listComments(bookId) {
  const [rows] = await pool.query(
    `SELECT c.id, c.content, c.validated, c.created_at, u.first_name, u.last_name
     FROM comments c JOIN users u ON c.user_id = u.id
     WHERE c.book_id = ? AND c.validated = TRUE ORDER BY c.created_at DESC`,
    [bookId]
  );
  return rows;
}

async function validateComment(id, validated) {
  await pool.query("UPDATE comments SET validated=? WHERE id=?", [
    validated,
    id,
  ]);
}

module.exports = {
  userPurchasedBook,
  addReview,
  addComment,
  listComments,
  validateComment,
};
