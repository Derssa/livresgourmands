require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Cors middleware
app.use(cors({ origin: true, credentials: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "livresgourmands-api" });
});

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  require("./controllers/paymentController").stripeWebhook
);

app.use(express.json());
// all routes
app.use("/api", require("./routes"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
