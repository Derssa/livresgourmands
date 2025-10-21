const Categories = require("../models/categoryModel");

async function list(req, res) {
  const rows = await Categories.listCategories();
  res.json(rows);
}

async function create(req, res) {
  const c = await Categories.createCategory(req.body || {});
  res.status(201).json(c);
}

async function update(req, res) {
  await Categories.updateCategory(req.params.id, req.body || {});
  res.json({ ok: true });
}

async function remove(req, res) {
  await Categories.deleteCategory(req.params.id);
  res.status(204).end();
}

module.exports = { list, create, update, remove };
