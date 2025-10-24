const Joi = require("joi");
const Books = require("../models/bookModel");

const bookSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  author: Joi.string().trim().min(1).required(),
  isbn: Joi.string().trim().allow(null, "").optional(),
  price: Joi.number().precision(2).required(),
  stock: Joi.number().integer().min(0).required(),
  description: Joi.string().trim().allow(null, "").optional(),
  categoryId: Joi.number().integer().allow(null).optional(),
  coverImage: Joi.string().trim().allow(null, "").optional(),
  fileUrl: Joi.string().trim().allow(null, "").optional(),
  publishedDate: Joi.date().allow(null).optional(),
});

async function list(req, res) {
  try {
    const rows = await Books.listBooks();
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function get(req, res) {
  try {
    const book = await Books.getBook(req.params.id);
    if (!book) return res.status(404).json({ message: "Not found" });
    return res.json(book);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function create(req, res) {
  try {
    const { error, value } = bookSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const created = await Books.createBook(value);
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err.message });
  }
}

async function update(req, res) {
  try {
    const { error, value } = bookSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    await Books.updateBook(req.params.id, value);
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err.message });
  }
}

async function remove(req, res) {
  try {
    await Books.deleteBook(req.params.id);
    return res.status(204).end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { list, get, create, update, remove };
