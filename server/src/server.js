require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Core middleware
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
// Mount routes (will be added later)
app.use("/api", require("./routes"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${PORT}`);
});
