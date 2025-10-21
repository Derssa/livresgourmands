const pool = require("../config/db");

async function findByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    "SELECT id, email, role, first_name, last_name FROM users WHERE id = ?",
    [id]
  );
  return rows[0] || null;
}

async function createUser({
  email,
  passwordHash,
  firstName = null,
  lastName = null,
  role = "CLIENT",
}) {
  const [result] = await pool.query(
    "INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)",
    [email, passwordHash, firstName, lastName, role]
  );
  return { id: result.insertId, email, role };
}

module.exports = { findByEmail, findById, createUser };

async function listUsers() {
  const [rows] = await pool.query(
    "SELECT id, email, role, first_name, last_name, created_at FROM users ORDER BY id DESC"
  );
  return rows;
}

async function updateUser(id, fields = {}) {
  const { firstName, lastName, role } = fields;

  const updates = [];
  const values = [];

  if (firstName !== undefined) {
    updates.push("first_name = ?");
    values.push(firstName);
  }
  if (lastName !== undefined) {
    updates.push("last_name = ?");
    values.push(lastName);
  }
  if (role !== undefined) {
    updates.push("role = ?");
    values.push(role);
  }

  if (updates.length === 0) {
    return;
  }

  values.push(id);
  const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
  await pool.query(sql, values);
}

async function deleteUser(id) {
  await pool.query("DELETE FROM users WHERE id=?", [id]);
}

module.exports.listUsers = listUsers;
module.exports.updateUser = updateUser;
module.exports.deleteUser = deleteUser;
