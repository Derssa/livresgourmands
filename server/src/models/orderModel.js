const pool = require("../config/db");

async function listOrdersByUser(userId) {
  const [orders] = await pool.query(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC",
    [userId]
  );

  // Fetch order items for each order
  for (const order of orders) {
    const [items] = await pool.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [order.id]
    );
    order.items = items;
  }

  return orders;
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
  items = [],
}) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [orderResult] = await conn.query(
      `INSERT INTO orders 
        (user_id, total, status, payment_mode, is_gift, gift_recipient_name, gift_recipient_email, gift_message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
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
    const orderId = orderResult.insertId;

    for (const item of items) {
      await conn.query(
        "INSERT INTO order_items (order_id, book_id, quantity, price_each) VALUES (?, ?, ?, ?)",
        [orderId, item.bookId, item.quantity, item.priceEach]
      );
    }

    await conn.commit();
    return { id: orderId };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { listOrdersByUser, createOrder };
