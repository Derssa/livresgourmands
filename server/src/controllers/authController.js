const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");

async function register(req, res) {
  const { email, password, firstName, lastName } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ message: "email and password are required" });
  const existing = await Users.findByEmail(email);
  if (existing)
    return res.status(409).json({ message: "Email already in use" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await Users.createUser({
    email,
    passwordHash,
    firstName,
    lastName,
    role: "CLIENT",
  });
  return res.status(201).json(user);
}

async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ message: "email and password are required" });
  const user = await Users.findByEmail(email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "7d" }
  );
  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.first_name,
      lastName: user.last_name,
    },
  });
}

async function me(req, res) {
  const user = await Users.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json(user);
}

module.exports = { register, login, me };
