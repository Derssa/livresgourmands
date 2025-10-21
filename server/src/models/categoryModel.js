const pool = require("../config/db");

async function listCategories() {
  const [rows] = await pool.query("SELECT * FROM categories ORDER BY name ASC");
  return rows;
}

async function createCategory({ name, description }) {
  const [result] = await pool.query(
    "INSERT INTO categories (name, description) VALUES (?, ?)",
    [name, description || null]
  );
  return { id: result.insertId, name, description: description || null };
}

async function updateCategory(id, { name, description }) {
  await pool.query("UPDATE categories SET name=?, description=? WHERE id=?", [
    name,
    description || null,
    id,
  ]);
}

async function deleteCategory(id) {
  await pool.query("DELETE FROM categories WHERE id=?", [id]);
}

module.exports = {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
