const Joi = require("joi");
const Categories = require("../models/categoryModel");

const createUpdateSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  description: Joi.string().trim().allow(null, "").optional(),
});

async function list(req, res) {
  try {
    const rows = await Categories.listCategories();
    res.json(rows);
  } catch (err) {
    console.error("List categories error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function create(req, res) {
  try {
    const { error, value } = createUpdateSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const category = await Categories.createCategory(value);
    return res.status(201).json(category);
  } catch (err) {
    console.error("Create category error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function update(req, res) {
  try {
    const { error, value } = createUpdateSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    await Categories.updateCategory(req.params.id, value);
    return res.json({ ok: true });
  } catch (err) {
    console.error("Update category error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function remove(req, res) {
  try {
    await Categories.deleteCategory(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error("Delete category error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { list, create, update, remove };
