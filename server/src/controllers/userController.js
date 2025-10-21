const Users = require("../models/userModel");

async function list(req, res) {
  const rows = await Users.listUsers();
  res.json(rows);
}

async function update(req, res) {
  await Users.updateUser(req.params.id, req.body || {});
  res.json({ ok: true });
}

async function remove(req, res) {
  await Users.deleteUser(req.params.id);
  res.status(204).end();
}

module.exports = { list, update, remove };
