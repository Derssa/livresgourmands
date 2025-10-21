const Books = require("../models/bookModel");

async function list(req, res) {
  try {
    const rows = await Books.listBooks();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function get(req, res) {
  try {
    const book = await Books.getBook(req.params.id);
    if (!book) return res.status(404).json({ message: "Not found" });
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function create(req, res) {
  try {
    const created = await Books.createBook(req.body || {});
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

async function update(req, res) {
  try {
    await Books.updateBook(req.params.id, req.body || {});
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

async function remove(req, res) {
  try {
    await Books.deleteBook(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { list, get, create, update, remove };
