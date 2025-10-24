const Joi = require("joi");
const Users = require("../models/userModel");

const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  role: Joi.string().valid("CLIENT", "ADMIN", "EDITOR", "MANAGER").optional(),
});

async function list(req, res) {
  try {
    const rows = await Users.listUsers();
    return res.json(rows);
  } catch (err) {
    console.error("List users error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function update(req, res) {
  try {
    const { error, value } = updateUserSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    await Users.updateUser(req.params.id, value);
    return res.json({ ok: true });
  } catch (err) {
    console.error("Update user error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function remove(req, res) {
  try {
    await Users.deleteUser(req.params.id);
    return res.status(204).end();
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { list, update, remove };
