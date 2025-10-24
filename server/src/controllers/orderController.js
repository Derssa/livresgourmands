const Joi = require("joi");
const Orders = require("../models/orderModel");

const createOrderSchema = Joi.object({
  total: Joi.number().precision(2).required(),
  paymentMode: Joi.string().trim().allow(null, "").optional(),
  isGift: Joi.boolean().optional(),
  giftRecipientName: Joi.string().trim().allow(null, "").optional(),
  giftRecipientEmail: Joi.string().email().allow(null, "").optional(),
  giftMessage: Joi.string().trim().allow(null, "").optional(),
  items: Joi.array()
    .items(
      Joi.object({
        bookId: Joi.number().integer().required(),
        quantity: Joi.number().integer().min(1).required(),
        priceEach: Joi.number().precision(2).required(),
      })
    )
    .optional(),
});

const addItemSchema = Joi.object({
  bookId: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).required(),
  priceEach: Joi.number().precision(2).required(),
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid("PENDING", "PAID", "SHIPPED", "CANCELLED")
    .required(),
});

async function listMine(req, res) {
  try {
    const rows = await Orders.listOrdersByUser(req.user.id);
    res.json(rows);
  } catch (err) {
    console.error("List orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function create(req, res) {
  try {
    const { error, value } = createOrderSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const order = await Orders.createOrder({
      userId: req.user.id,
      ...value,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
}

async function addItem(req, res) {
  try {
    const { error, value } = addItemSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const orderId = parseInt(req.params.id);

    const item = await Orders.addItemToOrder(orderId, value);

    res.status(201).json(item);
  } catch (err) {
    console.error("Add item to order error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
}

async function updateStatus(req, res) {
  try {
    const { error, value } = updateStatusSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    await require("../config/db").query(
      "UPDATE orders SET status=? WHERE id=?",
      [value.status, req.params.id]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function remove(req, res) {
  try {
    await require("../config/db").query("DELETE FROM orders WHERE id=?", [
      req.params.id,
    ]);
    res.status(204).end();
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
module.exports = { listMine, create, addItem, updateStatus, remove };
